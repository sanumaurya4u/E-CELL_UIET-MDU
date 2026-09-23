'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitRsvp(eventId: string, formData: FormData) {
  const supabase = await createClient()
  
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string

  const { error } = await supabase
    .from('event_rsvps')
    .insert([
      {
        event_id: eventId,
        full_name: fullName,
        email: email
      }
    ])

  if (error) {
    return { error: 'Failed to submit RSVP. Please try again.' }
  }

  revalidatePath(`/events/${eventId}`)
  return { success: true }
}
