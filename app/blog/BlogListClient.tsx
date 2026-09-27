'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, ArrowRight, User, Sparkles, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Blog {
  id: string | number
  title: string
  slug: string
  excerpt: string
  content?: string
  cover_image_url: string | null
  category: string
  tags: string[]
  author_name: string
  published_at: string | null
  reading_time: number | null
  is_featured: boolean
}

export default function BlogListClient({ blogs, categories }: { blogs: Blog[]; categories: string[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const allTags = Array.from(
    new Set(blogs.flatMap((b) => b.tags || []).filter(Boolean))
  ).slice(0, 12)

  const filtered = blogs.filter(b => {
    if (activeCategory !== 'All' && b.category !== activeCategory) return false
    if (activeTag && !(b.tags || []).includes(activeTag)) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        (b.content || '').toLowerCase().includes(q) ||
        (b.tags || []).some(t => t.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-3 mb-8 pb-4 border-b border-warm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-warm-secondary border border-warm rounded-full p-1 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-3.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#211B17] text-[#FCFAF6] shadow-2xs'
                    : 'text-warm-secondary hover:text-warm-primary hover:bg-warm-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title, content, tags…"
              className="w-full bg-warm-secondary border border-warm rounded-full pl-9 pr-4 py-2 text-xs text-warm-primary placeholder:text-warm-muted outline-none focus:border-orange-accent"
            />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-warm-muted mr-1">
              Topics:
            </span>
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-accent text-white cursor-pointer"
              >
                Clear ({activeTag}) ×
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                  activeTag === tag
                    ? 'bg-[#211B17] text-[#FCFAF6] border-[#211B17]'
                    : 'bg-warm-surface text-warm-secondary border-warm hover:border-orange-accent'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Blog grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(blog => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="card-warm overflow-hidden flex flex-col group transition-all"
            >
              <div className="aspect-video relative bg-warm-secondary overflow-hidden border-b border-warm">
                {blog.cover_image_url ? (
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-warm-muted">
                    <Sparkles className="w-10 h-10 opacity-40" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="badge-pill bg-warm-surface/90 backdrop-blur-xs text-[11px] font-bold">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-warm-primary group-hover:text-orange-accent transition-colors line-clamp-2 mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-warm-secondary line-clamp-2 leading-relaxed mb-4">
                    {blog.excerpt}
                  </p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      {blog.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="badge-pill text-[10px]">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-warm-muted pt-3 border-t border-warm gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-orange-accent" /> {blog.author_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-accent" /> {formatDate(blog.published_at)}
                    </span>
                    {blog.reading_time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-accent" /> {blog.reading_time} min
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1 shrink-0">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-14 border border-dashed border-warm rounded-2xl text-center bg-warm-surface">
          <div className="w-12 h-12 rounded-full bg-warm-secondary flex items-center justify-center mx-auto mb-4 text-warm-muted">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-warm-primary mb-1">
            {search || activeTag || activeCategory !== 'All' ? 'No matching articles found' : 'No Articles Yet'}
          </h3>
          <p className="text-sm text-warm-secondary max-w-sm mx-auto">
            {search || activeTag || activeCategory !== 'All' ? 'Try a different search term, topic tag, or category.' : 'We are working on exciting content. Check back soon!'}
          </p>
        </div>
      )}
    </>
  )
}

