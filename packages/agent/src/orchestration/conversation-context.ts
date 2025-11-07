export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export class ConversationContext {
  private sessionId: string;
  private messages: ConversationMessage[] = [];
  private maxHistory: number = 50;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  addMessage(
    role: 'user' | 'assistant',
    content: string,
    metadata?: any,
  ): void {
    this.messages.push({
      role,
      content,
      timestamp: new Date(),
      metadata,
    });

    // Keep only recent messages
    if (this.messages.length > this.maxHistory) {
      this.messages = this.messages.slice(-this.maxHistory);
    }
  }

  getHistory(): ConversationMessage[] {
    return this.messages;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  clear(): void {
    this.messages = [];
  }
}

