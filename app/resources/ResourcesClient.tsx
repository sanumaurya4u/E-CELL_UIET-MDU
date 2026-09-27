'use client'

import { useState } from 'react'
import { ExternalLink, BookOpen, FolderOpen } from 'lucide-react'

interface ResourceItem {
  id: string
  title: string
  description: string
  url: string
  category: string
  created_at?: string
}

export default function ResourcesClient({
  resources,
}: {
  resources: ResourceItem[]
}) {
  const categories = [
    'All',
    ...Array.from(new Set(resources.map((r) => r.category).filter(Boolean))),
  ]
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered =
    selectedCategory === 'All'
      ? resources
      : resources.filter((r) => r.category === selectedCategory)

  return (
    <div>
      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => {
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  active
                    ? 'bg-[#211B17] dark:bg-[#F5EFE5] text-[#FCFAF6] dark:text-[#120F0D] border-[#211B17] dark:border-[#F5EFE5]'
                    : 'bg-warm-secondary text-warm-secondary border-warm hover:text-warm-primary hover:border-warm-strong'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-14 border border-dashed border-warm rounded-2xl text-center bg-warm-surface max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-warm-secondary flex items-center justify-center mx-auto mb-4 text-warm-muted">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-warm-primary mb-1">
            No Resources Found
          </h3>
          <p className="text-sm text-warm-secondary max-w-sm mx-auto">
            Curated startup templates, roadmaps, and guides will appear here once published by the E-Cell team.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <div
              key={res.id}
              className="card-warm p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-warm-secondary border border-warm flex items-center justify-center text-orange-accent">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="badge-pill border-orange-accent/40 text-orange-accent text-[10px] font-bold">
                    {res.category || 'Resource'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-warm-primary group-hover:text-orange-accent transition-colors mb-2 leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-warm-secondary leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-warm flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-warm-muted">
                  FREE ACCESS
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-warm-primary group-hover:text-orange-accent transition-colors"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
