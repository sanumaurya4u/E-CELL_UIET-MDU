'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, ArrowRight } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'Startups', href: '/startups' },
  { name: 'Mentorship', href: '/mentorship' },
  { name: 'Team', href: '/team' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function NavLinks({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Floating Pill Menu */}
      <div className="hidden lg:inline-flex items-center gap-1 bg-[#F3EFE7] dark:bg-[#1D1815] border border-warm rounded-full p-1 shadow-2xs">
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#211B17] dark:bg-[#F5EFE5] text-[#FCFAF6] dark:text-[#120F0D] shadow-2xs'
                  : 'text-warm-secondary hover:text-warm-primary hover:bg-[#FCFAF6]/70 dark:hover:bg-[#171310]/70'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <div className="flex lg:hidden items-center ml-2">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-full border border-warm bg-[#F3EFE7] dark:bg-[#1D1815] text-warm-primary hover:bg-[#EAE4D9] dark:hover:bg-[#28221D] transition-colors"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#FCFAF6] dark:bg-[#171310] border-b border-warm shadow-lg px-4 py-4 lg:hidden flex flex-col gap-2 z-50">
          {navItems.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#211B17] dark:bg-[#F5EFE5] text-[#FCFAF6] dark:text-[#120F0D]'
                    : 'text-warm-secondary hover:text-warm-primary hover:bg-[#F3EFE7] dark:hover:bg-[#1D1815]'
                }`}
              >
                {item.name}
              </Link>
            )
          })}

          <div className="pt-2 border-t border-warm flex items-center gap-2">
            {isAdmin ? (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold bg-[#211B17] text-white rounded-xl"
              >
                <Shield className="w-3.5 h-3.5 text-orange-accent" />
                <span>Open Admin Panel</span>
              </Link>
            ) : (
              <Link
                href="/events"
                onClick={() => setMobileOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold bg-[#211B17] text-white rounded-xl"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
