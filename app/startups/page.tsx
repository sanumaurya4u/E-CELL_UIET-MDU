import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Rocket, ExternalLink, ArrowRight, Sparkles } from 'lucide-react'

export default async function StartupsPage() {
  const supabase = await createClient()

  // Only fetch approved startups for the public directory
  const { data: startups } = await supabase
    .from('startups')
    .select(`
      *,
      founder:founder_id(full_name)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STUDENT VENTURES • DIRECTORY</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-warm-primary mb-4 leading-tight">
          UIET Startup <span className="text-orange-accent">Directory</span>
        </h1>
        <p className="text-base text-warm-secondary leading-relaxed mb-6">
          Discover the innovative ventures and products built by UIET students and alumni founders.
        </p>
        <Link
          href="/dashboard/startups/new"
          className="btn-pill-primary text-sm px-6 py-3 font-semibold shadow-xs"
        >
          <span>Submit Your Startup</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {!startups || startups.length === 0 ? (
        <div className="p-14 border border-dashed border-warm rounded-2xl text-center bg-warm-surface max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-warm-secondary flex items-center justify-center mx-auto mb-4 text-warm-muted">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-warm-primary mb-1">No Startups Listed Yet</h3>
          <p className="text-sm text-warm-secondary max-w-sm mx-auto mb-5">
            Be the first founder to list your venture in the official UIET E-Cell startup directory.
          </p>
          <Link
            href="/dashboard/startups/new"
            className="btn-pill-secondary text-xs px-5 py-2.5 font-semibold inline-flex"
          >
            Register Your Venture
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map(startup => (
            <div key={startup.id} className="card-warm p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-warm-secondary border border-warm flex items-center justify-center overflow-hidden relative shrink-0">
                    {startup.logo_url ? (
                      <Image src={startup.logo_url} alt={startup.name} fill className="object-cover" />
                    ) : (
                      <Rocket className="w-6 h-6 text-orange-accent" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-warm-primary group-hover:text-orange-accent transition-colors line-clamp-1">
                      {startup.name}
                    </h3>
                    <p className="text-xs text-orange-accent font-semibold">
                      {startup.tagline}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-warm-secondary leading-relaxed mb-6 line-clamp-3">
                  {startup.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-warm text-xs text-warm-muted mt-auto">
                <div>
                  Founder: <span className="font-semibold text-warm-primary">{startup.founder?.full_name || 'UIET Student'}</span>
                </div>
                {startup.website_url && (
                  <a
                    href={startup.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-warm-primary hover:text-orange-accent transition-colors"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
