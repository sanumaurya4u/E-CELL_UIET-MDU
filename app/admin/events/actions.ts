'use server'

import { saveEventAction } from '@/app/admin/actions'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const res = await saveEventAction(formData)
  if (res?.error) {
    return { error: res.error }
  }
  redirect('/admin')
}
