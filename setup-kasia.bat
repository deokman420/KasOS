@echo off
REM Kasia Setup Script for KasOS (Windows)
REM This script helps set up Kasia for the first time

echo 🚀 Kasia Setup for KasOS
echo ========================

REM Check if we're in the right directory
if not exist "applications\Kasia-master" (
    echo ❌ Error: applications\Kasia-master directory not found
    echo Please run this script from the webos_2 root directory
    pause
    exit /b 1
)

cd applications\Kasia-master
echo 📁 Changed to Kasia directory

REM Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js v16 or higher
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Check for Rust
rustc --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Rust not found. Please install Rust
    echo Install from: https://rustup.rs/
    pause
    exit /b 1
)

echo ✅ Rust found
rustc --version

REM Check for wasm-pack
wasm-pack --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  wasm-pack not found. Installing...
    cargo install wasm-pack
    if errorlevel 1 (
        echo ❌ Failed to install wasm-pack
        pause
        exit /b 1
    )
)

echo ✅ wasm-pack found
wasm-pack --version

REM Install npm dependencies
echo 📦 Installing npm dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install npm dependencies
    pause
    exit /b 1
)

echo ✅ npm dependencies installed

REM Build cipher WASM
echo 🔧 Building cipher WASM components...
cd cipher
wasm-pack build --target web --release -d ../cipher-wasm
if errorlevel 1 (
    echo ❌ Failed to build WASM components
    pause
    exit /b 1
)

cd ..
echo ✅ WASM components built successfully

REM Check for Kaspa WASM files
if not exist "wasm" (
    echo ⚠️  Kaspa WASM files not found in wasm\ directory
    echo Please download kaspa-wasm32-sdk and extract to wasm\ directory
    echo Download from: https://github.com/kaspanet/rusty-kaspa/releases
)

echo.
echo 🎉 Kasia setup complete!
echo.
echo To start Kasia:
echo   npm run dev
echo.
echo Then open the Kasia app in KasOS or visit http://localhost:3000
echo.
echo 📝 Note: You'll need a Kaspa wallet with at least 10 KAS to use Kasia
echo.
pause
