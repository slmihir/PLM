# Ollama Setup Guide

This guide will help you install Ollama and download a local LLM model for the VIRGIO PLM system.

## Step 1: Install Ollama

### macOS
```bash
# Download and install Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

Or download directly from: https://ollama.com/download/mac

### Linux
```bash
# Download and install Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows
Download the installer from: https://ollama.com/download/windows

## Step 2: Verify Installation

After installation, verify Ollama is running:

```bash
ollama --version
```

You should see the version number. Ollama runs as a service automatically.

## Step 3: Download a Model

We recommend using **Llama 3** (8B parameter model) for good performance and reasonable resource usage:

```bash
# Download Llama 3 8B (recommended - ~4.7GB)
ollama pull llama3

# Alternative: Llama 3.1 8B (newer version)
ollama pull llama3.1

# For better quality but larger size: Llama 3 70B (~40GB)
ollama pull llama3:70b

# For smaller/faster models:
ollama pull llama3.2:1b  # Very small, fast
ollama pull llama3.2:3b  # Small, fast
```

### Recommended Models by Use Case:

- **Best Balance (Recommended)**: `llama3` or `llama3.1` (8B) - Good quality, reasonable speed
- **Fastest**: `llama3.2:1b` or `llama3.2:3b` - Faster but lower quality
- **Best Quality**: `llama3:70b` - Highest quality but requires more RAM

## Step 4: Test the Model

Test that the model works:

```bash
# Test the model
ollama run llama3 "Hello, can you help me?"

# You should get a response from the model
```

## Step 5: Configure the Agent

The agent is already configured to use Ollama. Check/update these settings:

### Environment Variables

Create or update `.env` file in the root directory:

```bash
# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3  # Change this to match the model you downloaded
```

### Update Agent Configuration

The agent uses these defaults (already set in code):
- **Ollama URL**: `http://localhost:11434` (default Ollama port)
- **Model**: `llama3` (can be changed)

To use a different model, update `packages/agent/src/llm/ollama-llm.ts`:

```typescript
constructor(baseUrl: string, model: string = 'llama3') {
  this.baseUrl = baseUrl;
  this.model = model; // Change default here or pass via env
}
```

Or set via environment variable and update the constructor call in `packages/agent/src/index.ts`:

```typescript
const orchestrator = new AgentOrchestrator(
  new OllamaLLM(
    process.env.OLLAMA_URL || 'http://localhost:11434',
    process.env.OLLAMA_MODEL || 'llama3'  // Add this
  ),
  new MCPClientManager(),
);
```

## Step 6: Start the System

1. **Start Ollama** (usually runs automatically as a service):
   ```bash
   # Check if running
   curl http://localhost:11434/api/tags
   
   # If not running, start it (usually auto-starts)
   ollama serve
   ```

2. **Start the Agent**:
   ```bash
   pnpm --filter agent dev
   ```

3. **Test the Agent**:
   - Connect to `ws://localhost:5000`
   - Send a test message

## Troubleshooting

### Ollama not responding
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama service
# macOS/Linux:
sudo systemctl restart ollama  # or
ollama serve

# Check logs
ollama logs
```

### Model not found
```bash
# List downloaded models
ollama list

# If model not listed, download it again
ollama pull llama3
```

### Out of Memory
- Use a smaller model: `llama3.2:1b` or `llama3.2:3b`
- Close other applications
- On macOS, ensure you have enough swap space

### Model Performance
- **8B models** require ~8-10GB RAM
- **70B models** require ~40GB+ RAM
- **1B-3B models** require ~2-4GB RAM

## Quick Start Script

Create a file `setup-ollama.sh`:

```bash
#!/bin/bash

echo "Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

echo "Downloading Llama 3 model..."
ollama pull llama3

echo "Testing model..."
ollama run llama3 "Hello, can you help me?"

echo "Setup complete! Model ready at http://localhost:11434"
```

Make it executable and run:
```bash
chmod +x setup-ollama.sh
./setup-ollama.sh
```

## API Endpoints

Ollama provides REST API at `http://localhost:11434`:

- **List models**: `GET /api/tags`
- **Generate**: `POST /api/generate`
- **Chat**: `POST /api/chat`
- **Pull model**: `POST /api/pull`

The agent uses these endpoints automatically.

