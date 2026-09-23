import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage events, users, and startups.</p>
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-indigo-600 hover:underline">
          &larr; Back to Student Dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Events</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Manage upcoming E-Cell events.</p>
          <Link href="/admin/events/new" className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
            + Create New Event
          </Link>
        </div>

        <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Startups</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Review startup directory submissions.</p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
            Manage Startups (Phase 4)
          </button>
        </div>

        <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Manage student and mentor roles.</p>
          <button className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-md text-sm font-medium">
            View Users
          </button>
        </div>
      </div>
    </div>
  )
}
