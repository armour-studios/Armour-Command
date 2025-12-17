'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ============================================================================
// AI CHAT ACTIONS
// ============================================================================

const chatMessageSchema = z.object({
  organization_id: z.string().uuid(),
  team_id: z.string().uuid().optional(),
  message: z.string().min(1).max(4000),
  context: z.enum(['org', 'team', 'general']).default('general'),
})

// Build context from org/team data for better AI responses
async function buildAIContext(
  organizationId: string,
  teamId?: string,
  limit: number = 5
) {
  const supabase = await createServerSupabaseClient()
  const contextParts: string[] = []

  // Get organization info
  const { data: org } = await supabase
    .from('organizations')
    .select('name, description')
    .eq('id', organizationId)
    .single()

  if (org) {
    contextParts.push(`Organization: ${org.name}`)
    if (org.description) {
      contextParts.push(`About: ${org.description}`)
    }
  }

  // Get recent events
  const { data: events } = await supabase
    .from('events')
    .select('title, event_type, start_time')
    .eq('organization_id', organizationId)
    .eq('status', 'scheduled')
    .order('start_time', { ascending: true })
    .limit(limit)

  if (events && events.length > 0) {
    contextParts.push(
      `Upcoming events: ${events.map(e => `${e.title} (${e.event_type})`).join(', ')}`
    )
  }

  // Get team info if provided
  if (teamId) {
    const { data: team } = await supabase
      .from('teams')
      .select('name, game')
      .eq('id', teamId)
      .single()

    if (team) {
      contextParts.push(`Team: ${team.name}${team.game ? ` (${team.game})` : ''}`)
    }

    // Get team members
    const { data: members } = await supabase
      .from('team_members')
      .select('name, position')
      .eq('team_id', teamId)
      .eq('status', 'active')
      .limit(10)

    if (members && members.length > 0) {
      contextParts.push(
        `Players: ${members.map(m => `${m.name}${m.position ? ` (${m.position})` : ''}`).join(', ')}`
      )
    }
  }

  return contextParts.join('\n')
}

export async function sendAIMessage(
  input: z.infer<typeof chatMessageSchema>
) {
  try {
    const validated = chatMessageSchema.parse(input)
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check authorization and get role
    const { data: membership } = await supabase
      .from('memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', validated.organization_id)
      .eq('status', 'active')
      .single()

    if (!membership) {
      throw new Error('Insufficient permissions')
    }

    // Check subscription plan and limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('organization_id', validated.organization_id)
      .single()

    const plan = subscription?.plan || 'free'

    // Get plan limits
    const { data: limits } = await supabase
      .from('plan_limits')
      .select('ai_messages_per_month')
      .eq('plan', plan)
      .single()

    // Check monthly usage
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const { data: usage } = await supabase
      .from('ai_usage')
      .select('message_count')
      .eq('organization_id', validated.organization_id)
      .eq('user_id', user.id)
      .gte('created_at', monthStart.toISOString())
      .single()

    const messageCount = usage?.message_count || 0
    const limit = limits?.ai_messages_per_month

    if (limit && messageCount >= limit) {
      throw new Error(`Monthly message limit (${limit}) exceeded`)
    }

    // Build context for better AI responses
    const context = await buildAIContext(
      validated.organization_id,
      validated.team_id
    )

    const systemPrompt = `You are an AI assistant for Armour Nexus, an esports organization management platform. 
You help organization members with roster management, scheduling, media, and general esports operations.
Be professional, helpful, and concise.

Organization Context:
${context}

User Role: ${membership.role}`

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: validated.message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const assistantMessage =
      response.choices[0]?.message?.content || 'No response'
    const tokensUsed = response.usage?.total_tokens || 0

    // Log AI usage
    const { error: logError } = await supabase.from('ai_usage').upsert(
      {
        organization_id: validated.organization_id,
        user_id: user.id,
        message_count: messageCount + 1,
        tokens_used: (usage?.message_count || 0) + tokensUsed,
        context: validated.context,
      },
      {
        onConflict: 'organization_id,user_id',
      }
    )

    if (logError) {
      console.error('Failed to log AI usage:', logError)
    }

    return {
      success: true,
      message: assistantMessage,
      usage: {
        messagesUsed: messageCount + 1,
        messagesLimit: limit,
        tokensUsed,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send message'
    return { success: false, error: message }
  }
}
