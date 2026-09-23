'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitMentorshipRequest(formData: FormData) {
  const supabase = await createClient()
  
  const mentorId = formData.get('mentorId') as string
  const studentId = formData.get('studentId') as string
  const message = formData.get('message') as string

  const { error } = await supabase
    .from('mentorship_requests')
    .insert([
      {
        student_id: studentId,
        mentor_id: mentorId,
        message: message
      }
    ])

  if (error) {
    return { error: 'Failed to send request. Please try again.' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard?message=Mentorship request sent successfully')
}
