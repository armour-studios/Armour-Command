# Armour Nexus Production-Ready SaaS Deployment

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Stripe account
- OpenAI API key
- Google Cloud credentials

## Setup Instructions

### 1. Clone & Install Dependencies

```bash
git clone <repo>
cd armour-nexus
npm install
```

### 2. Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the schema setup:
   ```bash
   # Via Supabase dashboard SQL editor, run:
   cat supabase/schema.sql
   cat supabase/rls_policies.sql
   ```
3. Copy your Supabase URL and anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
   SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
   ```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

### 4. Run Locally

```bash
npm run dev
```

Navigate to `http://localhost:3000`

## Project Structure

```
armour-nexus/
├── app/                          # Next.js App Router
│   ├── auth/                      # Authentication pages
│   ├── dashboard/                 # Protected dashboard
│   ├── actions/                   # Server Actions
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
├── components/
│   ├── auth/                      # Auth components
│   ├── ui/                        # ShadCN UI components
│   ├── dashboard/                 # Dashboard modules
│   └── providers/                 # Context providers
├── lib/
│   ├── supabase/                  # Supabase client/server
│   ├── types/                     # TypeScript types
│   └── utils.ts                   # Utility functions
├── supabase/
│   ├── schema.sql                 # Database schema
│   └── rls_policies.sql           # Row Level Security
└── public/                        # Static assets
```

## Key Features

### Authentication
- Email/password sign-up
- Magic link authentication
- Organization invites
- Role-based access (RBAC)

### Organizations
- Multi-team support
- Role-based permissions (Owner, Admin, Manager, Coach, Player)
- Team management
- Roster management

### Calendar & Scheduling
- Org and team-level events
- Match, scrim, practice, meeting types
- Timezone-aware
- Role-based visibility

### AI Assistant
- Context-aware chat (org, team, files)
- Token and message tracking
- Usage limits per plan
- Server-side integration with OpenAI

### Image Generation
- Generate match graphics, social posts, thumbnails
- Save to Supabase Storage
- Credit system per plan

### File Management
- Google Drive integration
- Supabase Storage support
- Role-based access
- File metadata tracking

### Billing
- Stripe subscription management
- Plans: Free, Armoured, Armoured Elite
- Feature gating
- Usage tracking

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy: `git push`

### Required Environment Variables in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Database Migrations

When making schema changes:

1. Update `supabase/schema.sql` or create new migration files
2. Apply via Supabase dashboard SQL editor
3. Ensure RLS policies are in place

## Security Best Practices

- ✅ Supabase RLS enforces permissions at database layer
- ✅ Server Actions handle sensitive operations
- ✅ Service Role key never exposed to client
- ✅ All mutations validated with Zod
- ✅ Stripe webhook signatures verified
- ✅ Google Drive OAuth with secure token handling

## Next Steps

1. **Implement AI Assistant**: Integrate OpenAI API with context builder
2. **Google Drive Sync**: Set up OAuth and folder structure mapping
3. **Stripe Webhooks**: Configure subscription lifecycle management
4. **Image Generation**: Integrate with DALL-E or similar
5. **Analytics**: Add usage tracking and reporting

## Support

For issues or questions, please refer to:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Docs](https://stripe.com/docs)
