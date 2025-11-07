import { MCPClient } from '@virgio/mcp-core';

export class MCPClientManager {
  private clients: Map<string, MCPClient> = new Map();

  constructor() {
    // Initialize MCP clients for each persona
    this.clients.set('designer', new MCPClient('ws://localhost:4001'));
    this.clients.set('tech_spec', new MCPClient('ws://localhost:4002'));
    this.clients.set('pattern_master', new MCPClient('ws://localhost:4003'));
    this.clients.set('sourcing', new MCPClient('ws://localhost:4004'));
  }

  getClient(persona: string): MCPClient | undefined {
    return this.clients.get(persona);
  }

  async callTool(persona: string, toolName: string, args: Record<string, any>): Promise<any> {
    const client = this.getClient(persona);
    if (!client) {
      throw new Error(`No MCP client found for persona: ${persona}`);
    }

    return client.callTool({
      name: toolName,
      arguments: args,
    });
  }

  async listTools(persona: string): Promise<any[]> {
    const client = this.getClient(persona);
    if (!client) {
      return [];
    }

    return client.listTools();
  }

  async getResource(persona: string, uri: string): Promise<any> {
    const client = this.getClient(persona);
    if (!client) {
      return null;
    }

    return client.readResource(uri);
  }
}

