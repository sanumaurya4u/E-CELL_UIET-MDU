'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitMentorshipRequest(formData: FormData) {
  // Honeypot anti-spam check
  const honeypot = ((formData.get('website_hp') as string) || '').trim()
  if (honeypot.length > 0) {
    return { success: true }
  }

  const mentorId = ((formData.get('mentorId') as string) || '').trim()
  const studentName = ((formData.get('studentName') as string) || '').trim()
  const studentEmail = ((formData.get('studentEmail') as string) || '')
    .trim()
    .toLowerCase()
  const studentPhone = ((formData.get('studentPhone') as string) || '').trim()
  const studentBranch = ((formData.get('studentBranch') as string) || '').trim()
  const message = ((formData.get('message') as string) || '').trim()

  if (!mentorId) {
    return { error: 'Invalid mentor selection.' }
  }
  if (studentName.length < 2 || studentName.length > 100) {
    return { error: 'Please enter your full name.' }
  }
  if (!EMAIL_REGEX.test(studentEmail)) {
    return { error: 'Please enter a valid email address.' }
  }
  if (message.length < 10 || message.length > 2000) {
    return {
      error: 'Please write a brief message (at least 10 characters) describing your goals.',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('mentorship_requests').insert([
    {
      mentor_id: mentorId,
      student_name: studentName,
      student_email: studentEmail,
      student_phone: studentPhone || null,
      student_branch: studentBranch || null,
      message,
      status: 'pending',
    },
  ])

  if (error) {
    return { error: 'Failed to send mentorship request. Please try again.' }
  }

  revalidatePath(`/mentorship/${mentorId}`)
  revalidatePath('/admin')
  return { success: true }
}
