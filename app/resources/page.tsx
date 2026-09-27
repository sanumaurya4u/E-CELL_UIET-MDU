import { createClient } from '@/lib/supabase/server'
import ResourcesClient from './ResourcesClient'

export default async function ResourcesPage() {
  const supabase = await createClient()

  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-5">
          <span className="w-2 h-2 rounded-full bg-orange-accent" />
          <span>E-CELL | UIET MDU ROHTAK • FOUNDER TOOLKIT</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-warm-primary mb-4 leading-tight">
          Startup Resource <span className="text-orange-accent">Library</span>
        </h1>
        <p className="text-base text-warm-secondary leading-relaxed">
          Curated pitch deck templates, government seed grant guides, cloud software credits, and legal playbooks for UIET MDU Rohtak student entrepreneurs.
        </p>
      </div>

      <ResourcesClient resources={resources || []} />
    </div>
  )
}
