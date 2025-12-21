#!/bin/bash
# Build and deploy to Vercel

set -e

echo "🚀 Building for Vercel deployment..."
echo ""

# Check environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_URL not set"
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "⚠️  STRIPE_SECRET_KEY not set"
fi

# Run type checking
echo "📋 TypeScript type checking..."
npm run type-check

# Build
echo "🔨 Building application..."
npm run build

# Check build output
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not created"
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "To deploy:"
echo "1. vercel deploy --prod"
echo "2. Or push to Git and Vercel will auto-deploy"
