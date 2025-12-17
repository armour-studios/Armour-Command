// Centralized exports for types and utilities
export * from '@/lib/types/database'

// Plan configuration
export const PLAN_CONFIG = {
  free: {
    name: 'Free',
    price: 0,
    ai_messages_per_month: 50,
    image_generation_credits: 5,
    storage_limit_gb: 5,
    teams_allowed: 1,
    team_members_allowed: 10,
  },
  armoured: {
    name: 'Armoured',
    price: 4999, // $49.99/month in cents
    ai_messages_per_month: 500,
    image_generation_credits: 50,
    storage_limit_gb: 100,
    teams_allowed: 3,
    team_members_allowed: 50,
  },
  armoured_elite: {
    name: 'Armoured Elite',
    price: 9999, // $99.99/month in cents
    ai_messages_per_month: 5000,
    image_generation_credits: 500,
    storage_limit_gb: 1000,
    teams_allowed: null, // Unlimited
    team_members_allowed: null, // Unlimited
  },
}

// Role hierarchy for permission checks
export const ROLE_HIERARCHY = {
  owner: 5,
  admin: 4,
  manager: 3,
  coach: 2,
  player: 1,
} as const

export function canUserAccess(
  userRole: string,
  requiredRole: string
): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0
  return userLevel >= requiredLevel
}

// Event type colors
export const EVENT_TYPE_COLORS = {
  match: 'bg-red-500/20 border-red-500',
  scrim: 'bg-yellow-500/20 border-yellow-500',
  practice: 'bg-blue-500/20 border-blue-500',
  meeting: 'bg-purple-500/20 border-purple-500',
  other: 'bg-gray-500/20 border-gray-500',
}

// Visibility options
export const VISIBILITY_OPTIONS = {
  org: 'Organization',
  team: 'Team',
  private: 'Private',
}

// Team member roles
export const TEAM_MEMBER_ROLES = ['player', 'coach', 'manager']

// Organization membership roles
export const ORG_ROLES = ['player', 'coach', 'manager', 'admin', 'owner']
