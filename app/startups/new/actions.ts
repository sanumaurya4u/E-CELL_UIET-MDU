'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitPublicStartup(formData: FormData) {
  // Honeypot anti-spam check
  const honeypot = ((formData.get('website_hp') as string) || '').trim()
  if (honeypot.length > 0) {
    return { success: true }
  }

  const name = ((formData.get('name') as string) || '').trim()
  const tagline = ((formData.get('tagline') as string) || '').trim()
  const description = ((formData.get('description') as string) || '').trim()
  const websiteUrl = ((formData.get('websiteUrl') as string) || '').trim()
  const founderName = ((formData.get('founderName') as string) || '').trim()
  const founderEmail = ((formData.get('founderEmail') as string) || '')
    .trim()
    .toLowerCase()
  const founderBranch = ((formData.get('founderBranch') as string) || '').trim()

  if (name.length < 2 || name.length > 100) {
    return { error: 'Please enter a valid startup name (2–100 characters).' }
  }
  if (tagline.length < 3 || tagline.length > 160) {
    return { error: 'Please enter a concise tagline (3–160 characters).' }
  }
  if (description.length < 10 || description.length > 2000) {
    return { error: 'Please provide a description (at least 10 characters).' }
  }
  if (founderName.length < 2 || founderName.length > 100) {
    return { error: 'Please enter the founder name.' }
  }
  if (!EMAIL_REGEX.test(founderEmail)) {
    return { error: 'Please enter a valid founder email address.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('startups').insert([
    {
      name,
      tagline,
      description,
      website_url: websiteUrl || null,
      founder_name: founderName,
      founder_email: founderEmail,
      founder_branch: founderBranch || null,
      status: 'pending',
    },
  ])

  if (error) {
    return { error: 'Failed to submit startup. Please try again.' }
  }

  revalidatePath('/startups')
  revalidatePath('/admin')
  return { success: true }
}
