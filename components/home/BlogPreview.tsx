import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Clock, User, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function BlogPreview() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, cover_image_url, category, author_name, published_at, reading_time, is_featured')
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(3)

  if (!blogs || blogs.length === 0) return null

  return (
    <section className="pt-6 pb-14">
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-warm-primary">
            Latest from the <span className="text-orange-accent">Blog</span>
          </h2>
          <p className="text-sm sm:text-base text-warm-secondary mt-2 max-w-lg">
            Ideas, insights, and stories from the E-Cell ecosystem.
          </p>
        </div>
        <Link
          href="/blog"
          className="btn-pill-secondary text-xs py-2 px-5 font-semibold"
        >
          <span>View All Articles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog: any) => (
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
              {blog.is_featured && (
                <div className="absolute top-3 right-3">
                  <span className="badge-pill bg-orange-accent text-white border-orange-accent text-[10px] font-bold">★</span>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-warm-primary group-hover:text-orange-accent transition-colors line-clamp-2 mb-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-warm-secondary line-clamp-2 leading-relaxed mb-3">
                  {blog.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-warm-muted pt-3 border-t border-warm">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {blog.author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(blog.published_at)}
                  </span>
                </div>
                <span className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1">
                  Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
