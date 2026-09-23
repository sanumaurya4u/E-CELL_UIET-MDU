import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, User, Calendar, Rocket, Users, Shield } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const isProfileComplete = profile?.branch && profile?.graduation_year

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-secondary border border-warm text-orange-accent text-[11px] font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUS DASHBOARD • UIET MDU</span>
          </div>
          <h1 className="text-3xl font-extrabold text-warm-primary">
            Welcome back, <span className="text-orange-accent">{profile?.full_name || user.email}</span>!
          </h1>
          <p className="text-sm text-warm-secondary mt-1">
            Manage your startup profile, event participation, and mentor connections.
          </p>
        </div>

        {profile?.role === 'admin' && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-warm-secondary border border-warm rounded-full text-xs font-bold text-warm-primary hover:border-orange-accent transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-orange-accent" />
            <span>Admin Portal</span>
          </Link>
        )}
      </div>

      <div className="card-warm p-6 sm:p-8 shadow-xs">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Profile Status Card */}
          <div className="p-6 border border-warm rounded-2xl bg-warm-secondary flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-warm-surface border border-warm flex items-center justify-center text-orange-accent">
                  <User className="w-4 h-4" />
                </div>
                <span className={`badge-pill text-[10px] font-bold ${isProfileComplete ? 'border-[#79d45e]/40 text-[#2f7a1d]' : 'border-orange-accent/40 text-orange-accent'}`}>
                  {isProfileComplete ? 'COMPLETE' : 'INCOMPLETE'}
                </span>
              </div>
              <h2 className="text-base font-bold text-warm-primary mb-1">
                {isProfileComplete ? 'Profile Complete' : 'Complete Your Profile'}
              </h2>
              <p className="text-xs text-warm-secondary leading-relaxed mb-4">
                {isProfileComplete 
                  ? 'Your profile is up to date. Mentors and peers can now learn about your skills.' 
                  : 'Add your branch, graduation year, and skills to connect with mentors and peers.'}
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 font-semibold text-xs text-warm-primary hover:text-orange-accent transition-colors"
            >
              <span>{isProfileComplete ? 'Edit Profile' : 'Complete Profile'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {/* Events Card */}
          <div className="p-6 border border-warm rounded-2xl bg-warm-surface flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent mb-3">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-warm-primary mb-1">Upcoming Events</h2>
              <p className="text-xs text-warm-secondary leading-relaxed mb-4">
                Check out hackathons, workshops, and founder sessions happening this month.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1 font-semibold text-xs text-warm-primary hover:text-orange-accent transition-colors"
            >
              <span>View Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Startup Card */}
          <div className="p-6 border border-warm rounded-2xl bg-warm-surface flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent mb-3">
                <Rocket className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-warm-primary mb-1">Your Startup</h2>
              <p className="text-xs text-warm-secondary leading-relaxed mb-4">
                Working on an idea or MVP? Submit it to the public directory for student visibility.
              </p>
            </div>
            <Link
              href="/dashboard/startups/new"
              className="inline-flex items-center gap-1 font-semibold text-xs text-warm-primary hover:text-orange-accent transition-colors"
            >
              <span>Submit Startup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mentorship Card */}
          <div className="p-6 border border-warm rounded-2xl bg-warm-surface flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-warm-primary mb-1">Mentorship Hub</h2>
              <p className="text-xs text-warm-secondary leading-relaxed mb-4">
                Connect with verified alumni and industry experts for career and pitch guidance.
              </p>
            </div>
            <Link
              href="/mentorship"
              className="inline-flex items-center gap-1 font-semibold text-xs text-warm-primary hover:text-orange-accent transition-colors"
            >
              <span>Find a Mentor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
