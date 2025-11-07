# Quick Start Guide

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- PostgreSQL 14+ (or use Docker)
- Redis 7+ (or use Docker)

## Step 1: Install Ollama and Download Model

### Option A: Automated Setup (Recommended)

```bash
# Make script executable
chmod +x setup-ollama.sh

# Run setup script
./setup-ollama.sh
```

### Option B: Manual Setup

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download Llama 3 model (~4.7GB)
ollama pull llama3

# Verify installation
ollama list
```

For other models or sizes, see `OLLAMA_SETUP.md`

## Step 2: Install Dependencies

```bash
# Install all dependencies
pnpm install
```

## Step 3: Start Databases

```bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d

# Verify they're running
docker-compose ps
```

## Step 4: Configure Environment

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=virgio
DB_PASSWORD=virgio123
DB_NAME=virgio_plm

# Redis
REDIS_URL=redis://localhost:6379

# API
PORT=3001
FRONTEND_URL=http://localhost:3000

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# API Base URL (for MCP servers)
API_BASE_URL=http://localhost:3001

# Node Environment
NODE_ENV=development
```

## Step 5: Start Services

You'll need multiple terminal windows:

### Terminal 1: API Server
```bash
pnpm --filter api dev
```

### Terminal 2: MCP Servers (run each in separate terminals or use a process manager)

```bash
# Designer MCP Server (Port 4001)
pnpm --filter mcp-designer dev

# Tech Spec MCP Server (Port 4002)
pnpm --filter mcp-techspec dev

# Pattern Master MCP Server (Port 4003)
pnpm --filter mcp-patternmaster dev

# Sourcing MCP Server (Port 4004)
pnpm --filter mcp-sourcing dev
```

### Terminal 3: Agent
```bash
pnpm --filter agent dev
```

### Terminal 4: Frontend
```bash
pnpm --filter web dev
```

## Step 6: Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Agent WebSocket**: ws://localhost:5000
- **MCP Servers**: 
  - Designer: ws://localhost:4001
  - Tech Spec: ws://localhost:4002
  - Pattern Master: ws://localhost:4003
  - Sourcing: ws://localhost:4004

## Troubleshooting

### Ollama Issues

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve

# List downloaded models
ollama list

# Test a model
ollama run llama3 "Hello"
```

### Database Issues

```bash
# Check if databases are running
docker-compose ps

# View logs
docker-compose logs postgres
docker-compose logs redis

# Restart databases
docker-compose restart
```

### Port Conflicts

If ports are already in use, update:
- API: `PORT` in `.env` or `packages/api/src/main.ts`
- Frontend: Default Next.js port (3000) - change in `packages/web/package.json`
- MCP Servers: Update ports in each MCP server's `src/index.ts`
- Agent: Update port in `packages/agent/src/index.ts`

## Testing the System

1. **Test API**: 
   ```bash
   curl http://localhost:3001/api/universe/fabrics
   ```

2. **Test Ollama**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

3. **Test Frontend**: Open http://localhost:3000

4. **Test Agent**: Connect via WebSocket to ws://localhost:5000

## Next Steps

- See `OLLAMA_SETUP.md` for detailed Ollama configuration
- Check individual package READMEs for package-specific documentation
- Review the architecture diagram for system understanding

