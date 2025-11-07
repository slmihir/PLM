import { WebSocketServer, WebSocket } from 'ws';
import { MCPMessage, MCPError, MCPToolResult } from './types';
import { MCPHandlers } from './handlers';

export class MCPServer {
  private wss: WebSocketServer;
  private handlers: MCPHandlers;
  private connections: Map<WebSocket, string> = new Map();

  constructor(port: number) {
    this.handlers = new MCPHandlers();
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws: WebSocket) => {
      this.handleConnection(ws);
    });
  }

  private handleConnection(ws: WebSocket): void {
    ws.on('message', async (data: Buffer) => {
      try {
        const message: MCPMessage = JSON.parse(data.toString());
        const response = await this.handleMessage(message, ws);
        if (response) {
          ws.send(JSON.stringify(response));
        }
      } catch (error) {
        const errorResponse: MCPMessage = {
          jsonrpc: '2.0',
          id: undefined,
          error: {
            code: -32700,
            message: 'Parse error',
            data: error instanceof Error ? error.message : String(error),
          },
        };
        ws.send(JSON.stringify(errorResponse));
      }
    });

    ws.on('close', () => {
      this.connections.delete(ws);
    });

    // Send initialize response
    const initResponse: MCPMessage = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
        serverInfo: {
          name: 'virgio-mcp-server',
          version: '1.0.0',
        },
      },
    };
    ws.send(JSON.stringify(initResponse));
  }

  private async handleMessage(message: MCPMessage, ws: WebSocket): Promise<MCPMessage | null> {
    const { method, params, id } = message;

    switch (method) {
      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: this.handlers.getAllTools(),
          },
        };

      case 'tools/call':
        return await this.handleToolCall(id, params);

      case 'resources/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            resources: [],
          },
        };

      case 'resources/read':
        return await this.handleResourceRead(id, params);

      case 'prompts/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            prompts: this.handlers.getAllPrompts(),
          },
        };

      case 'prompts/get':
        return await this.handlePromptGet(id, params);

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: 'Method not found',
          },
        };
    }
  }

  private async handleToolCall(id: string | number | undefined, params: any): Promise<MCPMessage> {
    const { name, arguments: args } = params;
    const toolData = this.handlers.getTool(name);

    if (!toolData) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Tool ${name} not found`,
        },
      };
    }

    try {
      const result: MCPToolResult = await toolData.handler(args || {});
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: result.content,
          isError: result.isError || false,
        },
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: error instanceof Error ? error.message : String(error),
            },
          ],
          isError: true,
        },
      };
    }
  }

  private async handleResourceRead(id: string | number | undefined, params: any): Promise<MCPMessage> {
    const { uri } = params;
    const handler = this.handlers.getResourceHandler(uri);

    if (!handler) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Resource handler for ${uri} not found`,
        },
      };
    }

    try {
      const resource = await handler(uri);
      return {
        jsonrpc: '2.0',
        id,
        result: {
          contents: [
            {
              uri: resource.uri,
              mimeType: resource.mimeType || 'text/plain',
            },
          ],
        },
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  private async handlePromptGet(id: string | number | undefined, params: any): Promise<MCPMessage> {
    const { name, arguments: args } = params;
    const promptData = this.handlers.getPrompt(name);

    if (!promptData) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Prompt ${name} not found`,
        },
      };
    }

    try {
      const result = await promptData.handler(args || {});
      return {
        jsonrpc: '2.0',
        id,
        result: {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: result,
              },
            },
          ],
        },
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  getHandlers(): MCPHandlers {
    return this.handlers;
  }

  close(): void {
    this.wss.close();
  }
}

