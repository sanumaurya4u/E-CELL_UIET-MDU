'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?message=Please provide both email and password.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    redirect('/login?message=Invalid administrator credentials.')
  }

  // Verify that the authenticated user has the 'admin' role in public.users
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role !== 'admin') {
    await supabase.auth.signOut()
    redirect('/login?message=Access restricted to authorized E-Cell Administrators.')
  }

  revalidatePath('/', 'layout')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function signup() {
  // Public user signup is disabled under the Public Visitor + Admin Only model
  redirect('/')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
