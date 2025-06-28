#!/bin/bash
# Kasia Setup Script for KasOS
# This script helps set up Kasia for the first time

echo "🚀 Kasia Setup for KasOS"
echo "========================"

# Check if we're in the right directory
if [ ! -d "applications/Kasia-master" ]; then
    echo "❌ Error: applications/Kasia-master directory not found"
    echo "Please run this script from the webos_2 root directory"
    exit 1
fi

cd applications/Kasia-master

echo "📁 Changed to Kasia directory"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v16 or higher"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check for Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust not found. Please install Rust"
    echo "Install from: https://rustup.rs/"
    exit 1
fi

echo "✅ Rust found: $(rustc --version)"

# Check for wasm-pack
if ! command -v wasm-pack &> /dev/null; then
    echo "⚠️  wasm-pack not found. Installing..."
    cargo install wasm-pack
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install wasm-pack"
        exit 1
    fi
fi

echo "✅ wasm-pack found: $(wasm-pack --version)"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

echo "✅ npm dependencies installed"

# Build cipher WASM
echo "🔧 Building cipher WASM components..."
cd cipher
wasm-pack build --target web --release -d ../cipher-wasm
if [ $? -ne 0 ]; then
    echo "❌ Failed to build WASM components"
    exit 1
fi

cd ..
echo "✅ WASM components built successfully"

# Check for Kaspa WASM files
if [ ! -d "wasm" ]; then
    echo "⚠️  Kaspa WASM files not found in wasm/ directory"
    echo "Please download kaspa-wasm32-sdk and extract to wasm/ directory"
    echo "Download from: https://github.com/kaspanet/rusty-kaspa/releases"
fi

echo ""
echo "🎉 Kasia setup complete!"
echo ""
echo "To start Kasia:"
echo "  npm run dev"
echo ""
echo "Then open the Kasia app in KasOS or visit http://localhost:3000"
echo ""
echo "📝 Note: You'll need a Kaspa wallet with at least 10 KAS to use Kasia"
