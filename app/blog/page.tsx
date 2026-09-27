import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Calendar, Clock, ArrowRight, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'
import BlogListClient from './BlogListClient'

export const metadata: Metadata = {
  title: 'Blog | E-Cell | UIET MDU Rohtak',
  description: 'Ideas into Impact — Entrepreneurship, innovation, student-led ventures, and campus updates from E-Cell | UIET MDU Rohtak.',
  openGraph: {
    title: 'Blog | E-Cell | UIET MDU Rohtak',
    description: 'Ideas into Impact — Entrepreneurship, innovation, student-led ventures, and campus updates from E-Cell | UIET MDU Rohtak.',
  },
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const publishedBlogs = blogs || []

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(publishedBlogs.map(b => b.category).filter(Boolean)))]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
      {/* Header */}
      <div className="mb-14 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-orange-accent text-xs font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>IDEAS, INSIGHTS &amp; IMPACT</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-warm-primary mb-4 leading-tight">
          E-Cell <span className="text-orange-accent">Blog</span>
        </h1>
        <p className="text-base text-warm-secondary leading-relaxed">
          E-Cell UIET MDU shares entrepreneurship, innovation, startup, event, student, technology, and ecosystem-related stories from our campus community and beyond.
        </p>
      </div>

      {/* Featured Blogs */}
      {publishedBlogs.filter(b => b.is_featured).length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-warm">
            <h2 className="text-xl font-extrabold text-warm-primary">Featured Articles</h2>
            <span className="badge-pill border-orange-accent/40 text-orange-accent text-xs font-bold">★ Featured</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {publishedBlogs.filter(b => b.is_featured).slice(0, 2).map(blog => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="card-warm overflow-hidden flex flex-col group transition-all"
              >
                <div className="aspect-[2/1] relative bg-warm-secondary overflow-hidden border-b border-warm">
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
                  <div className="absolute top-3 right-3">
                    <span className="badge-pill bg-orange-accent text-white border-orange-accent text-[10px] font-bold">FEATURED</span>
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
                  </div>
                  <div className="flex items-center justify-between text-xs text-warm-muted pt-3 border-t border-warm">
                    <div className="flex items-center gap-4">
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
                    <span className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1">
                      <span>Read Article</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Blogs with client-side filtering */}
      <BlogListClient blogs={publishedBlogs} categories={categories} />
    </div>
  )
}
