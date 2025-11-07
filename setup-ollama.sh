#!/bin/bash

# VIRGIO PLM - Ollama Setup Script
# This script installs Ollama and downloads the recommended model

set -e

echo "🚀 VIRGIO PLM - Ollama Setup"
echo "=============================="
echo ""

# Check if Ollama is already installed
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is already installed"
    ollama --version
else
    echo "📥 Installing Ollama..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "Detected macOS"
        curl -fsSL https://ollama.com/install.sh | sh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "Detected Linux"
        curl -fsSL https://ollama.com/install.sh | sh
    else
        echo "❌ Unsupported OS. Please install Ollama manually from https://ollama.com"
        exit 1
    fi
fi

echo ""
echo "⏳ Waiting for Ollama service to start..."
sleep 3

# Check if Ollama is running
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama service is running"
else
    echo "⚠️  Ollama service not responding. Starting it..."
    ollama serve &
    sleep 5
fi

echo ""
echo "📦 Downloading Llama 3 model (this may take a few minutes)..."
echo "   Model size: ~4.7GB"
echo "   Note: You can cancel and use a smaller model later if needed"
echo ""

# Pull the model
ollama pull llama3

echo ""
echo "🧪 Testing the model..."
echo ""

# Test the model
TEST_RESPONSE=$(ollama run llama3 "Say hello in one sentence" 2>&1)

if [[ $TEST_RESPONSE == *"error"* ]] || [[ $TEST_RESPONSE == *"Error"* ]]; then
    echo "⚠️  Model test had issues, but installation completed"
else
    echo "✅ Model is working correctly!"
fi

echo ""
echo "=============================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with:"
echo "   OLLAMA_URL=http://localhost:11434"
echo "   OLLAMA_MODEL=llama3"
echo ""
echo "2. Start the agent:"
echo "   pnpm --filter agent dev"
echo ""
echo "3. Verify Ollama is running:"
echo "   curl http://localhost:11434/api/tags"
echo ""
echo "Available models:"
ollama list

