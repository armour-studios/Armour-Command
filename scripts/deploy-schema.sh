#!/bin/bash
# Deploy schema and RLS policies to Supabase

echo "📦 Deploying schema to Supabase..."

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN not set. Run: supabase projects list"
    exit 1
fi

# Get project ID from environment
PROJECT_ID=${SUPABASE_PROJECT_ID:-""}

if [ -z "$PROJECT_ID" ]; then
    echo "❌ SUPABASE_PROJECT_ID not set"
    exit 1
fi

echo "📝 Running migrations..."
supabase migration list --project-id "$PROJECT_ID"

echo "✅ Deploying schema from supabase/schema.sql..."
# This would require setting up migrations, for now, use dashboard

echo ""
echo "To deploy manually:"
echo "1. Go to Supabase Dashboard → SQL Editor"
echo "2. Copy supabase/schema.sql content"
echo "3. Execute the query"
echo "4. Copy supabase/rls_policies.sql content"
echo "5. Execute the query"
echo ""
echo "Or set up migrations using supabase migration commands"
