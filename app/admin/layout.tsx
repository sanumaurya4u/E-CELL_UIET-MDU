import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminAuthProvider } from '@/context/AdminAuthProvider'

export const metadata: Metadata = {
  title: 'Admin Dashboard | E-Cell | UIET MDU Rohtak',
  description: 'Protected Administration & Content Management System for E-Cell | UIET MDU Rohtak',
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/login?message=Access restricted to authorized E-Cell Administrators.')
  }

  const adminUser = {
    email: user.email || '',
    name: profile?.full_name || user.email?.split('@')[0] || 'Admin',
    role: 'Admin',
  }

  return <AdminAuthProvider initialUser={adminUser}>{children}</AdminAuthProvider>
}
