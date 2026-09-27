import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Shield, ArrowRight, Megaphone } from 'lucide-react'
import { signout } from '@/app/auth/actions'
import NavLinks from './NavLinks'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  // Fetch top pinned active announcement if any
  const { data: pinnedNotice } = await supabase
    .from('announcements')
    .select('id, title, content, category, link_url, link_text')
    .eq('is_active', true)
    .eq('is_pinned', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <>
      {pinnedNotice && (
        <div className="bg-[#211B17] text-[#F5EFE5] border-b border-[#39322C] text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-accent/20 text-orange-accent border border-orange-accent/40 text-[10px] font-bold uppercase tracking-wider">
              <Megaphone className="w-3 h-3" />
              {pinnedNotice.category || 'NOTICE'}
            </span>
            <span className="font-semibold text-[#F5EFE5]">{pinnedNotice.title}:</span>
            <span className="text-[#C9BFB3] line-clamp-1">{pinnedNotice.content}</span>
            {pinnedNotice.link_url && (
              <Link
                href={pinnedNotice.link_url}
                className="inline-flex items-center gap-1 font-bold text-orange-accent hover:underline ml-1"
              >
                <span>{pinnedNotice.link_text || 'Learn More'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      <nav
        style={{ backgroundColor: 'var(--bg-page)' }}
        className="sticky top-0 z-50 w-full border-b border-warm backdrop-blur-md transition-colors"
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand / Official Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-9 px-2.5 rounded-lg bg-white border border-warm flex items-center justify-center transition-transform group-hover:scale-[1.02] shadow-2xs shrink-0">
              <Image
                src="/logo.png"
                alt="E-Cell | UIET MDU Rohtak"
                width={88}
                height={42}
                className="h-6 w-auto object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-warm-primary leading-tight">
                E-Cell | UIET MDU Rohtak
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-orange-accent">
                Ideas into Impact
              </span>
            </div>
          </Link>

          {/* Central Floating Pill Menu & Mobile Nav */}
          <NavLinks isAdmin={isAdmin} />

          {/* Right CTA Area — Public Visitor vs Authenticated Admin */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-warm-secondary text-warm-primary hover:border-orange-accent border border-warm transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-orange-accent" />
                  <span>Admin Panel</span>
                </Link>
                <form action={signout}>
                  <button
                    type="submit"
                    className="text-xs font-medium text-warm-muted hover:text-warm-primary px-2.5 py-1.5 transition-colors cursor-pointer"
                  >
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/events"
                className="btn-pill-primary text-xs py-2 px-4 font-semibold"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
