#!/bin/bash

# Fluentify Development Script

echo "🚀 Fluentify Development Environment"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the project root directory"
    exit 1
fi

# Function to start backend
start_backend() {
    echo "📦 Starting Backend (NestJS)..."
    cd backend && npm run start:dev &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend (Next.js)..."
    cd frontend && npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Function to stop all services
stop_all() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap stop_all INT

# Menu
echo "Select an option:"
echo "1) Start Backend only"
echo "2) Start Frontend only"
echo "3) Start Both (Full Stack)"
echo "4) Build Backend"
echo "5) Build Frontend"
echo "6) Exit"
echo ""
read -p "Choose [1-6]: " choice

case $choice in
    1)
        start_backend
        wait $BACKEND_PID
        ;;
    2)
        start_frontend
        wait $FRONTEND_PID
        ;;
    3)
        start_backend
        sleep 2
        start_frontend
        echo ""
        echo "✅ Services started!"
        echo "   Backend:  http://localhost:3001"
        echo "   Frontend: http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop all services"
        wait
        ;;
    4)
        echo "🔨 Building Backend..."
        cd backend && npm run build
        ;;
    5)
        echo "🔨 Building Frontend..."
        cd frontend && npm run build
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac
