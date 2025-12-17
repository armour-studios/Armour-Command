# Armour Nexus Architecture

## System Overview

Armour Nexus is a production-ready SaaS platform built with:
- **Frontend**: Next.js 14 App Router with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Security**: Row-Level Security (RLS) at database layer
- **Payments**: Stripe integration
- **AI**: OpenAI API integration
- **Storage**: Supabase Storage + Google Drive
- **Deployment**: Vercel

## Authentication & Authorization

### Authentication Flow
1. User visits `/auth`
2. Signs up/in via email/password or magic link
3. Supabase Auth returns session token
4. Middleware validates token and redirects to `/dashboard`

### Authorization (RBAC)
```
Organization Hierarchy:
├─ Owner (full access)
├─ Admin (manage members, settings)
├─ Manager (manage teams, rosters, events)
├─ Coach (view/edit team data)
└─ Player (view assigned team data)
```

**Enforcement Layers**:
1. **Database Layer** (RLS Policies) - Most strict, enforced always
2. **Server Action Layer** - Validates user permissions before mutations
3. **Frontend Layer** - UI gating for better UX (NOT trusted)

## Database Architecture

### Core Tables
- **organizations** - Top-level workspace
- **memberships** - Users → Organizations (with roles)
- **teams** - Groups within organizations
- **team_members** - Players/staff on teams
- **events** - Matches, scrims, practices, meetings
- **files** - Metadata for stored files
- **ai_usage** - Track AI message and token usage
- **subscriptions** - Stripe billing info

### Key Constraints
- Soft deletes via `deleted_at` timestamp
- UUIDs for all primary keys
- Proper indexing on foreign keys and filters
- Cascading deletes where appropriate

## Server Actions

Located in `app/actions/`:
- **organizations.ts** - Create org, invite users, manage teams
- **subscriptions.ts** - Stripe checkout, webhook handling
- **ai.ts** - AI chat with context building
- **image-generation.ts** - Generate and store images
- **google-drive.ts** - Drive OAuth and sync

All server actions:
- Validate input with Zod
- Check user authorization
- Log operations
- Return `{ success, error }` format

## API Routes

Located in `app/api/`:
- **webhooks/stripe** - Handle Stripe subscription events
- Can add more for Google Drive OAuth callbacks, etc.

## Component Structure

```
components/
├── auth/
│   └── auth-form.tsx          # Sign up/in UI
├── dashboard/
│   ├── sidebar.tsx            # Navigation (role-aware)
│   ├── organization-selector.tsx
│   ├── calendar-view.tsx       # Events display
│   ├── roster-view.tsx         # Team members
│   ├── ai-assistant.tsx        # Chat interface
│   └── (other modules)
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   └── (shadcn components)
└── providers/
    └── theme-provider.tsx
```

## Data Flow Examples

### User Sign-Up → Creates Organization
```
1. User fills auth form
2. Supabase Auth creates user
3. Server Action: createOrganization()
   - Insert into organizations table
   - Create owner membership
   - Create free subscription
4. Redirect to /dashboard
```

### Create Event (Manager+)
```
1. Manager submits event form
2. Server Action: createEvent()
   - Check user is manager+ in org
   - Validate inputs with Zod
   - Insert into events table
   - RLS automatically filters based on visibility
3. Sidebar/Calendar updates show event
```

### AI Assistant Chat
```
1. User types message
2. Server Action: sendAIMessage()
   - Check subscription plan/limits
   - Build context (org data, team, events, files)
   - Call OpenAI API
   - Log usage
3. Return response with usage stats
```

## Security Model

### RLS Policies
Each table has policies for SELECT/INSERT/UPDATE/DELETE:
- **owner**: All access
- **admin**: Most access (can't delete org)
- **manager**: Team/event management
- **coach**: Read team data, some updates
- **player**: Read-only access to assigned data

Policies use:
- `auth.uid()` - Current user ID
- `user_is_org_member()` - Helper function
- `deleted_at IS NULL` - Soft delete check

### Service Role Key
- ONLY used in server actions
- NEVER exposed to client
- Used for:
  - Accepting invites (upsert without user_id)
  - Admin operations
  - Webhook handlers

## Scalability Considerations

### Database
- ✅ Proper indexing on foreign keys
- ✅ Soft deletes for audit trails
- ✅ Partition strategies for large tables (events, ai_usage)
- ✅ RLS policies are optimized queries

### Backend
- ✅ Server Actions are stateless
- ✅ Serverless execution (Vercel)
- ✅ Rate limiting (Stripe webhook protection)

### Frontend
- ✅ Server-side rendering (SSR)
- ✅ Incremental Static Regeneration (ISR) where applicable
- ✅ Lazy loading of components

### Infrastructure
- Vercel (auto-scaling, CDN)
- Supabase (managed PostgreSQL, auto-backups)
- Stripe (PCI compliance)

## Performance Optimizations

1. **Caching**
   - Use SWR or React Query for client-side caching
   - Supabase realtime for live updates

2. **Queries**
   - Only select needed columns
   - Use indexes on frequent filters
   - Limit result sets with pagination

3. **Images**
   - Store on Supabase Storage (CDN)
   - Use Next.js Image component for optimization

4. **Middleware**
   - Runs on every request
   - Validates auth before rendering protected routes
   - Early redirect for performance

## Deployment Checklist

- ✅ Environment variables configured
- ✅ Supabase schema and RLS deployed
- ✅ Stripe webhook URL configured
- ✅ Google Drive OAuth credentials set up
- ✅ OpenAI API key configured
- ✅ CORS policies configured
- ✅ Storage bucket permissions set
- ✅ Email service configured
- ✅ Database backups enabled
- ✅ Monitoring/logging configured

## Monitoring & Observability

Recommended integrations:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Vercel Analytics** - Performance metrics
- **Supabase Dashboard** - Database metrics
- **Stripe Dashboard** - Subscription metrics

## Future Enhancements

1. **Real-time Collaboration**
   - Supabase realtime for live roster updates
   - Collaborative editing for event descriptions

2. **Advanced Analytics**
   - Player performance tracking
   - Team statistics dashboard
   - Revenue/usage analytics

3. **Integrations**
   - Twitch/YouTube API for streaming
   - Discord webhooks for notifications
   - Slack bot for team updates

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline support

## References

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Stripe API](https://stripe.com/docs/api)
- [OpenAI API](https://platform.openai.com/docs)
