# 🚀 Armour Nexus - Vercel & Supabase Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Git account and repository
- Vercel account ([vercel.com](https://vercel.com))
- Supabase account ([supabase.com](https://supabase.com))
- Stripe account ([stripe.com](https://stripe.com))
- OpenAI account (optional)

---

## Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: Armour Nexus (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Wait for initialization (~2 minutes)

### Step 2: Initialize Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy entire contents of `supabase/schema.sql`
4. Paste and click **Execute**
5. Wait for completion

### Step 3: Apply RLS Policies

1. In **SQL Editor**, click **"New Query"**
2. Copy entire contents of `supabase/rls_policies.sql`
3. Paste and click **Execute**
4. Verify all policies were created (check **Tables → Policies**)

### Step 4: Get API Keys

1. Go to **Settings → API**
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role/secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 5: Create Storage Bucket

1. Go to **Storage**
2. Click **"New Bucket"**
3. Name it: `assets`
4. Set **Public** to OFF
5. Max file size: 52MB (default)

### Step 6: Configure Authentication

1. Go to **Authentication → Providers**
2. Email provider is enabled by default
3. Enable **Confirm Email** (recommended)
4. (Optional) Configure SMTP for production emails
5. (Optional) Add Google OAuth provider

---

## Part 2: Stripe Setup

### Step 1: Create Stripe Products

1. Go to [stripe.com/products](https://dashboard.stripe.com/products)
2. Create product **"Armoured"**:
   - Price: $49.99/month
   - Billing period: Monthly
   - Copy Price ID → `STRIPE_PRICE_ARMOURED`

3. Create product **"Armoured Elite"**:
   - Price: $99.99/month
   - Billing period: Monthly
   - Copy Price ID → `STRIPE_PRICE_ELITE`

### Step 2: Get Stripe Keys

1. Go to **Developers → API Keys**
2. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### Step 3: Configure Webhook

1. Go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Click webhook → copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## Part 3: OpenAI Setup (Optional)

1. Go to [platform.openai.com/api/keys](https://platform.openai.com/api/keys)
2. Create new secret key
3. Copy → `OPENAI_API_KEY`

---

## Part 4: Google Drive Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable **Google Drive API**
4. Create **OAuth 2.0 ID** (type: Web application)
5. Set authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (dev)
   - `https://your-domain.vercel.app/auth/google/callback` (prod)
6. Copy:
   - **Client ID** → `GOOGLE_CLIENT_ID`
   - **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

## Part 5: Vercel Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial Armour Nexus setup"

# Create GitHub repository
# Then push
git remote add origin https://github.com/YOUR_USERNAME/armour-nexus.git
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select **Next.js** framework (should auto-detect)
4. Click **Deploy** (build will start)

### Step 3: Add Environment Variables

After deployment starts:

1. Go to **Settings → Environment Variables**
2. Add all variables from `.env.example`:

**Required (Production)**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (SECRET)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_... (SECRET)
STRIPE_WEBHOOK_SECRET=whsec_... (SECRET)
STRIPE_PRICE_ARMOURED=price_...
STRIPE_PRICE_ELITE=price_...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Optional**:
```
OPENAI_API_KEY=sk-... (SECRET)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=... (SECRET)
GOOGLE_DRIVE_REDIRECT_URI=https://your-domain.vercel.app/auth/google/callback
```

### Step 4: Redeploy

1. In **Deployments** tab, click the current deployment
2. Click **"Redeploy"** button
3. Wait for build to complete

### Step 5: Configure Domain

1. Go to **Settings → Domains**
2. Add your domain:
   - `armour-nexus.com` or subdomain
   - Follow DNS setup instructions
3. SSL certificate auto-provisioned

---

## Part 6: Update Stripe Webhook URL

Once you have your Vercel domain:

1. Go to Stripe **Developers → Webhooks**
2. Edit the webhook endpoint
3. Update URL to: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Save

---

## Part 7: Test the Deployment

1. Open your Vercel domain
2. Click **"Sign Up"**
3. Create account with email
4. Check that you can:
   - ✅ Sign in/out
   - ✅ See organization created
   - ✅ View dashboard
   - ✅ Create teams (if manager)

---

## Part 8: Configure Email (Production)

For production, set up SMTP:

1. Use SendGrid, AWS SES, or Mailgun
2. In Supabase **Auth → Providers → Email**:
   - Configure SMTP settings
   - Test with confirmation email
3. Update email templates (optional)

---

## Monitoring & Debugging

### Vercel Logs

```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

### Supabase Logs

1. Go to **Database → Logs**
2. View query performance
3. Check for RLS errors

### Stripe Logs

1. Go to **Developers → Event Log**
2. Check webhook deliveries
3. Verify signature verification passed

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `npm ERR! notarget`
- **Solution**: Fix package.json versions (use pinned versions, not ranges)

**Error**: `Module not found`
- **Solution**: Ensure all imports use correct paths with `@/` alias
- Run `npm run type-check` locally first

### Database Connection Error

**Error**: `Connection refused`
- **Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check RLS policies aren't blocking access
- Verify user has membership in organization

### Stripe Webhook Not Firing

**Error**: Webhook not receiving events
- **Solution**: Verify webhook URL is correct and publicly accessible
- Check signing secret is correct in environment variables
- Test webhook from Stripe dashboard

### Auth Not Working

**Error**: "Invalid API key"
- **Solution**: Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check email provider is enabled in Supabase
- Clear browser cache and cookies

---

## Performance Optimization

### Image Optimization
- Configure Supabase CDN for stored images
- Use Next.js Image component
- Set cache headers in vercel.json

### Database Queries
- Verify indexes created (in schema.sql)
- Monitor slow queries in Supabase logs
- Use query optimization

### Edge Functions
- Stripe webhooks run on Vercel Functions
- AI calls optimized with caching
- Rate limiting configured

---

## Scaling Considerations

### For 1000+ Organizations

1. **Database**: Enable connection pooling in Supabase
2. **Caching**: Add Redis for frequently accessed data
3. **CDN**: Images served from global CDN
4. **Monitoring**: Set up alerts for slow queries

### For 100K+ Users

1. **Database partitioning**: Partition events and ai_usage tables
2. **Read replicas**: Add read-only replicas for analytics
3. **API rate limiting**: Configure in Vercel Functions
4. **Logging**: Centralize logs to external service

---

## Security Checklist

- ✅ Service role key in Vercel secrets only (not preview env)
- ✅ Stripe webhook secret verified
- ✅ RLS policies tested with multiple roles
- ✅ CORS configured correctly
- ✅ No hardcoded secrets in code
- ✅ SSL certificate active
- ✅ Database backups enabled
- ✅ Error logging configured (Sentry/similar)

---

## Post-Launch

### Day 1
- ✅ Monitor error logs
- ✅ Test all user flows
- ✅ Check payment processing
- ✅ Verify email sending

### Week 1
- Gather user feedback
- Monitor performance metrics
- Adjust scaling if needed
- Plan feature updates

### Month 1
- Analyze user behavior
- Optimize slow queries
- Scale infrastructure as needed
- Plan next feature release

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Deployment Checklist

- [ ] Supabase project created
- [ ] Schema deployed
- [ ] RLS policies applied
- [ ] API keys copied
- [ ] Storage bucket created
- [ ] Stripe products created
- [ ] Stripe webhook configured
- [ ] OpenAI API key (if using)
- [ ] Google Drive OAuth (if implementing)
- [ ] GitHub repository created
- [ ] Vercel project connected
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Email provider configured
- [ ] Monitoring configured
- [ ] Tested signup/signin/org creation
- [ ] Tested payment flow
- [ ] Monitoring alerts set

---

**Status**: ✅ Ready for production deployment

**Next Step**: Run `git push` and watch Vercel auto-deploy!
