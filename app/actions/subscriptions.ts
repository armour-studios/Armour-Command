'use server'

import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

// ============================================================================
// SUBSCRIPTION ACTIONS
// ============================================================================

const createCheckoutSessionSchema = z.object({
  organization_id: z.string().uuid(),
  plan: z.enum(['armoured', 'armoured_elite']),
  success_url: z.string().url(),
  cancel_url: z.string().url(),
})

export async function createCheckoutSession(
  input: z.infer<typeof createCheckoutSessionSchema>
) {
  try {
    const validated = createCheckoutSessionSchema.parse(input)
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check authorization
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

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('organization_id', validated.organization_id)
      .single()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          organization_id: validated.organization_id,
          user_id: user.id,
        },
      })
      customerId = customer.id
    }

    // Get pricing (in production, store these in database)
    const priceMap: Record<string, string> = {
      armoured: process.env.STRIPE_PRICE_ARMOURED!,
      armoured_elite: process.env.STRIPE_PRICE_ELITE!,
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceMap[validated.plan],
          quantity: 1,
        },
      ],
      success_url: validated.success_url,
      cancel_url: validated.cancel_url,
      metadata: {
        organization_id: validated.organization_id,
      },
    })

    if (!session.url) {
      throw new Error('Failed to create checkout session')
    }

    return { success: true, url: session.url }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return { success: false, error: message }
  }
}

// ============================================================================
// WEBHOOK HANDLERS (for Edge Functions or API routes)
// ============================================================================

const webhookHandlers = {
  'customer.subscription.created': async (event: any) => {
    const subscription = event.data.object
    const organizationId = subscription.metadata.organization_id

    const supabase = await createServerSupabaseClient()

    await supabase.from('subscriptions').upsert({
      organization_id: organizationId,
      stripe_customer_id: subscription.customer,
      stripe_subscription_id: subscription.id,
      plan: subscription.metadata.plan,
      status: 'active',
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      billing_cycle_anchor: new Date(subscription.billing_cycle_anchor * 1000),
    })
  },

  'customer.subscription.updated': async (event: any) => {
    const subscription = event.data.object
    const organizationId = subscription.metadata.organization_id

    const supabase = await createServerSupabaseClient()

    await supabase.from('subscriptions').update({
      plan: subscription.metadata.plan,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
    }).eq('organization_id', organizationId)
  },

  'customer.subscription.deleted': async (event: any) => {
    const subscription = event.data.object
    const organizationId = subscription.metadata.organization_id

    const supabase = await createServerSupabaseClient()

    await supabase.from('subscriptions').update({
      status: 'cancelled',
    }).eq('organization_id', organizationId)
  },
}

export async function handleStripeWebhook(event: any) {
  const handler = webhookHandlers[event.type as keyof typeof webhookHandlers]
  
  if (handler) {
    try {
      await handler(event)
      return { success: true }
    } catch (error) {
      console.error('Webhook handler error:', error)
      return { success: false, error }
    }
  }

  return { success: true } // Acknowledge unknown events
}
