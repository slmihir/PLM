import axios from 'axios';

export class OllamaLLM {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string, model: string = 'llama3') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generate(prompt: string, context?: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model: this.model,
        prompt: context ? `${context}\n\n${prompt}` : prompt,
        stream: false,
      });

      return response.data.response;
    } catch (error: any) {
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/chat`, {
        model: this.model,
        messages,
        stream: false,
      });

      return response.data.message.content;
    } catch (error: any) {
      throw new Error(`Ollama API error: ${error.message}`);
    }
  }

  async classifyIntent(userMessage: string): Promise<{
    intent: string;
    persona: string;
    confidence: number;
  }> {
    const prompt = `Classify the following user message and determine:
1. The intent (create_product, review_product, manage_inventory, etc.)
2. The persona type (designer, tech_spec, pattern_master, sourcing)
3. Confidence level (0-1)

User message: "${userMessage}"

Respond in JSON format: {"intent": "...", "persona": "...", "confidence": 0.9}`;

    try {
      const response = await this.generate(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { intent: 'unknown', persona: 'unknown', confidence: 0 };
    } catch (error) {
      return { intent: 'unknown', persona: 'unknown', confidence: 0 };
    }
  }
}

