import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { avatarUrl } from '@/lib/utils'
import { Sparkles, Users, ArrowRight } from 'lucide-react'

export default async function MentorshipPage() {
  const supabase = await createClient()

  const { data: mentors } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'mentor')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ALUMNI & EXPERTS • MENTORSHIP</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-warm-primary mb-4 leading-tight">
          UIET Mentorship <span className="text-orange-accent">Hub</span>
        </h1>
        <p className="text-base text-warm-secondary leading-relaxed">
          Connect with experienced alumni and industry experts who can guide you on your entrepreneurial journey and career scaling.
        </p>
      </div>

      {!mentors || mentors.length === 0 ? (
        <div className="p-14 border border-dashed border-warm rounded-2xl text-center bg-warm-surface max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-warm-secondary flex items-center justify-center mx-auto mb-4 text-warm-muted">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-warm-primary mb-1">Onboarding Mentors</h3>
          <p className="text-sm text-warm-secondary max-w-sm mx-auto mb-4">
            We are currently onboarding experienced alumni and founder mentors. Check back soon!
          </p>
          <Link
            href="/contact"
            className="btn-pill-secondary text-xs px-5 py-2.5 font-semibold inline-flex"
          >
            Apply to Become a Mentor
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map(mentor => (
            <div key={mentor.id} className="card-warm p-6 flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border border-warm relative shadow-2xs">
                <Image 
                  src={avatarUrl(mentor.full_name)} 
                  alt={mentor.full_name || 'Mentor'} 
                  width={80} 
                  height={80} 
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-warm-primary group-hover:text-orange-accent transition-colors mb-1">
                {mentor.full_name}
              </h3>
              <span className="badge-pill border-orange-accent/40 text-orange-accent text-[11px] font-bold mb-4">
                {mentor.branch ? `${mentor.branch} Alumni` : 'Industry Expert'}
              </span>
              <p className="text-xs text-warm-secondary leading-relaxed mb-6 line-clamp-3">
                {mentor.bio || 'Experienced professional dedicated to helping UIET students build impactful ventures.'}
              </p>
              <Link 
                href={`/mentorship/${mentor.id}`}
                className="mt-auto w-full btn-pill-secondary text-xs py-2.5 font-semibold group-hover:border-warm-strong transition-all"
              >
                <span>Request Mentorship Session</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
