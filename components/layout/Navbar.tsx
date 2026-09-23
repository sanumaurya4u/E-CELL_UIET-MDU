import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Rocket } from 'lucide-react'
import { signout } from '@/app/auth/actions'
import NavLinks from './NavLinks'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav
      style={{ backgroundColor: 'var(--bg-page)' }}
      className="sticky top-0 z-50 w-full border-b border-warm backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#211B17] dark:bg-[#F5EFE5] text-[#FCFAF6] dark:text-[#120F0D] flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs">
            <Rocket className="w-4 h-4 text-white dark:text-[#120F0D]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-warm-primary leading-tight">
              UIET E-CELL
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-orange-accent">
              UIET MDU ROHTAK
            </span>
          </div>
        </Link>
        
        {/* Central Floating Pill Menu & Mobile Nav */}
        <NavLinks user={user} />

        {/* Auth CTA Area */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full text-warm-primary hover:bg-warm-secondary border border-warm transition-all"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full text-warm-primary hover:bg-warm-secondary border border-warm transition-all"
              >
                Profile
              </Link>
              <form action={signout}>
                <button
                  type="submit"
                  className="text-xs font-medium text-warm-muted hover:text-warm-primary px-2 py-1.5 transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-warm-primary hover:text-orange-accent px-2 py-1.5 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="btn-pill-primary text-xs py-1.5 px-4 font-semibold"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
