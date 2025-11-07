import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { OllamaLLM } from '../llm/ollama-llm';
import { MCPClientManager } from '../mcp-clients/mcp-client-manager';
import { ConversationContext } from './conversation-context';

export class AgentOrchestrator {
  private llm: OllamaLLM;
  private mcpManager: MCPClientManager;
  private contexts: Map<string, ConversationContext> = new Map();
  private wss: WebSocketServer;

  constructor(llm: OllamaLLM, mcpManager: MCPClientManager) {
    this.llm = llm;
    this.mcpManager = mcpManager;
  }

  start(port: number): void {
    const server = createServer();
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      const sessionId = this.generateSessionId();
      this.contexts.set(sessionId, new ConversationContext(sessionId));

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          const response = await this.handleMessage(sessionId, message);
          ws.send(JSON.stringify(response));
        } catch (error: any) {
          ws.send(
            JSON.stringify({
              error: error.message,
            }),
          );
        }
      });

      ws.on('close', () => {
        this.contexts.delete(sessionId);
      });

      ws.send(
        JSON.stringify({
          type: 'connected',
          sessionId,
        }),
      );
    });

    server.listen(port, () => {
      console.log(`Agent orchestrator WebSocket server listening on port ${port}`);
    });
  }

  private async handleMessage(sessionId: string, message: any): Promise<any> {
    const context = this.contexts.get(sessionId);
    if (!context) {
      throw new Error('Session not found');
    }

    const { text, persona } = message;

    // Classify intent
    const intentResult = await this.llm.classifyIntent(text);
    context.addMessage('user', text, intentResult);

    // Route to appropriate MCP server
    const personaKey = this.mapPersonaToKey(persona || intentResult.persona);
    const tools = await this.mcpManager.listTools(personaKey);

    // Use LLM to select appropriate tool
    const toolSelection = await this.selectTool(
      text,
      tools,
      context.getHistory(),
    );

    if (toolSelection) {
      try {
        const result = await this.mcpManager.callTool(
          personaKey,
          toolSelection.name,
          toolSelection.args,
        );

        context.addMessage('assistant', `Executed ${toolSelection.name}`, {
          intent: intentResult.intent,
          persona: personaKey,
          toolResult: result,
        });

        return {
          type: 'response',
          text: this.formatToolResult(result),
          toolUsed: toolSelection.name,
        };
      } catch (error: any) {
        return {
          type: 'error',
          text: `Error executing tool: ${error.message}`,
        };
      }
    }

    // Fallback to direct LLM response
    const llmResponse = await this.llm.chat([
      ...context.getHistory().map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: text },
    ]);

    context.addMessage('assistant', llmResponse, intentResult);

    return {
      type: 'response',
      text: llmResponse,
    };
  }

  private async selectTool(
    userMessage: string,
    tools: any[],
    history: any[],
  ): Promise<{ name: string; args: Record<string, any> } | null> {
    const toolDescriptions = tools
      .map((t) => `${t.name}: ${t.description}`)
      .join('\n');

    const prompt = `Given the user message and available tools, select the most appropriate tool and extract arguments.

Available tools:
${toolDescriptions}

User message: "${userMessage}"

Recent conversation:
${history.slice(-3).map((m) => `${m.role}: ${m.content}`).join('\n')}

Respond in JSON format: {"tool": "tool_name", "args": {...}} or null if no tool needed.`;

    try {
      const response = await this.llm.generate(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.tool) {
          return { name: parsed.tool, args: parsed.args || {} };
        }
      }
    } catch (error) {
      // Fallback: try to match tool name from message
      for (const tool of tools) {
        if (userMessage.toLowerCase().includes(tool.name.toLowerCase())) {
          return { name: tool.name, args: {} };
        }
      }
    }

    return null;
  }

  private formatToolResult(result: any): string {
    if (result.content && Array.isArray(result.content)) {
      return result.content
        .map((c: any) => (c.type === 'text' ? c.text : JSON.stringify(c)))
        .join('\n');
    }
    return JSON.stringify(result);
  }

  private mapPersonaToKey(persona: string): string {
    const mapping: Record<string, string> = {
      designer: 'designer',
      tech_spec: 'tech_spec',
      pattern_master: 'pattern_master',
      sourcing: 'sourcing',
    };
    return mapping[persona.toLowerCase()] || 'designer';
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

