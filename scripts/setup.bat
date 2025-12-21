@echo off
REM Quick setup script for Armour Nexus development

setlocal enabledelayedexpansion

echo 🚀 Armour Nexus Quick Setup
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION%

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo 📝 Creating .env.local from .env.local.example...
    copy .env.local.example .env.local
    echo ⚠️  Please edit .env.local with your Supabase and Stripe keys
) else (
    echo ✅ .env.local already exists
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your configuration
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo For Supabase setup, see: SUPABASE_SETUP.md
echo For development guide, see: DEVELOPMENT.md
