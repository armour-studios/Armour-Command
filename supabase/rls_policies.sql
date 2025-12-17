-- Armour Nexus Row Level Security (RLS) Policies
-- Enforces role-based access control at the database layer

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if user is a member of organization with at least a certain role
CREATE OR REPLACE FUNCTION user_is_org_member(
  p_user_id UUID,
  p_organization_id UUID,
  p_min_role TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM memberships
  WHERE user_id = p_user_id
    AND organization_id = p_organization_id
    AND status = 'active'
    AND deleted_at IS NULL;

  IF v_role IS NULL THEN
    RETURN FALSE;
  END IF;

  IF p_min_role IS NOT NULL THEN
    -- Role hierarchy: owner > admin > manager > coach > player
    CASE
      WHEN v_role = 'owner' THEN RETURN TRUE;
      WHEN v_role = 'admin' AND p_min_role IN ('admin', 'manager', 'coach', 'player') THEN RETURN TRUE;
      WHEN v_role = 'manager' AND p_min_role IN ('manager', 'coach', 'player') THEN RETURN TRUE;
      WHEN v_role = 'coach' AND p_min_role IN ('coach', 'player') THEN RETURN TRUE;
      WHEN v_role = 'player' AND p_min_role = 'player' THEN RETURN TRUE;
      ELSE RETURN FALSE;
    END CASE;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get user's role in organization
CREATE OR REPLACE FUNCTION user_org_role(
  p_user_id UUID,
  p_organization_id UUID
)
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM memberships
  WHERE user_id = p_user_id
    AND organization_id = p_organization_id
    AND status = 'active'
    AND deleted_at IS NULL;
  
  RETURN COALESCE(v_role, 'none');
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- ORGANIZATIONS RLS POLICIES
-- ============================================================================

-- Public read: Orgs are readable (for invite/onboarding flows)
CREATE POLICY org_select_public ON organizations
  FOR SELECT USING (deleted_at IS NULL);

-- Only owners/admins can update organization
CREATE POLICY org_update_admin ON organizations
  FOR UPDATE USING (
    user_is_org_member(auth.uid(), id, 'admin')
  );

-- Only admins can delete (soft delete)
CREATE POLICY org_delete_admin ON organizations
  FOR DELETE USING (
    user_is_org_member(auth.uid(), id, 'admin')
  );

-- ============================================================================
-- MEMBERSHIPS RLS POLICIES
-- ============================================================================

-- Users can see memberships in orgs they belong to
CREATE POLICY membership_select_self_org ON memberships
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_is_org_member(auth.uid(), organization_id, 'manager')
  );

-- Owners/Admins can insert memberships (invite users)
CREATE POLICY membership_insert_admin ON memberships
  FOR INSERT WITH CHECK (
    user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- Only admins/managers can update memberships
CREATE POLICY membership_update_admin ON memberships
  FOR UPDATE USING (
    user_is_org_member(auth.uid(), organization_id, 'manager')
  );

-- Only admins can delete memberships
CREATE POLICY membership_delete_admin ON memberships
  FOR DELETE USING (
    user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- Users can accept their own invites
CREATE POLICY membership_accept_own_invite ON memberships
  FOR UPDATE USING (
    user_id = auth.uid() AND status = 'invited'
  );

-- ============================================================================
-- TEAMS RLS POLICIES
-- ============================================================================

-- Users in org can read teams
CREATE POLICY team_select_org ON teams
  FOR SELECT USING (
    user_is_org_member(auth.uid(), organization_id) AND deleted_at IS NULL
  );

-- Managers+ can insert teams
CREATE POLICY team_insert_manager ON teams
  FOR INSERT WITH CHECK (
    user_is_org_member(auth.uid(), organization_id, 'manager')
  );

-- Managers+ can update teams
CREATE POLICY team_update_manager ON teams
  FOR UPDATE USING (
    user_is_org_member(auth.uid(), organization_id, 'manager')
  );

-- Admins can delete teams
CREATE POLICY team_delete_admin ON teams
  FOR DELETE USING (
    user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- ============================================================================
-- TEAM_MEMBERS RLS POLICIES
-- ============================================================================

-- Users in org can read team members of teams in their org
CREATE POLICY team_member_select_org ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE id = team_id
        AND user_is_org_member(auth.uid(), organization_id)
        AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Managers+ can insert team members
CREATE POLICY team_member_insert_manager ON team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams
      WHERE id = team_id
        AND user_is_org_member(auth.uid(), organization_id, 'manager')
        AND deleted_at IS NULL
    )
  );

-- Managers+ can update team members
CREATE POLICY team_member_update_manager ON team_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE id = team_id
        AND user_is_org_member(auth.uid(), organization_id, 'manager')
        AND deleted_at IS NULL
    )
  );

-- Admins can delete team members
CREATE POLICY team_member_delete_admin ON team_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE id = team_id
        AND user_is_org_member(auth.uid(), organization_id, 'admin')
        AND deleted_at IS NULL
    )
  );

-- ============================================================================
-- EVENTS RLS POLICIES
-- ============================================================================

-- Users in org can read events (respects visibility)
CREATE POLICY event_select_org ON events
  FOR SELECT USING (
    deleted_at IS NULL AND (
      -- Org-level visibility: all org members
      (visibility = 'org' AND user_is_org_member(auth.uid(), organization_id))
      OR
      -- Team-level visibility: team members or team managers+
      (visibility = 'team' AND 
        EXISTS (
          SELECT 1 FROM team_members
          WHERE team_id = events.team_id
            AND (user_id = auth.uid() OR user_id IS NULL)
            AND deleted_at IS NULL
        )
        OR
        user_is_org_member(auth.uid(), organization_id, 'manager')
      )
      OR
      -- Private: only creator and admins
      (visibility = 'private' AND 
        (created_by = auth.uid() OR 
         user_is_org_member(auth.uid(), organization_id, 'admin'))
      )
    )
  );

-- Managers+ can create events
CREATE POLICY event_insert_manager ON events
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
    AND user_is_org_member(auth.uid(), organization_id, 'manager')
  );

-- Managers+ can update events they created, admins can update all
CREATE POLICY event_update_manager ON events
  FOR UPDATE USING (
    (created_by = auth.uid() AND user_is_org_member(auth.uid(), organization_id, 'manager'))
    OR user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- Admins can delete events
CREATE POLICY event_delete_admin ON events
  FOR DELETE USING (
    user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- ============================================================================
-- FILES RLS POLICIES
-- ============================================================================

-- Users can read files in their org (respects visibility)
CREATE POLICY file_select_org ON files
  FOR SELECT USING (
    deleted_at IS NULL AND (
      -- Org-level visibility
      (visibility = 'org' AND user_is_org_member(auth.uid(), organization_id))
      OR
      -- Team-level visibility
      (visibility = 'team' AND team_id IS NOT NULL AND 
        EXISTS (
          SELECT 1 FROM team_members
          WHERE team_id = files.team_id
            AND user_id = auth.uid()
            AND deleted_at IS NULL
        )
        OR
        user_is_org_member(auth.uid(), organization_id, 'manager')
      )
      OR
      -- Private: only uploader and admins
      (visibility = 'private' AND 
        (uploaded_by = auth.uid() OR 
         user_is_org_member(auth.uid(), organization_id, 'admin'))
      )
    )
  );

-- Team members+ can upload files
CREATE POLICY file_insert_user ON files
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid()
    AND user_is_org_member(auth.uid(), organization_id, 'player')
  );

-- Users can update their own files, managers+ can update all
CREATE POLICY file_update_user ON files
  FOR UPDATE USING (
    (uploaded_by = auth.uid())
    OR user_is_org_member(auth.uid(), organization_id, 'manager')
  );

-- Admins or file owner can delete
CREATE POLICY file_delete_user ON files
  FOR DELETE USING (
    (uploaded_by = auth.uid())
    OR user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- ============================================================================
-- AI_USAGE RLS POLICIES
-- ============================================================================

-- Users can see their own AI usage and admins can see all
CREATE POLICY ai_usage_select ON ai_usage
  FOR SELECT USING (
    user_id = auth.uid()
    OR user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- Server-side only: insert/update via trigger or server action
CREATE POLICY ai_usage_insert ON ai_usage
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND user_is_org_member(auth.uid(), organization_id)
  );

CREATE POLICY ai_usage_update ON ai_usage
  FOR UPDATE USING (
    user_id = auth.uid()
    AND user_is_org_member(auth.uid(), organization_id)
  );

-- ============================================================================
-- SUBSCRIPTIONS RLS POLICIES
-- ============================================================================

-- Only admins can read subscription details
CREATE POLICY subscription_select_admin ON subscriptions
  FOR SELECT USING (
    user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- Admins can update subscriptions
CREATE POLICY subscription_update_admin ON subscriptions
  FOR UPDATE USING (
    user_is_org_member(auth.uid(), organization_id, 'admin')
  );

-- Server-side only: subscription creation via webhooks
CREATE POLICY subscription_insert_admin ON subscriptions
  FOR INSERT WITH CHECK (
    user_is_org_member(auth.uid(), organization_id, 'admin')
  );
