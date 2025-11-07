import WebSocket from 'ws';
import { MCPMessage, MCPToolCall, MCPToolResult } from './types';

export class MCPClient {
  private ws: WebSocket;
  private messageId: number = 0;
  private pendingMessages: Map<number | string, { resolve: Function; reject: Function }> = new Map();

  constructor(url: string) {
    this.ws = new WebSocket(url);

    this.ws.on('message', (data: Buffer) => {
      const message: MCPMessage = JSON.parse(data.toString());
      this.handleMessage(message);
    });

    this.ws.on('error', (error) => {
      console.error('MCP Client error:', error);
    });
  }

  private handleMessage(message: MCPMessage): void {
    if (message.id !== undefined) {
      const pending = this.pendingMessages.get(message.id);
      if (pending) {
        this.pendingMessages.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result);
        }
      }
    }
  }

  private sendRequest(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.messageId;
      const message: MCPMessage = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      };

      this.pendingMessages.set(id, { resolve, reject });

      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      } else {
        this.ws.once('open', () => {
          this.ws.send(JSON.stringify(message));
        });
      }
    });
  }

  async listTools(): Promise<any[]> {
    const result = await this.sendRequest('tools/list');
    return result.tools || [];
  }

  async callTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    const result = await this.sendRequest('tools/call', {
      name: toolCall.name,
      arguments: toolCall.arguments,
    });
    return result;
  }

  async listResources(): Promise<any[]> {
    const result = await this.sendRequest('resources/list');
    return result.resources || [];
  }

  async readResource(uri: string): Promise<any> {
    const result = await this.sendRequest('resources/read', { uri });
    return result;
  }

  async listPrompts(): Promise<any[]> {
    const result = await this.sendRequest('prompts/list');
    return result.prompts || [];
  }

  async getPrompt(name: string, args?: Record<string, any>): Promise<string> {
    const result = await this.sendRequest('prompts/get', { name, arguments: args });
    return result.messages[0].content.text;
  }

  close(): void {
    this.ws.close();
  }
}

