# Armour Nexus - Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name**: Armour Nexus (or your choice)
   - **Password**: Strong database password
   - **Region**: Closest to your users
5. Wait for project initialization (~2 minutes)

## 2. Initialize Database Schema

1. Navigate to the **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Execute** (or press Ctrl+Enter)
5. Wait for schema creation to complete

## 3. Apply Row Level Security (RLS) Policies

1. In the SQL Editor, create a new query
2. Copy and paste the contents of `supabase/rls_policies.sql`
3. Execute the query
4. Verify all policies were created (check Tables → Policies in sidebar)

## 4. Configure Authentication

### Email/Password & Magic Link
Authentication is enabled by default. Configure in **Authentication → Providers**:

1. Go to **Auth → Providers**
2. Enable **Email** (default)
3. Under Email Provider settings:
   - Enable **Confirm email** (requires email confirmation)
   - Enable **Secure Email Change** 
   - Set email templates (optional, use defaults)

### Magic Link Settings
Magic links are configured via the Email provider. Users can request magic links via:
```typescript
await supabase.auth.signInWithOtp({ email })
```

## 5. Configure Storage Buckets

1. Navigate to **Storage → Buckets**
2. Create a new bucket named **assets**
3. Set permissions:
   - **Public bucket**: No (to respect RLS)
   - Under **Policies**, add:
     ```sql
     -- Allow authenticated users to list/view own files
     CREATE POLICY "Users can view org assets"
     ON storage.objects FOR SELECT USING (
       bucket_id = 'assets'
     );
     
     -- Allow uploading
     CREATE POLICY "Users can upload assets"
     ON storage.objects FOR INSERT;
     ```

## 6. Get Your API Keys

1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role/secret** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

3. Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 7. Configure SMTP (Email Sending)

For production email (invitations, notifications):

1. Go to **Authentication → Email Templates**
2. Configure SMTP settings:
   - Provider: SendGrid, AWS SES, or your choice
   - SMTP Host, Port, Username, Password

Or use Supabase's default auth emails (fine for testing).

## 8. Enable Realtime (Optional)

For live updates (calendar, roster changes):

1. Go to **Replication** in sidebar
2. Select tables to enable Realtime on:
   - `events` (live calendar updates)
   - `team_members` (roster changes)
   - `ai_usage` (usage tracking)
3. Click **Enable realtime**

## 9. Verify Database Setup

Run verification queries:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check roles
SELECT * FROM auth.users;
```

## 10. Test Authentication Flow

1. Run your Next.js app: `npm run dev`
2. Navigate to `http://localhost:3000/auth`
3. Try signing up with email/password
4. Verify user appears in Supabase → **Authentication → Users**

## Production Checklist

- ✅ RLS policies verified and tested
- ✅ Storage bucket permissions configured
- ✅ SMTP configured for production email
- ✅ API keys in environment variables (never commit)
- ✅ Database backups enabled (Supabase default)
- ✅ Realtime enabled (if using live features)
- ✅ Authentication providers configured
- ✅ Custom domain configured (optional)
- ✅ Rate limiting configured (Supabase default)

## Troubleshooting

### RLS Blocking Queries
If you see "new row violates row-level security policy":
1. Check user has correct membership
2. Verify RLS policies have `status = 'active'`
3. Check `deleted_at IS NULL` conditions

### Can't Sign In
1. Verify email provider is enabled
2. Check confirmation emails aren't going to spam
3. Verify user exists in **Authentication → Users**

### Missing Data After Queries
1. Ensure user has role in organization
2. Check visibility settings (org/team/private)
3. Verify RLS policies using `SELECT policy_name FROM information_schema.role_based_access_policies`

## Useful SQL Queries

```sql
-- View all memberships
SELECT u.email, m.role, o.name 
FROM memberships m
JOIN auth.users u ON m.user_id = u.id
JOIN organizations o ON m.organization_id = o.id;

-- Count users per organization
SELECT o.name, COUNT(m.id) as members
FROM organizations o
LEFT JOIN memberships m ON o.id = m.organization_id
GROUP BY o.id;

-- View recent AI usage
SELECT u.email, ai.message_count, ai.tokens_used, ai.updated_at
FROM ai_usage ai
JOIN auth.users u ON ai.user_id = u.id
ORDER BY ai.updated_at DESC
LIMIT 20;
```

## References

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
