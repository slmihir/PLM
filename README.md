# VIRGIO PLM System - Phase 1

A Product Lifecycle Management system built with NestJS, Next.js, and MCP (Model Context Protocol) architecture.

## Architecture

5-layer architecture:
1. **Persona Layer**: User interfaces (Designer, Tech Spec, Pattern Master, etc.)
2. **MCP Persona-to-Agent Layer**: MCP microservices for each persona
3. **Seedling IP Co-Pilot**: AI agent orchestrator (Ollama/Llama)
4. **MCP Agent-to-Lifecycle Layer**: MCP servers for lifecycle stages
5. **Lifecycle Layer**: Core PLM modules (Universe, Design, Tech Pack, Sampling)

## Technology Stack

- **Backend**: NestJS (TypeScript) with Express
- **Frontend**: Next.js 14+ (App Router) with React
- **Database**: PostgreSQL (primary) + Redis (caching/sessions)
- **AI Agent**: Ollama with Llama 3 or similar local model
- **MCP**: Custom MCP protocol implementation
- **Infrastructure**: Docker containers, microservices architecture

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL 14+ (or Docker)
- Redis 7+ (or Docker)
- Docker & Docker Compose (for databases)
- Ollama (for local LLM)

### Quick Start

1. **Install Ollama and download model**:
   ```bash
   chmod +x setup-ollama.sh
   ./setup-ollama.sh
   ```
   Or see [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for detailed instructions.

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start databases**:
   ```bash
   docker-compose up -d
   ```

4. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Start services** (in separate terminals):
   ```bash
   # Terminal 1: API
   pnpm --filter api dev
   
   # Terminal 2: MCP Servers (one per terminal)
   pnpm --filter mcp-designer dev
   pnpm --filter mcp-techspec dev
   pnpm --filter mcp-patternmaster dev
   pnpm --filter mcp-sourcing dev
   
   # Terminal 3: Agent
   pnpm --filter agent dev
   
   # Terminal 4: Frontend
   pnpm --filter web dev
   ```

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md).

### Package Structure

- `packages/api` - NestJS backend API
- `packages/web` - Next.js frontend
- `packages/agent` - Seedling IP Co-Pilot agent
- `packages/mcp-core` - Base MCP server framework
- `packages/mcp-designer` - Designer MCP server
- `packages/mcp-techspec` - Tech Spec MCP server
- `packages/mcp-patternmaster` - Pattern Master MCP server
- `packages/mcp-sourcing` - Sourcing MCP server
- `packages/shared` - Shared TypeScript types and utilities

## Development

See individual package READMEs for package-specific instructions.

## License

Private - VIRGIO

