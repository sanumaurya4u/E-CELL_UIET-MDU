'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitStartup(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  const name = formData.get('name') as string
  const tagline = formData.get('tagline') as string
  const description = formData.get('description') as string
  const websiteUrl = formData.get('websiteUrl') as string
  const logoUrl = formData.get('logoUrl') as string

  const { error } = await supabase
    .from('startups')
    .insert([{
      founder_id: user.id,
      name,
      tagline,
      description,
      website_url: websiteUrl || null,
      logo_url: logoUrl || null,
      status: 'pending' // As per Phase 4 requirements
    }])

  if (error) {
    return { error: 'Failed to submit startup' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?message=Startup submitted and pending approval')
}
