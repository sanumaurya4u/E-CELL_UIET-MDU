import Link from 'next/link'
import { Rocket } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-warm bg-warm-surface text-warm-primary mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#211B17] dark:bg-[#F5EFE5] text-[#FCFAF6] dark:text-[#120F0D] flex items-center justify-center">
                <Rocket className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-base font-extrabold text-warm-primary">UIET E-CELL</h3>
            </div>
            <p className="text-warm-secondary text-sm max-w-sm leading-relaxed mb-4">
              Empowering student entrepreneurs at UIET MDU with incubator resources, alumni mentorship, and launch opportunities to build the future.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-secondary border border-warm text-[11px] font-semibold text-warm-muted">
              <span>UIET MDU ROHTAK • CAMPUS PLATFORM</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-primary mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-warm-secondary">
              <li><Link href="/events" className="hover:text-orange-accent transition-colors">Events & Workshops</Link></li>
              <li><Link href="/startups" className="hover:text-orange-accent transition-colors">Startup Directory</Link></li>
              <li><Link href="/mentorship" className="hover:text-orange-accent transition-colors">Mentorship Hub</Link></li>
              <li><Link href="/about" className="hover:text-orange-accent transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-primary mb-3">Connect</h4>
            <ul className="space-y-2 text-sm text-warm-secondary">
              <li><a href="#" className="hover:text-orange-accent transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-orange-accent transition-colors">Instagram</a></li>
              <li><Link href="/contact" className="hover:text-orange-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-warm mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-warm-muted">
          <p>© {new Date().getFullYear()} UIET E-CELL, MDU Rohtak. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-warm-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-warm-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
