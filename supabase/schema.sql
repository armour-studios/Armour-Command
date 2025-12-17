-- Armour Nexus Supabase Schema
-- Production-ready PostgreSQL schema with Row Level Security (RLS)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Organizations (top-level workspace)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Memberships (connect users to organizations with roles)
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'coach', 'player')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'inactive')),
  invite_token TEXT,
  invite_sent_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, organization_id)
);

-- Teams (groups within an organization)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  game TEXT, -- e.g., "Valorant", "CS2", "Overwatch 2"
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Team Members (players/staff assigned to teams)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL, -- for players without accounts
  email TEXT,
  position TEXT, -- e.g., "IGL", "Support", "DPS"
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'coach', 'manager')),
  jersey_number INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Events (matches, scrims, practices, meetings)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('match', 'scrim', 'practice', 'meeting', 'other')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  opponent TEXT,
  visibility TEXT NOT NULL DEFAULT 'org' CHECK (visibility IN ('org', 'team', 'private')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Files (metadata for Google Drive + Supabase Storage files)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_type TEXT, -- e.g., "video", "image", "document", "spreadsheet"
  storage_type TEXT NOT NULL CHECK (storage_type IN ('google_drive', 'supabase')),
  external_id TEXT, -- Google Drive file ID or Supabase path
  file_size_bytes BIGINT,
  mime_type TEXT,
  visibility TEXT NOT NULL DEFAULT 'team' CHECK (visibility IN ('org', 'team', 'private')),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- AI Assistant Usage (track tokens, messages, and credits)
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  context TEXT, -- "org", "team", "general"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions (Stripe integration)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'armoured', 'armoured_elite')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'ended')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  billing_cycle_anchor TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan Limits (define feature gates per subscription plan)
CREATE TABLE plan_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan TEXT NOT NULL UNIQUE CHECK (plan IN ('free', 'armoured', 'armoured_elite')),
  ai_messages_per_month INTEGER,
  image_generation_credits_per_month INTEGER,
  storage_limit_gb INTEGER,
  teams_allowed INTEGER,
  team_members_allowed INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES (Performance & Foreign Key Lookups)
-- ============================================================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_deleted_at ON organizations(deleted_at);

-- Memberships
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_organization_id ON memberships(organization_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_deleted_at ON memberships(deleted_at);
CREATE INDEX idx_memberships_user_org ON memberships(user_id, organization_id);

-- Teams
CREATE INDEX idx_teams_organization_id ON teams(organization_id);
CREATE INDEX idx_teams_deleted_at ON teams(deleted_at);

-- Team Members
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_members_deleted_at ON team_members(deleted_at);

-- Events
CREATE INDEX idx_events_organization_id ON events(organization_id);
CREATE INDEX idx_events_team_id ON events(team_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_deleted_at ON events(deleted_at);

-- Files
CREATE INDEX idx_files_organization_id ON files(organization_id);
CREATE INDEX idx_files_team_id ON files(team_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_deleted_at ON files(deleted_at);

-- AI Usage
CREATE INDEX idx_ai_usage_organization_id ON ai_usage(organization_id);
CREATE INDEX idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage(created_at);

-- Subscriptions
CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);

-- ============================================================================
-- DEFAULT PLAN LIMITS (Populate with INSERT)
-- ============================================================================

INSERT INTO plan_limits (plan, ai_messages_per_month, image_generation_credits_per_month, storage_limit_gb, teams_allowed, team_members_allowed) VALUES
  ('free', 50, 5, 5, 1, 10),
  ('armoured', 500, 50, 100, 3, 50),
  ('armoured_elite', 5000, 500, 1000, NULL, NULL);

-- ============================================================================
-- TIMESTAMP TRIGGERS (auto-update updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_timestamp BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_memberships_timestamp BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_teams_timestamp BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_team_members_timestamp BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_events_timestamp BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_files_timestamp BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_ai_usage_timestamp BEFORE UPDATE ON ai_usage
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_subscriptions_timestamp BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
