#!/bin/bash
# Quick setup script for Armour Nexus development

set -e

echo "🚀 Armour Nexus Quick Setup"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version)"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from .env.local.example..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local with your Supabase and Stripe keys"
fi

# Check Supabase CLI
echo ""
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not installed. Install with: npm install -g supabase"
else
    echo "✅ Supabase CLI installed"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your configuration"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "For Supabase setup, see: SUPABASE_SETUP.md"
echo "For development guide, see: DEVELOPMENT.md"
