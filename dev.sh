#!/bin/bash

# MyndCouncil 3D Development Script
# Quick startup for local development

echo "🏛️ Starting MyndCouncil 3D Council Hall Development Server..."
echo "✨ Opening at http://localhost:3000"
echo "🔧 Press Ctrl+C to stop the server"
echo ""

# Start live server with auto-reload
npx live-server --port=3000 --open=/ --ignore=node_modules,package.json,.git

