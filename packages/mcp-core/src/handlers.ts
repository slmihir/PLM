import { MCPTool, MCPToolHandler, MCPResourceHandler, MCPPromptHandler } from './types';

export class MCPHandlers {
  private tools: Map<string, { tool: MCPTool; handler: MCPToolHandler }> = new Map();
  private resources: Map<string, MCPResourceHandler> = new Map();
  private prompts: Map<string, { prompt: any; handler: MCPPromptHandler }> = new Map();

  registerTool(tool: MCPTool, handler: MCPToolHandler): void {
    this.tools.set(tool.name, { tool, handler });
  }

  registerResource(uriPattern: string, handler: MCPResourceHandler): void {
    this.resources.set(uriPattern, handler);
  }

  registerPrompt(name: string, prompt: any, handler: MCPPromptHandler): void {
    this.prompts.set(name, { prompt, handler });
  }

  getTool(name: string): { tool: MCPTool; handler: MCPToolHandler } | undefined {
    return this.tools.get(name);
  }

  getAllTools(): MCPTool[] {
    return Array.from(this.tools.values()).map(({ tool }) => tool);
  }

  getResourceHandler(uri: string): MCPResourceHandler | undefined {
    // Simple pattern matching - can be enhanced
    for (const [pattern, handler] of this.resources.entries()) {
      if (uri.startsWith(pattern) || uri === pattern) {
        return handler;
      }
    }
    return undefined;
  }

  getPrompt(name: string): { prompt: any; handler: MCPPromptHandler } | undefined {
    return this.prompts.get(name);
  }

  getAllPrompts(): any[] {
    return Array.from(this.prompts.values()).map(({ prompt }) => prompt);
  }
}

