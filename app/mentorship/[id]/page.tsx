import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { avatarUrl } from '@/lib/utils'
import RequestForm from './RequestForm'

export default async function RequestMentorshipPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch mentor details publicly (no login required)
  const { data: mentor } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (!mentor || mentor.role !== 'mentor') {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 pb-20">
      <Link
        href="/mentorship"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-secondary hover:text-orange-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Mentorship Hub</span>
      </Link>

      <div className="card-warm p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-warm">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border border-warm bg-warm-secondary">
              <Image
                src={mentor.avatar_url || avatarUrl(mentor.full_name)}
                alt={mentor.full_name || 'Mentor'}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-accent" />
                <span>{mentor.branch ? `${mentor.branch} • Alumni Mentor` : 'Verified Mentor'}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-warm-primary">
                {mentor.full_name}
              </h1>
              {mentor.graduation_year && (
                <p className="text-xs text-warm-muted mt-0.5">
                  Class of {mentor.graduation_year}
                </p>
              )}
            </div>
          </div>

          {mentor.linkedin_url && (
            <a
              href={mentor.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-secondary text-xs px-4 py-2 font-semibold shrink-0 self-start sm:self-center"
            >
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {mentor.bio && (
          <p className="text-xs sm:text-sm text-warm-secondary leading-relaxed mb-8 p-4 rounded-2xl bg-warm-secondary border border-warm">
            {mentor.bio}
          </p>
        )}

        <h2 className="text-lg font-extrabold text-warm-primary mb-1.5">
          Request a Mentorship Session
        </h2>
        <p className="text-xs sm:text-sm text-warm-secondary mb-6">
          Submit your details and what you&apos;re building below — no login or account required.
        </p>

        <RequestForm mentorId={mentor.id} />
      </div>
    </div>
  )
}
