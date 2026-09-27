import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react'
import { formatDate, renderMarkdown } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BlogPreviewPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Auth check — only admins can preview
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') {
    redirect('/login?message=Access restricted to authorized E-Cell Administrators.')
  }

  // Fetch blog by ID (any status)
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-warm-primary mb-2">Blog Not Found</h1>
        <p className="text-sm text-warm-secondary">This blog post does not exist or has been deleted.</p>
        <Link href="/admin" className="text-xs font-semibold text-orange-accent hover:underline mt-4 inline-block">
          ← Back to Admin
        </Link>
      </div>
    )
  }

  const articleHtml = renderMarkdown(blog.content || '')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20">
      {/* Preview Warning Banner */}
      <div className="mb-6 p-4 bg-[#FDF0EA] border border-[#E96832]/30 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E96832] shrink-0" />
          <div>
            <div className="text-sm font-bold text-[#211B17]">Admin Preview Mode</div>
            <div className="text-xs text-[#6F665E]">
              Previewing blog post (Status: <strong className="uppercase">{blog.status}</strong>). Only authenticated Admins can view this preview.
            </div>
          </div>
        </div>
        {blog.status === 'published' && (
          <Link
            href={`/blog/${blog.slug}`}
            className="text-xs font-bold text-[#E96832] hover:underline"
          >
            Open Live Public URL →
          </Link>
        )}
      </div>

      {/* Back Link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-secondary hover:text-orange-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Admin Dashboard</span>
      </Link>

      <article className="max-w-3xl mx-auto">
        <div className="mb-4">
          <span className="badge-pill border-orange-accent/40 text-orange-accent text-xs font-bold">
            {blog.category}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-warm-primary leading-tight mb-4">
          {blog.title}
        </h1>

        <p className="text-base sm:text-lg text-warm-secondary leading-relaxed mb-6">
          {blog.excerpt}
        </p>

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
            <span>{formatDate(blog.published_at || blog.created_at)}</span>
          </span>
          {blog.reading_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-accent" />
              <span>{blog.reading_time} min read</span>
            </span>
          )}
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="badge-pill text-[11px]">{tag}</span>
            ))}
          </div>
        )}

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

        <div
          className="prose-warm text-warm-primary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: articleHtml }}
        />

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

        <div className="mt-10 pt-6 border-t border-warm text-center">
          <p className="text-xs text-warm-muted">
            Published by <strong className="text-warm-primary">E-Cell | UIET MDU Rohtak</strong>
          </p>
        </div>
      </article>
    </div>
  )
}

