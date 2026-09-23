import Link from 'next/link'
import { Rocket, Lightbulb, Users, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Trophy, Layers } from 'lucide-react'
import GalleryGrid from '@/components/about/GalleryGrid'
import { gallery } from '@/data/gallery'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Split Editorial Layout)
          ───────────────────────────────────────────────────────────── */}
      <section className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center pb-16 lg:pb-24">
        
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFE7] dark:bg-[#1D1815] border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UIET MDU ROHTAK • CAMPUS PLATFORM</span>
          </div>

          {/* Three-Word / Editorial Stacked Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-warm-primary leading-[1.04] mb-6">
            Fueling.
            <br />
            Mentoring.
            <br />
            <span className="text-orange-accent">Innovating.</span>
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg text-warm-secondary leading-relaxed max-w-xl mb-8">
            The central hub for student entrepreneurs, alumni mentors, and startup resources at UIET MDU. Build your ideas, connect with experts, and scale your impact.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-8">
            <Link
              href="/signup"
              className="btn-pill-primary text-sm px-6 py-3 font-semibold shadow-xs"
            >
              <span>Join the E-Cell</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/events"
              className="btn-pill-secondary text-sm px-6 py-3 font-semibold"
            >
              <span>Explore Events</span>
            </Link>
          </div>

          {/* Tracks / Category Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-warm-muted pt-2">
            <span className="font-bold tracking-wider uppercase text-[11px] text-warm-primary">TRACKS:</span>
            <Link
              href="/startups"
              className="px-3 py-1 rounded-full bg-warm-secondary border border-warm text-warm-primary font-medium hover:border-orange-accent transition-colors"
            >
              Startups & Ventures
            </Link>
            <Link
              href="/mentorship"
              className="px-3 py-1 rounded-full bg-warm-secondary border border-warm text-warm-primary font-medium hover:border-orange-accent transition-colors"
            >
              Mentorship Hub
            </Link>
            <Link
              href="/events"
              className="px-3 py-1 rounded-full bg-warm-secondary border border-warm text-warm-primary font-medium hover:border-orange-accent transition-colors"
            >
              Hackathons & Workshops
            </Link>
            <Link
              href="/about"
              className="px-3 py-1 rounded-full bg-warm-secondary border border-warm text-warm-primary font-medium hover:border-orange-accent transition-colors"
            >
              Activity Passport
            </Link>
          </div>
        </div>

        {/* Right Column: Live Interactive Campus Activity Widget */}
        <div className="lg:col-span-5 w-full">
          <div className="card-warm p-6 sm:p-7 shadow-xs">
            
            {/* Header: Mac window dots + Live status */}
            <div className="flex items-center justify-between border-b border-warm pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4889a]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f6e683]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#79d45e]" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-warm-muted ml-2">
                  CAMPUS-ACTIVITY · LIVE
                </span>
              </div>
              <span className="badge-pill border-orange-accent/40 text-orange-accent text-[11px] font-bold">
                LIVE · 8 INITIATIVES
              </span>
            </div>

            {/* Stepper Pipeline */}
            <div className="mb-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-warm-muted mb-2 font-bold">
                CAMPUS PIPELINE
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-warm-secondary border border-warm rounded-full text-center text-xs font-semibold">
                <div className="py-1.5 px-2 rounded-full bg-[#211B17] dark:bg-[#F5EFE5] text-[#FCFAF6] dark:text-[#120F0D] shadow-2xs">
                  1. Discover
                </div>
                <div className="py-1.5 px-2 rounded-full text-warm-secondary">
                  2. Register
                </div>
                <div className="py-1.5 px-2 rounded-full text-warm-secondary">
                  3. Passport
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="bg-warm-secondary border border-warm rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm font-bold text-warm-primary">
                  UIET E-Cell • Incubation Hub
                </h4>
                <span className="text-xs font-bold text-orange-accent">
                  98% Match
                </span>
              </div>
              <p className="text-xs text-warm-secondary leading-relaxed mb-3">
                Personalized startup mentorship matched to your CSE/ECE branch, technical skills, and entrepreneurship goals.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-warm-surface border border-warm text-[11px] font-medium text-warm-secondary">
                  150+ Members
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-warm-surface border border-warm text-[11px] font-medium text-warm-secondary">
                  Weekly Sessions
                </span>
              </div>
            </div>

            {/* 3-Column Metrics Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-warm text-center">
              <div>
                <div className="text-lg font-extrabold text-warm-primary">8</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-warm-muted">
                  DEPARTMENTS
                </div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-orange-accent">100%</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-warm-muted">
                  FREE ACCESS
                </div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-warm-primary">NAAC</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-warm-muted">
                  ACCREDITED
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. EXPLORE CAMPUS SOCIETIES / INITIATIVES (2x2 Grid)
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-8 pb-16">
        <div className="mb-10 text-left">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-warm-primary">
            Explore Campus Societies & Ecosystem
          </h2>
          <p className="text-sm sm:text-base text-warm-secondary mt-2 max-w-2xl">
            UIET student clubs and entrepreneurial initiatives organized across engineering and creative disciplines. Jump straight in.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Startup Directory */}
          <div className="card-warm p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
                  Startup Directory
                </h3>
                <span className="badge-pill border-orange-accent/40 text-orange-accent text-[11px] font-bold">
                  VENTURES
                </span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-3 font-semibold">
                STUDENT INCUBATOR & CO-FOUNDER NETWORK
              </div>
              <p className="text-sm text-warm-secondary leading-relaxed mb-5">
                Showcase your startup, find co-founders, and explore innovative projects built by UIET students across all branches.
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="badge-pill text-[11px]">Machine Learning</span>
                <span className="badge-pill text-[11px]">SaaS & Web</span>
                <span className="badge-pill text-[11px]">Hardware & IoT</span>
                <span className="badge-pill text-[11px]">Seed Stage</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted">
              <span>15+ Active Startups • 4 Demo Days</span>
              <Link
                href="/startups"
                className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 transition-colors"
              >
                <span>Enter</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Mentorship Hub */}
          <div className="card-warm p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
                  Mentorship Hub
                </h3>
                <span className="badge-pill border-[#79d45e]/40 text-[#2f7a1d] dark:text-[#79d45e] text-[11px] font-bold">
                  ALUMNI
                </span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-3 font-semibold">
                1-ON-1 GUIDANCE & CAREER MASTERCLASSES
              </div>
              <p className="text-sm text-warm-secondary leading-relaxed mb-5">
                Connect with experienced alumni and industry experts for guidance on your entrepreneurial journey and venture scaling.
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="badge-pill text-[11px]">Pitch Reviews</span>
                <span className="badge-pill text-[11px]">Resume Tear-down</span>
                <span className="badge-pill text-[11px]">System Architecture</span>
                <span className="badge-pill text-[11px]">Founder Mentorship</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted">
              <span>20+ Mentors • Verified Sessions</span>
              <Link
                href="/mentorship"
                className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 transition-colors"
              >
                <span>Enter</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: Events & Workshops */}
          <div className="card-warm p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
                  Events & Hackathons
                </h3>
                <span className="badge-pill border-[#70b5ff]/40 text-[#1d6fb3] dark:text-[#70b5ff] text-[11px] font-bold">
                  HACKATHONS
                </span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-3 font-semibold">
                CAMPUS CODE CLASH & SPEAKER SESSIONS
              </div>
              <p className="text-sm text-warm-secondary leading-relaxed mb-5">
                Stay updated on workshops, hackathons, and access our curated library of startup resources and competition sprints.
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="badge-pill text-[11px]">Ideathons</span>
                <span className="badge-pill text-[11px]">Guest Lectures</span>
                <span className="badge-pill text-[11px]">Sprint 2026</span>
                <span className="badge-pill text-[11px]">Hands-on Workshops</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted">
              <span>180+ Attendees • Code Clash 2026</span>
              <Link
                href="/events"
                className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 transition-colors"
              >
                <span>Enter</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 4: Incubation Cell */}
          <div className="card-warm p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-xl font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
                  Incubation Cell
                </h3>
                <span className="badge-pill border-[#ba81ee]/40 text-[#6b3fa8] dark:text-[#ba81ee] text-[11px] font-bold">
                  INCUBATION
                </span>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-warm-muted mb-3 font-semibold">
                PATENT, LEGAL & SEED GRANT SUPPORT
              </div>
              <p className="text-sm text-warm-secondary leading-relaxed mb-5">
                Prototyping facilities, patent guidance, and university incubation support to take your campus project to market.
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="badge-pill text-[11px]">IPR & Patents</span>
                <span className="badge-pill text-[11px]">Legal Guidance</span>
                <span className="badge-pill text-[11px]">Prototyping Lab</span>
                <span className="badge-pill text-[11px]">Seed Assistance</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted">
              <span>UIET MDU • Official Support</span>
              <Link
                href="/about"
                className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 transition-colors"
              >
                <span>Enter</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CAMPUS MOMENTS (Life & Energy at UIET E-Cell)
          ───────────────────────────────────────────────────────────── */}
      <GalleryGrid
        gallery={gallery}
        className="pt-6 pb-14"
        containerClassName="w-full"
      />

      {/* ─────────────────────────────────────────────────────────────
          4. STUDENT LIFECYCLE BANNER SECTION (Warm Card Panel)
          ───────────────────────────────────────────────────────────── */}
      <section className="my-12">
        <div className="bg-warm-secondary border border-warm rounded-3xl p-8 sm:p-12">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-accent mb-3">
                THE STUDENT LIFECYCLE · CO-CURRICULAR OUTPUT
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-warm-primary leading-tight mb-4">
                Never stop at the <span className="text-orange-accent">classroom door.</span>
              </h2>
              <p className="text-sm sm:text-base text-warm-secondary leading-relaxed max-w-xl mb-6">
                Engineering is learned by building. Discover real campus projects, join cross-society teams, collaborate with peers across branches, and build a verified portfolio that proves your capabilities to employers.
              </p>
              <Link
                href="/startups"
                className="btn-pill-primary text-sm px-6 py-3 font-semibold shadow-xs"
              >
                <span>Explore Campus Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-warm-surface border border-warm rounded-2xl p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-warm-primary">Featured Open Recruitment</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-orange-accent font-bold">
                    RECRUITING
                  </span>
                </div>
                <h4 className="text-sm font-bold text-warm-primary mb-1">
                  UIET Campus AI Assistant & Query Bot
                </h4>
                <div className="text-xs text-warm-muted mb-4">
                  By E-Cell Tech Team • 3 Open Positions
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mb-5">
                  <span className="badge-pill text-[10px]">React / Next.js</span>
                  <span className="badge-pill text-[10px]">TypeScript</span>
                  <span className="badge-pill text-[10px]">Tailwind CSS</span>
                  <span className="badge-pill text-[10px]">Supabase</span>
                  <span className="badge-pill text-[10px]">NLP</span>
                </div>
                <Link
                  href="/contact"
                  className="w-full btn-pill-secondary text-xs py-2.5 font-semibold text-center block"
                >
                  Apply for Project Roles
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. DIGITAL PASSPORT / ACCREDITATION SECTION (High Contrast Dark)
          ───────────────────────────────────────────────────────────── */}
      <section className="my-12">
        <div className="bg-[#120F0D] border border-[#39322C] rounded-3xl p-8 sm:p-12 text-[#F5EFE5] shadow-lg">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D1815] border border-[#39322C] text-orange-accent text-[11px] font-mono font-bold uppercase tracking-wider mb-5">
                <span>2026 · ACTIVITY PASSPORT 2026</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
                A verified record for the skills you <span className="text-orange-accent">actually earn.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#C9BFB3] leading-relaxed max-w-xl mb-6">
                Every workshop attended, contest solved, and leadership role undertaken is recorded in your tamper-evident Digital Activity Passport — complete with NAAC & NBA accreditation points.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#120F0D] hover:bg-neutral-100 text-sm font-semibold transition-all shadow-xs"
                >
                  <span>View Your Passport</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/events"
                  className="text-xs font-semibold text-[#C9BFB3] hover:text-white transition-colors"
                >
                  Upcoming Events
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#171310] border border-[#39322C] rounded-2xl p-6">
                <div className="flex items-center justify-between border-b border-[#39322C] pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-orange-accent" />
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-white">
                      DIGITAL PASSPORT ID
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-accent/20 text-orange-accent border border-orange-accent/40">
                    VERIFIED
                  </span>
                </div>
                
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#968C82] mb-1">
                  ACCREDITED LEARNER
                </div>
                <div className="text-base font-bold text-white mb-1">
                  UIET Campus Scholar
                </div>
                <div className="text-xs text-[#968C82] mb-5">
                  Computer Science & Engineering • 6th Semester
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#39322C]">
                  <div className="bg-[#1D1815] border border-[#39322C] rounded-xl p-3">
                    <div className="text-[10px] font-mono uppercase text-[#968C82]">ACCREDITATION</div>
                    <div className="text-sm font-bold text-orange-accent mt-0.5">Gold Tier</div>
                  </div>
                  <div className="bg-[#1D1815] border border-[#39322C] rounded-xl p-3">
                    <div className="text-[10px] font-mono uppercase text-[#968C82]">ACTIVITY CREDITS</div>
                    <div className="text-sm font-bold text-[#79d45e] mt-0.5">10 Pts</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
