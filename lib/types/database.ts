// Types for Armour Nexus database tables

export type UserRole = 'owner' | 'admin' | 'manager' | 'coach' | 'player'
export type MembershipStatus = 'active' | 'invited' | 'inactive'
export type EventType = 'match' | 'scrim' | 'practice' | 'meeting' | 'other'
export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type Visibility = 'org' | 'team' | 'private'
export type SubscriptionPlan = 'free' | 'armoured' | 'armoured_elite'
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'ended'

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website?: string
  timezone: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Membership {
  id: string
  user_id: string
  organization_id: string
  role: UserRole
  status: MembershipStatus
  invite_token?: string
  invite_sent_at?: string
  joined_at: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Team {
  id: string
  organization_id: string
  name: string
  description?: string
  game?: string
  icon_url?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id?: string
  name: string
  email?: string
  position?: string
  role: 'player' | 'coach' | 'manager'
  jersey_number?: number
  status: 'active' | 'inactive'
  notes?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Event {
  id: string
  organization_id: string
  team_id?: string
  title: string
  description?: string
  event_type: EventType
  status: EventStatus
  start_time: string
  end_time: string
  location?: string
  opponent?: string
  visibility: Visibility
  created_by: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface File {
  id: string
  organization_id: string
  team_id?: string
  name: string
  description?: string
  file_type?: string
  storage_type: 'google_drive' | 'supabase'
  external_id: string
  file_size_bytes?: number
  mime_type?: string
  visibility: Visibility
  uploaded_by: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface AIUsage {
  id: string
  organization_id: string
  user_id: string
  message_count: number
  tokens_used: number
  context: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  organization_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_start?: string
  current_period_end?: string
  billing_cycle_anchor?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface PlanLimits {
  id: string
  plan: SubscriptionPlan
  ai_messages_per_month?: number
  image_generation_credits_per_month?: number
  storage_limit_gb?: number
  teams_allowed?: number
  team_members_allowed?: number
  created_at: string
  updated_at: string
}
