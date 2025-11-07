import { AgentOrchestrator } from './orchestration/orchestrator';
import { OllamaLLM } from './llm/ollama-llm';
import { MCPClientManager } from './mcp-clients/mcp-client-manager';

const orchestrator = new AgentOrchestrator(
  new OllamaLLM(
    process.env.OLLAMA_URL || 'http://localhost:11434',
    process.env.OLLAMA_MODEL || 'llama3',
  ),
  new MCPClientManager(),
);

orchestrator.start(5000);
console.log('Seedling IP Co-Pilot Agent running on port 5000');

