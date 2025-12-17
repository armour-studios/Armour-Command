'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

// ============================================================================
// ORGANIZATION ACTIONS
// ============================================================================

const createOrgSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  timezone: z.string().default('UTC'),
})

export async function createOrganization(input: z.infer<typeof createOrgSchema>) {
  try {
    const validated = createOrgSchema.parse(input)
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: validated.name,
        slug: validated.slug,
        description: validated.description,
        timezone: validated.timezone,
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Create owner membership
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: user.id,
        organization_id: org.id,
        role: 'owner',
        status: 'active',
        joined_at: new Date().toISOString(),
      })

    if (membershipError) throw membershipError

    // Create free subscription
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        organization_id: org.id,
        plan: 'free',
        status: 'active',
      })

    if (subError) throw subError

    return { success: true, organization: org }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create organization'
    return { success: false, error: message }
  }
}

// ============================================================================
// TEAM ACTIONS
// ============================================================================

const createTeamSchema = z.object({
  organization_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  game: z.string().optional(),
  description: z.string().optional(),
})

export async function createTeam(input: z.infer<typeof createTeamSchema>) {
  try {
    const validated = createTeamSchema.parse(input)
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check authorization: user must be manager+ in org
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', validated.organization_id)
      .eq('status', 'active')
      .single()

    if (!membership || !['owner', 'admin', 'manager'].includes(membership.role)) {
      throw new Error('Insufficient permissions')
    }

    const { data: team, error } = await supabase
      .from('teams')
      .insert({
        organization_id: validated.organization_id,
        name: validated.name,
        game: validated.game,
        description: validated.description,
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, team }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create team'
    return { success: false, error: message }
  }
}

// ============================================================================
// EVENT ACTIONS
// ============================================================================

const createEventSchema = z.object({
  organization_id: z.string().uuid(),
  team_id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  event_type: z.enum(['match', 'scrim', 'practice', 'meeting', 'other']),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  visibility: z.enum(['org', 'team', 'private']).default('org'),
  description: z.string().optional(),
  location: z.string().optional(),
  opponent: z.string().optional(),
})

export async function createEvent(input: z.infer<typeof createEventSchema>) {
  try {
    const validated = createEventSchema.parse(input)
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check authorization: user must be manager+ in org
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', validated.organization_id)
      .eq('status', 'active')
      .single()

    if (!membership || !['owner', 'admin', 'manager'].includes(membership.role)) {
      throw new Error('Insufficient permissions')
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        organization_id: validated.organization_id,
        team_id: validated.team_id,
        title: validated.title,
        event_type: validated.event_type,
        start_time: validated.start_time,
        end_time: validated.end_time,
        visibility: validated.visibility,
        description: validated.description,
        location: validated.location,
        opponent: validated.opponent,
        created_by: user.id,
        status: 'scheduled',
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, event }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create event'
    return { success: false, error: message }
  }
}

// ============================================================================
// INVITATION ACTIONS
// ============================================================================

const inviteUserSchema = z.object({
  organization_id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'coach', 'player']),
})

export async function inviteUserToOrganization(input: z.infer<typeof inviteUserSchema>) {
  try {
    const validated = inviteUserSchema.parse(input)
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check authorization: user must be admin in org
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', validated.organization_id)
      .eq('status', 'active')
      .single()

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      throw new Error('Insufficient permissions')
    }

    // Generate invite token
    const inviteToken = crypto.getRandomValues(new Uint8Array(32))
    const token = Array.from(inviteToken).map(b => b.toString(16).padStart(2, '0')).join('')

    // Create or update membership
    const { data: invitedMembership, error } = await supabase
      .from('memberships')
      .upsert({
        user_id: null, // Will be set when user accepts
        organization_id: validated.organization_id,
        role: validated.role,
        status: 'invited',
        invite_token: token,
        invite_sent_at: new Date().toISOString(),
      }, {
        onConflict: 'organization_id' // Update if exists
      })
      .select()
      .single()

    if (error) throw error

    // TODO: Send email invitation with token
    // sendInvitationEmail(validated.email, token, org.name)

    return { success: true, membership: invitedMembership }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to invite user'
    return { success: false, error: message }
  }
}
