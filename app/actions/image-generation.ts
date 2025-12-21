'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import OpenAI from 'openai'

// This is a scaffolding for image generation
// You'll integrate with DALL-E, Midjourney, or similar service

const generateImageSchema = z.object({
  organization_id: z.string().uuid(),
  prompt: z.string().min(10).max(2000),
  image_type: z.enum(['match_graphic', 'social_post', 'thumbnail', 'custom']),
})

export async function generateImage(
  input: z.infer<typeof generateImageSchema>
) {
  try {
    const validated = generateImageSchema.parse(input)
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

    if (!membership || !['owner', 'admin', 'manager', 'coach'].includes(membership.role)) {
      throw new Error('Insufficient permissions')
    }

    // Check subscription plan and credits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('organization_id', validated.organization_id)
      .single()

    const plan = subscription?.plan || 'free'

    // Get plan limits
    const { data: limits } = await supabase
      .from('plan_limits')
      .select('image_generation_credits_per_month')
      .eq('plan', plan)
      .single()

    // Check monthly usage
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    // TODO: Implement credit tracking table for finer granularity
    // For now, using a simplified approach via ai_usage

    // Call image generation API (DALL-E, etc)
    // This is a placeholder - implement with actual service
    const imageUrl = await callImageGenerationAPI(validated.prompt)

    // Save to Supabase Storage
    const fileName = `generated-images/${validated.organization_id}/${Date.now()}.png`

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, Buffer.from(imageUrl, 'base64'), {
        contentType: 'image/png',
      })

    if (uploadError) {
      throw new Error('Failed to upload image')
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName)

    return {
      success: true,
      image: {
        url: publicUrl,
        type: validated.image_type,
        created_at: new Date(),
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate image'
    return { success: false, error: message }
  }
}

// Actual image generation API call
async function callImageGenerationAPI(prompt: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
  })

  const image = response.data[0].b64_json
  if (!image) {
    throw new Error('No image generated')
  }

  return image
}
