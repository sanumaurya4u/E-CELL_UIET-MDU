import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import { formatDate, renderMarkdown } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: blog } = await supabase
    .from('blogs')
    .select('title, excerpt, cover_image_url, seo_title, seo_description')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!blog) return { title: 'Blog | E-Cell | UIET MDU Rohtak' }

  return {
    title: blog.seo_title || `${blog.title} | E-Cell | UIET MDU Rohtak`,
    description: blog.seo_description || blog.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt,
      url: `/blog/${slug}`,
      images: blog.cover_image_url ? [{ url: blog.cover_image_url }] : undefined,
      type: 'article',
    },
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!blog) notFound()

  // Fetch related blogs (same category first, then recent published blogs as fallback)
  const { data: sameCategoryBlogs } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, cover_image_url, category, author_name, published_at, reading_time')
    .eq('status', 'published')
    .eq('category', blog.category)
    .neq('id', blog.id)
    .order('published_at', { ascending: false })
    .limit(3)

  let relatedBlogs = sameCategoryBlogs || []
  if (relatedBlogs.length < 3) {
    const excludeIds = [blog.id, ...relatedBlogs.map((b: any) => b.id)]
    const { data: recentOther } = await supabase
      .from('blogs')
      .select('id, title, slug, excerpt, cover_image_url, category, author_name, published_at, reading_time')
      .eq('status', 'published')
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .order('published_at', { ascending: false })
      .limit(3 - relatedBlogs.length)
    if (recentOther) {
      relatedBlogs = [...relatedBlogs, ...recentOther]
    }
  }

  const articleHtml = renderMarkdown(blog.content || '')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-secondary hover:text-orange-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Blog</span>
      </Link>

      <article className="max-w-3xl mx-auto">
        {/* Category badge */}
        <div className="mb-4">
          <span className="badge-pill border-orange-accent/40 text-orange-accent text-xs font-bold">
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-warm-primary leading-tight mb-4">
          {blog.title}
        </h1>

        {/* Excerpt */}
        <p className="text-base sm:text-lg text-warm-secondary leading-relaxed mb-6">
          {blog.excerpt}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 flex-wrap text-xs text-warm-muted pb-6 border-b border-warm mb-8">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-orange-accent" />
            <span className="font-medium text-warm-secondary">{blog.author_name}</span>
            {blog.author_designation && (
              <span className="text-warm-muted">· {blog.author_designation}</span>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-accent" />
            <span>{formatDate(blog.published_at)}</span>
          </span>
          {blog.reading_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-accent" />
              <span>{blog.reading_time} min read</span>
            </span>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="badge-pill text-[11px]">{tag}</span>
            ))}
          </div>
        )}

        {/* Cover image */}
        {blog.cover_image_url && (
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden border border-warm mb-10">
            <Image
              src={blog.cover_image_url}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article content */}
        <div
          className="prose-warm text-warm-primary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />

        {/* Additional Images Gallery */}
        {blog.additional_images && blog.additional_images.length > 0 && (
          <div className="mt-10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-warm-muted">
              Article Visuals &amp; Gallery
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {blog.additional_images.map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-2xl overflow-hidden border border-warm bg-warm-secondary"
                >
                  <Image
                    src={imgUrl}
                    alt={`${blog.title} - Visual ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source attribution */}
        {blog.source_url && (
          <div className="mt-10 p-5 bg-warm-secondary border border-warm rounded-2xl space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-warm-muted">
              Source &amp; Reference Attribution
            </div>
            {blog.source_name && (
              <div className="text-sm text-warm-secondary">
                <span className="font-semibold text-warm-primary">Source:</span> {blog.source_name}
              </div>
            )}
            <div className="text-xs text-warm-secondary">
              <span className="font-semibold text-warm-primary">Original Article:</span> {blog.title}
            </div>
            <div className="pt-1">
              <a
                href={blog.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-accent hover:underline"
              >
                <span>Read original article →</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-warm text-center">
          <p className="text-xs text-warm-muted">
            Published by <strong className="text-warm-primary">E-Cell | UIET MDU Rohtak</strong>
          </p>
        </div>
      </article>

      {/* Related Blogs */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="mt-16 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-warm">
            <h2 className="text-xl font-extrabold text-warm-primary">Related Articles</h2>
            <Link href="/blog" className="text-xs font-semibold text-warm-secondary hover:text-orange-accent flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedBlogs.map((related: any) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="card-warm overflow-hidden flex flex-col group transition-all"
              >
                <div className="aspect-video relative bg-warm-secondary overflow-hidden border-b border-warm">
                  {related.cover_image_url ? (
                    <Image
                      src={related.cover_image_url}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-warm-muted">
                      <Sparkles className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-warm-primary group-hover:text-orange-accent transition-colors line-clamp-2 mb-2">
                    {related.title}
                  </h3>
                  <p className="text-[11px] text-warm-secondary line-clamp-2 leading-relaxed mb-3">{related.excerpt}</p>
                  <div className="flex items-center justify-between text-[11px] text-warm-muted">
                    <span>{formatDate(related.published_at)}</span>
                    <span className="font-semibold text-warm-primary group-hover:text-orange-accent flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
