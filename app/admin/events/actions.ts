'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const location = formData.get('location') as string
  const registrationLink = formData.get('registrationLink') as string
  const imageUrl = formData.get('imageUrl') as string

  const { error } = await supabase
    .from('events')
    .insert([{
      title,
      description,
      date: new Date(date).toISOString(),
      location,
      registration_link: registrationLink || null,
      image_url: imageUrl || null
    }])

  if (error) {
    return { error: 'Failed to create event' }
  }

  revalidatePath('/events')
  revalidatePath('/admin')
  redirect('/admin')
}
