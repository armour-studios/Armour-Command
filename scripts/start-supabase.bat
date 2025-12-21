@echo off
REM Start Supabase local development environment

echo 🚀 Starting Supabase local development...

REM Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop.
    exit /b 1
)

REM Start Supabase
call supabase start

echo.
echo ✅ Supabase started!
echo.
echo 📝 API URL: http://localhost:54321
echo 🔑 ANON KEY: Check supabase/config.toml
echo 🔐 SERVICE ROLE KEY: Check supabase/config.toml
echo.
echo Next: Copy .env.local.example to .env.local with these values
