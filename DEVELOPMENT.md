# Quick Start Guide for Armour Nexus Development

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payment testing)
- OpenAI API key

## 1. Initial Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your keys
# See SUPABASE_SETUP.md for detailed Supabase configuration
```

## 2. Configure Environment Variables

Edit `.env.local`:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Stripe (optional for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ARMOURED=price_...
STRIPE_PRICE_ELITE=price_...

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# Google Drive (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Initialize Supabase

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):

1. Create Supabase project
2. Run `supabase/schema.sql` in SQL editor
3. Run `supabase/rls_policies.sql` in SQL editor
4. Get API keys and add to `.env.local`

## 4. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000`

## 5. Test Auth Flow

1. Click "Sign Up"
2. Enter email and password
3. You should be logged in and see dashboard
4. Check Supabase → Auth → Users to see your account

## Development Workflow

### Creating a Feature

1. **Design the database changes** (if needed)
   - Add to `supabase/schema.sql`
   - Run migration in Supabase dashboard
   - Update RLS policies in `supabase/rls_policies.sql`

2. **Create server action** (if mutation)
   - File: `app/actions/feature.ts`
   - Use Zod for input validation
   - Check authorization
   - Return `{ success, error }`

3. **Create UI component**
   - File: `components/dashboard/feature.tsx`
   - Use ShadCN components
   - Call server action from form

4. **Test locally**
   - Sign in as different roles
   - Test access control
   - Check data appears correctly

### Testing Different Roles

Create multiple test accounts:

1. Sign up as: owner@test.com (owner role)
2. Sign up as: manager@test.com
3. Invite manager@test.com to org as manager role
4. Test features with each account

### Common Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production build
npm start

# View Next.js build analysis
npm run analyze
```

## Debugging Tips

### RLS Issues

If getting "row-level security policy" errors:

1. Check user exists in `auth.users`
2. Check membership record exists and is `status='active'`
3. Verify visibility settings (org/team/private)
4. Check RLS policy logic in `supabase/rls_policies.sql`

### Supabase Connection

Verify connection in Supabase dashboard:
- Settings → API
- Check URL and keys match `.env.local`
- Test with simple query in SQL Editor

### TypeScript Errors

```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

## Next.js App Router Concepts

Key files/folders:
- `app/layout.tsx` - Root layout
- `app/auth/` - Auth pages
- `app/dashboard/` - Protected pages
- `app/actions/` - Server actions
- `app/api/` - API routes
- `middleware.ts` - Auth middleware

## Adding a New Page

1. Create folder: `app/dashboard/new-feature/`
2. Create file: `app/dashboard/new-feature/page.tsx`
3. Add route to sidebar in `components/dashboard/sidebar.tsx`
4. Create component in `components/dashboard/new-feature.tsx`

Example:
```typescript
// app/dashboard/teams/page.tsx
import { TeamsView } from '@/components/dashboard/teams-view'

export default function TeamsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Teams</h1>
      <TeamsView />
    </div>
  )
}
```

## Database Queries

Always use:
- Supabase client: `const supabase = createClient()`
- Type safety: `from('table').select('*')`
- Proper filtering: `.eq()`, `.in()`, `.contains()`
- Pagination: `.limit().offset()`

Example:
```typescript
const { data, error } = await supabase
  .from('teams')
  .select('*')
  .eq('organization_id', orgId)
  .eq('deleted_at', null)
  .order('name')
```

## Styling

- Tailwind CSS for utilities
- ShadCN components for complex UI
- Dark theme default
- Mobile-first responsive design

## File Structure Best Practices

```
app/actions/          # All server actions here
  ├── organizations.ts
  ├── subscriptions.ts
  ├── ai.ts
  └── ...

components/
  ├── auth/           # Auth-related components
  ├── dashboard/      # Dashboard modules
  ├── ui/             # Reusable UI (ShadCN)
  └── providers/      # Context providers

lib/
  ├── supabase/       # Supabase clients
  ├── types/          # TypeScript types
  ├── constants.ts    # Constants
  └── helpers.ts      # Utilities
```

## Performance Tips

1. Use Server Components by default (faster)
2. Mark interactive components with `'use client'`
3. Use `Next.js Image` for images
4. Lazy load heavy components with `dynamic()`
5. Memoize expensive computations

## Testing

Recommended: Playwright + React Testing Library

```bash
npm install -D @testing-library/react playwright
```

Create tests in `__tests__/` or `.test.tsx` files

## Deployment (Vercel)

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Set environment variables
4. Deploy: auto-deploys on push to main

See [Vercel Deployment](https://vercel.com/docs) for details

## Common Issues

### "Cannot find module"
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

### Supabase Auth not working
- Check keys in `.env.local`
- Verify email provider is enabled in Supabase
- Check CORS in Supabase dashboard

### RLS blocking queries
- See "RLS Issues" section above
- Verify user has correct membership + role

## Getting Help

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [ShadCN/UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Next Steps

1. ✅ Set up Supabase
2. ✅ Run dev server
3. ✅ Create test account
4. ⏭️ Build dashboard pages (teams, events, roster)
5. ⏭️ Implement Stripe checkout
6. ⏭️ Set up AI assistant
7. ⏭️ Deploy to Vercel
