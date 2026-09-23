'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const fullName = formData.get('fullName') as string
  const branch = formData.get('branch') as string
  const graduationYearStr = formData.get('graduationYear') as string
  const bio = formData.get('bio') as string
  const linkedinUrl = formData.get('linkedinUrl') as string

  const graduationYear = graduationYearStr ? parseInt(graduationYearStr, 10) : null

  const { error } = await supabase
    .from('users')
    .update({
      full_name: fullName,
      branch: branch || null,
      graduation_year: graduationYear,
      bio: bio || null,
      linkedin_url: linkedinUrl || null,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { error: 'Failed to update profile' }
  }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  
  return { success: true }
}
