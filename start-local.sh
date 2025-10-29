#!/bin/bash

echo "Starting AgroConnect Local Development Environment"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not available"
    exit 1
fi

echo "npm found: $(npm --version)"

echo ""
echo "================================================"
echo "Starting Frontend Development Server"
echo "================================================"

cd frontend

echo "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "Starting Vite development server..."
echo ""
echo "The application will open at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================================"

npm run dev