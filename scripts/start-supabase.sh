#!/bin/bash
# Start Supabase local development environment

echo "🚀 Starting Supabase local development..."

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    exit 1
fi

# Start Supabase
supabase start

echo "✅ Supabase started!"
echo ""
echo "📝 API URL: http://localhost:54321"
echo "🔑 ANON KEY: Check supabase/config.toml"
echo "🔐 SERVICE ROLE KEY: Check supabase/config.toml"
echo ""
echo "Next: Copy .env.local.example to .env.local with these values"
