import Link from 'next/link'
import Image from 'next/image'
import { Shield, Mail, Globe, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ECELL_INFO } from '@/lib/constants'

export default async function Footer() {
  const supabase = await createClient()
  const { data: siteInfoBlock } = await supabase
    .from('site_blocks')
    .select('data')
    .eq('key', 'site_info')
    .maybeSingle()

  const siteInfo = (siteInfoBlock?.data as Record<string, string>) || {}
  const email =
    siteInfo.email && siteInfo.email !== 'ecelluietfs@gmail.com'
      ? siteInfo.email
      : ECELL_INFO.email
  const instagram =
    siteInfo.instagram && siteInfo.instagram !== 'https://instagram.com'
      ? siteInfo.instagram
      : ECELL_INFO.instagram
  const website = siteInfo.website || ECELL_INFO.website

  return (
    <footer className="border-t border-warm bg-warm-surface text-warm-primary mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Official Identity */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="h-10 px-2.5 rounded-lg bg-white border border-warm flex items-center justify-center shadow-2xs shrink-0">
                <Image
                  src="/logo.png"
                  alt={ECELL_INFO.name}
                  width={96}
                  height={46}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-warm-primary leading-tight">
                  {ECELL_INFO.name}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-orange-accent">
                  {ECELL_INFO.tagline}
                </p>
              </div>
            </Link>

            <p className="text-warm-primary font-semibold text-sm mb-1.5">
              {ECELL_INFO.primaryIdentity}
            </p>
            <p className="text-warm-secondary text-sm max-w-md leading-relaxed mb-4">
              {ECELL_INFO.description} — empowering student-led ventures, startup workshops, hackathons, and mentorship across UIET, Maharshi Dayanand University, Rohtak.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-secondary border border-warm text-[11px] font-semibold text-warm-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-accent" />
              <span>Student-led ventures • UIET, MDU, Rohtak</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-primary mb-3.5">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-warm-secondary">
              <li><Link href="/events" className="hover:text-orange-accent transition-colors">Events &amp; Workshops</Link></li>
              <li><Link href="/startups" className="hover:text-orange-accent transition-colors">Student-Led Ventures</Link></li>
              <li><Link href="/mentorship" className="hover:text-orange-accent transition-colors">Mentorship Hub</Link></li>
              <li><Link href="/team" className="hover:text-orange-accent transition-colors">Our Team</Link></li>
              <li><Link href="/blog" className="hover:text-orange-accent transition-colors">Blog &amp; Articles</Link></li>
              <li><Link href="/resources" className="hover:text-orange-accent transition-colors">Resource Library</Link></li>
              <li><Link href="/about" className="hover:text-orange-accent transition-colors">About E-Cell</Link></li>
              <li><Link href="/contact" className="hover:text-orange-accent transition-colors">Join / Contact Us</Link></li>
            </ul>
          </div>

          {/* Official Connect */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-warm-primary mb-3.5">
              Official Contact &amp; Links
            </h4>
            <ul className="space-y-3 text-sm text-warm-secondary">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 hover:text-orange-accent transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-orange-accent shrink-0" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-orange-accent transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-orange-accent shrink-0" />
                  <span>Instagram {ECELL_INFO.instagramHandle}</span>
                </a>
              </li>
              <li>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-orange-accent transition-colors"
                >
                  <Globe className="w-4 h-4 text-orange-accent shrink-0" />
                  <span>ecellmdu.vercel.app</span>
                </a>
              </li>
            </ul>
            <p className="text-xs text-warm-muted mt-4 leading-relaxed">
              UIET Building, Maharshi Dayanand University (MDU), Rohtak, Haryana — 124001
            </p>
          </div>
        </div>

        <div className="border-t border-warm mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-warm-muted">
          <p>© {new Date().getFullYear()} {ECELL_INFO.name} ({ECELL_INFO.primaryIdentity}). All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-warm-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-warm-primary transition-colors">Terms</Link>
            <span className="text-warm-muted/40">•</span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-warm-muted hover:text-warm-primary transition-colors"
              title="E-Cell Administrator Login"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
