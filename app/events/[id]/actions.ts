'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitRsvp(eventId: string, formData: FormData) {
  // Honeypot spam check
  const honeypot = (formData.get('website_hp') as string) || ''
  if (honeypot.trim().length > 0) {
    return { success: true }
  }

  const fullName = ((formData.get('fullName') as string) || '').trim()
  const email = ((formData.get('email') as string) || '').trim().toLowerCase()
  const phone = ((formData.get('phone') as string) || '').trim()
  const branch = ((formData.get('branch') as string) || '').trim()
  const rollNo = ((formData.get('rollNo') as string) || '').trim()

  if (!eventId) {
    return { error: 'Invalid event reference.' }
  }
  if (fullName.length < 2 || fullName.length > 100) {
    return { error: 'Please enter your valid full name (2–100 characters).' }
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }
  if (phone && (phone.length < 7 || phone.length > 20)) {
    return { error: 'Please enter a valid contact phone number.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('event_rsvps').insert([
    {
      event_id: eventId,
      full_name: fullName,
      email,
      phone: phone || null,
      branch: branch || null,
      roll_no: rollNo || null,
    },
  ])

  if (error) {
    if (error.code === '23505') {
      return {
        error: 'You have already registered for this event with this email address.',
      }
    }
    return { error: 'Failed to submit registration. Please try again.' }
  }

  revalidatePath(`/events/${eventId}`)
  return { success: true }
}
