'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitApplication(data: {
  fullName: string
  enrollment: string
  email: string
  phone: string
  branch: string
  year: string
  department: string
  linkedin?: string
  whyJoin: string
  website_hp?: string
}) {
  // Honeypot anti-spam check
  if (data.website_hp && data.website_hp.trim().length > 0) {
    return { success: true }
  }

  const name = (data.fullName || '').trim()
  const enrollment = (data.enrollment || '').trim()
  const email = (data.email || '').trim().toLowerCase()
  const phone = (data.phone || '').trim()
  const branch = (data.branch || '').trim()
  const year = (data.year || '').trim()
  const department = (data.department || '').trim()
  const linkedin = (data.linkedin || '').trim()
  const whyJoin = (data.whyJoin || '').trim()

  if (name.length < 2 || name.length > 100) {
    return { error: 'Please enter your valid full name.' }
  }
  if (!enrollment || enrollment.length < 3) {
    return { error: 'Please enter your university enrollment/roll number.' }
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }
  if (!phone || phone.length < 7) {
    return { error: 'Please enter a valid phone number.' }
  }
  if (!branch || !year || !department) {
    return { error: 'Please select your branch, year, and preferred department.' }
  }
  if (whyJoin.length < 10 || whyJoin.length > 500) {
    return { error: 'Please provide a brief statement of purpose (10–500 characters).' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('applications').insert([
    {
      name,
      enrollment,
      email,
      phone,
      branch_year: `${year}, ${branch}`,
      dept_interest: department,
      why_join: whyJoin,
      linkedin: linkedin || null,
      status: 'Pending',
    },
  ])

  if (error) {
    return { error: 'Failed to submit application. Please try again.' }
  }

  revalidatePath('/admin')
  return { success: true }
}
