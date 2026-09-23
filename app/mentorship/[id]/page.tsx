import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { avatarUrl } from '@/lib/utils'
import RequestForm from './RequestForm'

export default async function RequestMentorshipPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Ensure user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login?message=Please log in to request mentorship')
  }

  // Fetch mentor details
  const { data: mentor } = await supabase
    .from('users')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!mentor || mentor.role !== 'mentor') {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 mb-20">
      <Link href="/mentorship" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Mentors
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b dark:border-slate-800">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
            <Image src={avatarUrl(mentor.full_name)} alt="Avatar" width={80} height={80} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{mentor.full_name}</h1>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Mentor</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Request a Session</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Write a brief message explaining what you&apos;re working on and how {mentor.full_name} can help you.
        </p>

        <RequestForm mentorId={mentor.id} studentId={user.id} />
      </div>
    </div>
  )
}
