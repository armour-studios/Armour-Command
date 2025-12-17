// Utility functions for common operations

import { type SupabaseClient } from '@supabase/supabase-js'
import type { UserRole } from '@/lib/types/database'

/**
 * Get user's role in an organization
 */
export async function getUserOrgRole(
  supabase: SupabaseClient,
  userId: string,
  organizationId: string
): Promise<UserRole | null> {
  const { data } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .eq('status', 'active')
    .single()

  return (data?.role as UserRole) || null
}

/**
 * Check if user has required permission in organization
 */
export async function hasOrgPermission(
  supabase: SupabaseClient,
  userId: string,
  organizationId: string,
  requiredRole: UserRole
): Promise<boolean> {
  const role = await getUserOrgRole(supabase, userId, organizationId)
  if (!role) return false

  const roleHierarchy: Record<UserRole, number> = {
    owner: 5,
    admin: 4,
    manager: 3,
    coach: 2,
    player: 1,
  }

  return roleHierarchy[role] >= roleHierarchy[requiredRole]
}

/**
 * Format a date to user-friendly string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a datetime
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Convert bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Wait for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
