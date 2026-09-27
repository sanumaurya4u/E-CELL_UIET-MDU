import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Megaphone,
  Lightbulb,
  Users,
  Calendar,
  Rocket,
  Mail,
  Globe,
  ExternalLink,
} from 'lucide-react'
import GalleryGrid from '@/components/about/GalleryGrid'
import AccordionItem from '@/components/ui/AccordionItem'
import { gallery as staticGallery } from '@/data/gallery'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { ECELL_INFO, FAQ_ITEMS } from '@/lib/constants'

export default async function Home() {
  const supabase = await createClient()

  // Fetch active announcements, site images, and dynamic homepage blocks
  const [{ data: announcements }, { data: siteImages }, { data: siteBlocks }] =
    await Promise.all([
      supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(4),
      supabase
        .from('site_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(9),
      supabase.from('site_blocks').select('*'),
    ])

  const blocksMap = new Map(
    (siteBlocks || []).map((b: { key: string; data: any }) => [b.key, b.data])
  )

  const statsData = blocksMap.get('stats') || {
    members: '150+',
    events: '20+',
    startups: '15+',
    mentors: '20+',
    departments: '8',
  }

  const displayGallery =
    siteImages && siteImages.length > 0
      ? siteImages.map((img: any) => ({
          id: img.id,
          title: img.title,
          category: img.category || 'Events',
          image: img.image_url,
          description: img.description || '',
        }))
      : staticGallery

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION — Official E-Cell | UIET MDU Rohtak Identity
          ───────────────────────────────────────────────────────────── */}
      <section className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center pb-16 lg:pb-24">
        {/* Left Column: Official Identity, Tagline & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Primary Identity Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-warm-secondary border border-warm text-warm-primary text-xs font-semibold tracking-wide mb-5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-orange-accent" />
            <span>{ECELL_INFO.primaryIdentity}</span>
          </div>

          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-orange-accent mb-2">
            {ECELL_INFO.name}
          </div>

          {/* Official Tagline Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-warm-primary leading-[1.04] mb-5">
            Ideas into <span className="text-orange-accent">Impact.</span>
          </h1>

          {/* Official Description & Core Messaging */}
          <p className="text-lg sm:text-xl font-semibold text-warm-primary leading-snug max-w-xl mb-3">
            {ECELL_INFO.description}
          </p>
          <p className="text-sm sm:text-base text-warm-secondary leading-relaxed max-w-xl mb-8">
            E-Cell, UIET MDU is a student-driven entrepreneurship and innovation platform focused on encouraging students to transform ideas into meaningful <strong className="text-warm-primary font-semibold">student-led ventures</strong> through mentorship, workshops, and collaborative learning.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-8">
            <Link
              href="/contact"
              className="btn-pill-primary text-sm px-6 py-3 font-semibold shadow-xs"
            >
              <span>Join E-Cell</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/events"
              className="btn-pill-secondary text-sm px-6 py-3 font-semibold"
            >
              <span>Explore Events</span>
            </Link>
            <Link
              href="/startups"
              className="btn-pill-secondary text-sm px-5 py-3 font-semibold"
            >
              <span>Student Ventures</span>
            </Link>
          </div>

          {/* Core Focus Tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-warm-muted pt-2">
            <span className="font-bold tracking-wider uppercase text-[11px] text-warm-primary mr-1">
              FOCUS:
            </span>
            <Link
              href="/startups"
              className="px-3 py-1 rounded-full bg-warm-secondary border border-warm text-warm-primary font-medium hover:border-orange-accent transition-colors"
            >
              Student-led ventures
            </Link>
            <Link
              href="/events"
              className="px-3 py-1 rounded-full bg-warm-secondary border border-warm text-warm-primary font-medium hover:border-orange-accent transition-colors"
            >
              Startup Workshops &amp; Hackathons
            </Link>
            <Link
              href="/mentorship"
              className="px-3 py-1 rounded-full bg-warm-secondary border border-warm text-warm-primary font-medium hover:border-orange-accent transition-colors"
            >
              Mentorship Hub
            </Link>
            <Link
              href="/resources"
              className="px-3 py-1 rounded-full bg-warm-secondary border border-warm text-warm-primary font-medium hover:border-orange-accent transition-colors"
            >
              Resource Library
            </Link>
          </div>
        </div>

        {/* Right Column: Official E-Cell UIET MDU Institutional Card */}
        <div className="lg:col-span-5 w-full">
          <div className="card-warm p-6 sm:p-7 shadow-xs">
            {/* Official Logo & Handle Header */}
            <div className="flex items-center justify-between gap-4 border-b border-warm pb-5 mb-5">
              <div className="flex items-center gap-3">
                <div className="h-12 px-3 rounded-xl bg-white border border-warm flex items-center justify-center shadow-2xs shrink-0">
                  <Image
                    src="/logo.png"
                    alt={ECELL_INFO.name}
                    width={96}
                    height={46}
                    className="h-8 w-auto object-contain"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-warm-primary leading-tight">
                    {ECELL_INFO.name}
                  </h2>
                  <p className="text-xs text-warm-secondary mt-0.5">
                    {ECELL_INFO.tagline}
                  </p>
                </div>
              </div>
              <a
                href={ECELL_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="badge-pill border-orange-accent/40 text-orange-accent text-[11px] font-bold hover:bg-orange-accent hover:text-white transition-colors shrink-0"
              >
                {ECELL_INFO.instagramHandle} ↗
              </a>
            </div>

            {/* Campus Feature Image */}
            <div className="relative w-full h-52 rounded-xl overflow-hidden border border-warm mb-5 bg-warm-secondary">
              <Image
                src="/gallery/page_12.jpg"
                alt="E-Cell | UIET MDU Rohtak Team and Campus Pitching Event"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-center"
                priority
              />
              <div className="absolute bottom-3 left-3 right-3 bg-[#120F0D]/85 backdrop-blur-xs text-[#F5EFE5] px-3.5 py-2 rounded-lg border border-white/10 flex items-center justify-between text-xs">
                <span className="font-semibold">Eureka Pitching &amp; Campus Initiatives</span>
                <span className="text-orange-accent font-bold">UIET MDU</span>
              </div>
            </div>

            {/* Official Summary Details */}
            <div className="bg-warm-secondary border border-warm rounded-xl p-4 mb-5">
              <div className="text-xs font-bold text-warm-primary mb-1">
                {ECELL_INFO.primaryIdentity}
              </div>
              <p className="text-xs text-warm-secondary leading-relaxed">
                {ECELL_INFO.description} — bringing together students across engineering and university departments to build, pitch, and learn together.
              </p>
            </div>

            {/* Official Contact Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-warm text-xs">
              <a
                href={`mailto:${ECELL_INFO.email}`}
                className="inline-flex items-center gap-1.5 font-semibold text-warm-primary hover:text-orange-accent transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-orange-accent" />
                <span>{ECELL_INFO.email}</span>
              </a>
              <a
                href={ECELL_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-warm-primary hover:text-orange-accent transition-colors"
              >
                <span>Follow {ECELL_INFO.instagramHandle}</span>
                <ExternalLink className="w-3 h-3 text-orange-accent" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          1.5 LIVE NOTICE BOARD & ANNOUNCEMENTS (Admin Managed)
          ───────────────────────────────────────────────────────────── */}
      {announcements && announcements.length > 0 && (
        <section className="pb-16">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-warm-primary">
                  Notice Board &amp; <span className="text-orange-accent">Announcements</span>
                </h2>
                <p className="text-xs text-warm-secondary">
                  Official updates, recruitment drives, and event notices from {ECELL_INFO.name}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {announcements.map((notice: any) => (
              <div
                key={notice.id}
                className="card-warm p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="badge-pill border-orange-accent/40 text-orange-accent text-[10px] font-bold uppercase">
                      {notice.category || 'Notice'}
                    </span>
                    <span className="text-[11px] text-warm-muted font-medium">
                      {formatDate(notice.created_at)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-warm-primary mb-1.5">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-warm-secondary leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                {notice.link_url && (
                  <div className="pt-3 border-t border-warm flex justify-end">
                    <Link
                      href={notice.link_url}
                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-accent hover:underline"
                    >
                      <span>{notice.link_text || 'Open Link'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. CORE INITIATIVES & STUDENT ECOSYSTEM (2x2 Grid)
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-4 pb-16">
        <div className="mb-10 text-left">
          <div className="text-xs font-bold uppercase tracking-widest text-orange-accent mb-2">
            What We Do
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-warm-primary">
            Core Initiatives &amp; Campus Ecosystem
          </h2>
          <p className="text-sm sm:text-base text-warm-secondary mt-2 max-w-2xl">
            Supporting student-led ventures, startup workshops, hackathons, and mentorship across UIET, Maharshi Dayanand University, Rohtak.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Student-Led Ventures */}
          <div className="card-warm p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
                      Student-Led Ventures
                    </h3>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-warm-muted font-semibold">
                      STARTUP DIRECTORY &amp; FOUNDER SUPPORT
                    </div>
                  </div>
                </div>
                <span className="badge-pill border-orange-accent/40 text-orange-accent text-[11px] font-bold">
                  VENTURES
                </span>
              </div>
              <p className="text-sm text-warm-secondary leading-relaxed mb-5">
                Supporting student founders in validating ideas, building prototypes, and launching real-world startups from the UIET, MDU campus.
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="badge-pill text-[11px]">Idea Validation</span>
                <span className="badge-pill text-[11px]">MVP Building</span>
                <span className="badge-pill text-[11px]">Co-Founder Network</span>
                <span className="badge-pill text-[11px]">Campus Showcase</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted">
              <span>{statsData.startups || '15+'} Student Ventures • UIET, MDU, Rohtak</span>
              <Link
                href="/startups"
                className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 transition-colors"
              >
                <span>Explore Directory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Mentorship & Networking */}
          <div className="card-warm p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
                      Mentorship &amp; Networking
                    </h3>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-warm-muted font-semibold">
                      ALUMNI, FACULTY &amp; INDUSTRY GUIDANCE
                    </div>
                  </div>
                </div>
                <span className="badge-pill border-[#79d45e]/40 text-[#2f7a1d] dark:text-[#79d45e] text-[11px] font-bold">
                  MENTORSHIP
                </span>
              </div>
              <p className="text-sm text-warm-secondary leading-relaxed mb-5">
                Connecting students with experienced alumni, faculty advisors, and industry professionals for practical guidance and entrepreneurial learning.
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="badge-pill text-[11px]">Pitch Feedback</span>
                <span className="badge-pill text-[11px]">1-on-1 Sessions</span>
                <span className="badge-pill text-[11px]">Alumni Network</span>
                <span className="badge-pill text-[11px]">Founder Guidance</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted">
              <span>{statsData.mentors || '20+'} Mentors • Direct Mentorship</span>
              <Link
                href="/mentorship"
                className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 transition-colors"
              >
                <span>Connect with Mentors</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: Startup Workshops, Events & Hackathons */}
          <div className="card-warm p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
                      Workshops, Events &amp; Hackathons
                    </h3>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-warm-muted font-semibold">
                      PITCHING COMPETITIONS &amp; IDEATHONS
                    </div>
                  </div>
                </div>
                <span className="badge-pill border-[#70b5ff]/40 text-[#1d6fb3] dark:text-[#70b5ff] text-[11px] font-bold">
                  EVENTS
                </span>
              </div>
              <p className="text-sm text-warm-secondary leading-relaxed mb-5">
                Hands-on startup workshops, speaker sessions, Eureka pitching competitions, and campus hackathons designed to turn student ideas into impact.
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="badge-pill text-[11px]">Eureka Pitching</span>
                <span className="badge-pill text-[11px]">Ideathons</span>
                <span className="badge-pill text-[11px]">Speaker Sessions</span>
                <span className="badge-pill text-[11px]">Skill Workshops</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted">
              <span>{statsData.events || '20+'} Campus Events • Open to All Students</span>
              <Link
                href="/events"
                className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 transition-colors"
              >
                <span>View Events</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 4: Entrepreneurship & Innovation Culture */}
          <div className="card-warm p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-warm-primary group-hover:text-orange-accent transition-colors">
                      Entrepreneurial Learning &amp; Team
                    </h3>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-warm-muted font-semibold">
                      STUDENT LEADERSHIP &amp; COLLABORATION
                    </div>
                  </div>
                </div>
                <span className="badge-pill border-[#ba81ee]/40 text-[#6b3fa8] dark:text-[#ba81ee] text-[11px] font-bold">
                  COMMUNITY
                </span>
              </div>
              <p className="text-sm text-warm-secondary leading-relaxed mb-5">
                Meet the student executive team, founding pioneers, and faculty advisors building a culture of innovation and problem-solving at UIET MDU.
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="badge-pill text-[11px]">Leadership</span>
                <span className="badge-pill text-[11px]">Design &amp; Tech</span>
                <span className="badge-pill text-[11px]">Event Management</span>
                <span className="badge-pill text-[11px]">Outreach &amp; PR</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted">
              <span>{ECELL_INFO.name}</span>
              <Link
                href="/team"
                className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 transition-colors"
              >
                <span>Meet the Team</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. ABOUT E-CELL & CORE MESSAGING SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="my-10">
        <div className="bg-warm-secondary border border-warm rounded-3xl p-8 sm:p-12">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="text-xs font-bold uppercase tracking-widest text-orange-accent mb-3">
                About {ECELL_INFO.name}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-warm-primary leading-tight mb-4">
                Transforming student ideas into <span className="text-orange-accent">meaningful ventures.</span>
              </h2>
              <p className="text-sm sm:text-base text-warm-secondary leading-relaxed max-w-xl mb-6">
                {ECELL_INFO.coreMessaging}
              </p>
              <div className="flex flex-wrap items-center gap-3.5">
                <Link
                  href="/about"
                  className="btn-pill-primary text-sm px-6 py-3 font-semibold shadow-xs"
                >
                  <span>About Our Mission</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/team"
                  className="btn-pill-secondary text-sm px-6 py-3 font-semibold"
                >
                  <span>Our Team &amp; Founders</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-warm-surface border border-warm rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-accent">
                  Core Pillars of {ECELL_INFO.shortName}
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-warm-secondary">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-accent mt-2 shrink-0" />
                    <span><strong className="text-warm-primary">Entrepreneurship &amp; Innovation:</strong> Fostering creative thinking and real-world problem solving across UIET, MDU, Rohtak.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-accent mt-2 shrink-0" />
                    <span><strong className="text-warm-primary">Student-Led Ventures:</strong> Encouraging students to build, validate, and showcase their own startup projects.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-accent mt-2 shrink-0" />
                    <span><strong className="text-warm-primary">Workshops &amp; Hackathons:</strong> Organizing practical sessions, ideathons, and pitching events on campus.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-accent mt-2 shrink-0" />
                    <span><strong className="text-warm-primary">Mentorship &amp; Networking:</strong> Connecting aspiring student founders with alumni, faculty, and peers.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CAMPUS MOMENTS (Life & Energy at E-Cell | UIET MDU Rohtak)
          ───────────────────────────────────────────────────────────── */}
      <GalleryGrid
        gallery={displayGallery}
        className="pt-6 pb-14"
        containerClassName="w-full"
      />

      {/* ─────────────────────────────────────────────────────────────
          5. FREQUENTLY ASKED QUESTIONS
          ───────────────────────────────────────────────────────────── */}
      <section className="py-10">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-orange-accent mb-2">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-warm-primary">
            Everything about <span className="text-orange-accent">{ECELL_INFO.name}</span>
          </h2>
        </div>
        <div className="card-warm px-6 sm:px-8 py-2">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem
              key={idx}
              question={item.question}
              answer={item.answer}
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. OFFICIAL CONNECT & CTA BANNER (High Contrast Dark)
          ───────────────────────────────────────────────────────────── */}
      <section className="mt-12">
        <div className="bg-[#120F0D] border border-[#39322C] rounded-3xl p-8 sm:p-12 text-[#F5EFE5] shadow-lg">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D1815] border border-[#39322C] text-orange-accent text-xs font-bold uppercase tracking-wider mb-5">
                <span>{ECELL_INFO.name} • {ECELL_INFO.tagline}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
                Ready to turn your <span className="text-orange-accent">Ideas into Impact?</span>
              </h2>
              <p className="text-sm sm:text-base text-[#C9BFB3] leading-relaxed max-w-xl mb-6">
                Join the {ECELL_INFO.primaryIdentity}. Participate in upcoming workshops and hackathons, pitch your student-led venture, or apply to join our organizing team.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#120F0D] hover:bg-neutral-100 text-sm font-semibold transition-all shadow-xs"
                >
                  <span>Join / Contact E-Cell</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/events"
                  className="text-xs sm:text-sm font-semibold text-[#C9BFB3] hover:text-white transition-colors"
                >
                  Explore Events &amp; Workshops →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#171310] border border-[#39322C] rounded-2xl p-6">
                <div className="flex items-center gap-3 border-b border-[#39322C] pb-4 mb-4">
                  <div className="h-10 px-2.5 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <Image
                      src="/logo.png"
                      alt={ECELL_INFO.name}
                      width={80}
                      height={38}
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {ECELL_INFO.name}
                    </div>
                    <div className="text-xs text-[#968C82]">
                      {ECELL_INFO.primaryIdentity}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <a
                    href={`mailto:${ECELL_INFO.email}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1D1815] border border-[#39322C] text-[#F5EFE5] hover:border-orange-accent transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-accent" />
                      <span>{ECELL_INFO.email}</span>
                    </span>
                    <span className="text-[11px] text-orange-accent font-semibold">Email ↗</span>
                  </a>

                  <a
                    href={ECELL_INFO.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1D1815] border border-[#39322C] text-[#F5EFE5] hover:border-orange-accent transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-orange-accent" />
                      <span>Instagram ({ECELL_INFO.instagramHandle})</span>
                    </span>
                    <span className="text-[11px] text-orange-accent font-semibold">Follow ↗</span>
                  </a>

                  <a
                    href={ECELL_INFO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1D1815] border border-[#39322C] text-[#F5EFE5] hover:border-orange-accent transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-orange-accent" />
                      <span>ecellmdu.vercel.app</span>
                    </span>
                    <span className="text-[11px] text-orange-accent font-semibold">Website ↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
