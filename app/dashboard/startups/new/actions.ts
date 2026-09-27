'use server'

import { submitPublicStartup } from '@/app/startups/new/actions'

export async function submitStartup(formData: FormData) {
  return await submitPublicStartup(formData)
}
