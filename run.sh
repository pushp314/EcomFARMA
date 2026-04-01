#!/bin/bash

# FarmFresh Launcher
# Boots up the entire Farm-to-Table Ecosystem

echo "🌾 FarmFresh: Booting System Hub..."

# 1. Start Backend in Background
echo "📦 Initializing Core API (Port: 5001)..."
cd backend && npm run dev &
BACKEND_PID=$!

# 2. Wait 2 seconds for API Readiness
sleep 2

# 3. Start Frontend
echo "💻 Launching Marketplace UI (Port: 5173)..."
cd ../frontend && npm run dev

# Cleanup when script is killed
trap "kill $BACKEND_PID; exit" INT
