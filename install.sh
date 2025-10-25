#!/bin/bash

echo "========================================"
echo "QIOS - Quality Integrated Omni System"
echo "========================================"
echo ""
echo "Installing dependencies..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

echo "Node.js version:"
node --version
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not available!"
    echo "Please reinstall Node.js"
    echo ""
    exit 1
fi

echo "npm version:"
npm --version
echo ""

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies!"
    echo "Please check your internet connection and try again."
    echo ""
    exit 1
fi

echo ""
echo "========================================"
echo "Installation completed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Copy env.example to .env.local"
echo "2. Edit .env.local with your configuration"
echo "3. Run: npm run dev"
echo ""
echo "The application will be available at:"
echo "http://localhost:3000"
echo ""
