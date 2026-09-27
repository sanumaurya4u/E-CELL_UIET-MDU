'use client';

import React, { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastProvider';
import { formatDate, generateSlug, estimateReadingTime, renderMarkdown } from '@/lib/utils';
import {
  saveBlogAction,
  deleteBlogAction,
  toggleBlogStatusAction,
  toggleBlogFeaturedAction,
  uploadBlogImageAction,
} from '@/app/admin/actions';
import {
  PageHeader,
  Modal,
  StatusBadge,
  EmptyState,
  FilterPills,
  adminInput,
  adminLabel,
  adminCard,
  adminTd,
  adminTh,
} from './ui';
import type { BlogPost, BlogFormData } from '@/lib/types';
import type { Dispatch, SetStateAction } from 'react';

const CATEGORIES = [
  'Entrepreneurship',
  'Startup',
  'Innovation',
  'Technology',
  'E-Cell News',
  'Events',
  'Student Stories',
  'Success Stories',
  'Opportunities',
  'Funding',
  'Leadership',
  'Campus',
  'Industry',
  'General',
];

const BLANK: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: null,
  additional_images: [],
  category: 'Entrepreneurship',
  tags: [],
  author_name: 'E-Cell UIET MDU',
  author_designation: null,
  source_url: null,
  source_name: null,
  published_at: null,
  status: 'draft',
  is_featured: false,
  reading_time: null,
  seo_title: null,
  seo_description: null,
};

const STATUS_FILTERS = ['All', 'Published', 'Draft', 'Archived'];

export default function BlogManager({
  blogs: initialBlogs,
  setBlogs: externalSetBlogs,
}: {
  blogs: BlogPost[];
  setBlogs?: Dispatch<SetStateAction<BlogPost[]>>;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [blogs, setLocalBlogs] = useState<BlogPost[]>(initialBlogs);

  // Sync when server props update
  React.useEffect(() => {
    setLocalBlogs(initialBlogs);
  }, [initialBlogs]);

  const updateBlogsState = (updater: (prev: BlogPost[]) => BlogPost[]) => {
    setLocalBlogs((prev) => {
      const next = updater(prev);
      if (externalSetBlogs) externalSetBlogs(next);
      return next;
    });
  };

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const notify = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    showToast(text, type);
    setFeedback({ type: type === 'error' ? 'error' : 'success', text });
    setTimeout(() => {
      setFeedback((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogFormData>(BLANK);
  const [activeFilter, setActiveFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editorPreview, setEditorPreview] = useState(false);
  const [inlineAlt, setInlineAlt] = useState('');
  const [inlineCaption, setInlineCaption] = useState('');
  const [showInlineImgHelper, setShowInlineImgHelper] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(BLANK);
    setTagInput('');
    setCustomCategory('');
    setShowAdvanced(false);
    setEditorPreview(false);
    setModalOpen(true);
  };

  const openEdit = (blog: BlogPost) => {
    setEditing(blog);
    const isCustomCat = blog.category && !CATEGORIES.includes(blog.category);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      cover_image_url: blog.cover_image_url,
      additional_images: blog.additional_images || [],
      category: blog.category || 'General',
      tags: blog.tags || [],
      author_name: blog.author_name || 'E-Cell UIET MDU',
      author_designation: blog.author_designation,
      source_url: blog.source_url,
      source_name: blog.source_name,
      published_at: blog.published_at,
      status: blog.status,
      is_featured: blog.is_featured,
      reading_time: blog.reading_time,
      seo_title: blog.seo_title,
      seo_description: blog.seo_description,
    });
    setTagInput((blog.tags || []).join(', '));
    setCustomCategory(isCustomCat ? blog.category : '');
    setShowAdvanced(false);
    setEditorPreview(false);
    setModalOpen(true);
  };

  // Upload cover image via Server Action
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append('image_file', file);
      const res = await uploadBlogImageAction(fd);
      if (res.error || !res.url) {
        notify(res.error || 'Failed to upload cover image', 'error');
      } else {
        setForm((prev) => ({ ...prev, cover_image_url: res.url! }));
        notify('Cover image uploaded to blog-images!', 'success');
      }
    } catch {
      notify('Failed to upload cover image', 'error');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // Upload inline image & insert Markdown into article
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInline(true);
    try {
      const fd = new FormData();
      fd.append('image_file', file);
      const res = await uploadBlogImageAction(fd);
      if (res.error || !res.url) {
        notify(res.error || 'Failed to upload inline image', 'error');
      } else {
        const altPart = inlineAlt.trim() || file.name.replace(/\.[^.]+$/, '');
        const label = inlineCaption.trim() ? `${altPart} | ${inlineCaption.trim()}` : altPart;
        const mdSnippet = `\n![${label}](${res.url})\n`;
        setForm((prev) => ({ ...prev, content: `${prev.content}${mdSnippet}` }));
        setInlineAlt('');
        setInlineCaption('');
        setShowInlineImgHelper(false);
        notify('Inline image uploaded and inserted into content!', 'success');
      }
    } catch {
      notify('Failed to upload inline image', 'error');
    } finally {
      setUploadingInline(false);
      if (inlineInputRef.current) inlineInputRef.current.value = '';
    }
  };

  // Upload additional gallery image
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGallery(true);
    try {
      const fd = new FormData();
      fd.append('image_file', file);
      const res = await uploadBlogImageAction(fd);
      if (res.error || !res.url) {
        notify(res.error || 'Failed to upload gallery image', 'error');
      } else {
        setForm((prev) => ({
          ...prev,
          additional_images: [...(prev.additional_images || []), res.url!],
        }));
        notify('Additional visual added!', 'success');
      }
    } catch {
      notify('Failed to upload gallery image', 'error');
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Import from external URL
  const handleImport = async () => {
    if (!importUrl.trim()) return;
    setImporting(true);
    try {
      const res = await fetch('/api/blog/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        notify(data.error || 'Failed to extract article', 'error');
        return;
      }
      const article = data.data;
      setEditing(null);
      setForm({
        ...BLANK,
        title: article.title || '',
        slug: article.title ? generateSlug(article.title) : '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        cover_image_url: article.image_url || null,
        author_name: article.author || 'E-Cell Editorial Desk',
        source_url: article.source_url || importUrl.trim(),
        source_name: article.source_name || '',
        published_at: article.published_at || null,
        status: 'draft', // Always draft first so Admin reviews before publishing
        category: 'Industry',
      });
      setTagInput('Industry Insights, External Reference');
      notify('Article imported into editor as a Draft — review and edit before publishing.', 'success');
      setShowImportModal(false);
      setImportUrl('');
      setModalOpen(true);
    } catch {
      notify('Failed to import article from URL', 'error');
    } finally {
      setImporting(false);
    }
  };

  // Markdown formatting toolbar
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) {
      setForm((prev) => ({ ...prev, content: `${prev.content}${before}${after}` }));
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.content;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    setForm({ ...form, content: newText });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const handleSave = (e: React.FormEvent, publishNow?: boolean) => {
    e.preventDefault();
    const finalCategory = (customCategory.trim() || form.category || 'General').trim();
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !finalCategory) {
      notify('Please fill in required fields (Title, Category, Excerpt, Content).', 'error');
      return;
    }
    if (!form.cover_image_url) {
      notify('Please upload or provide a Cover Image URL for the article.', 'error');
      return;
    }

    const finalTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const finalStatus: 'draft' | 'published' | 'archived' =
      publishNow === true ? 'published' : publishNow === false ? 'draft' : form.status;

    startTransition(async () => {
      const res = await saveBlogAction({
        id: editing?.id || null,
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        cover_image_url: form.cover_image_url,
        additional_images: form.additional_images || [],
        category: finalCategory,
        tags: finalTags,
        author_name: form.author_name || 'E-Cell UIET MDU',
        author_designation: form.author_designation,
        source_url: form.source_url,
        source_name: form.source_name,
        published_at: form.published_at,
        status: finalStatus,
        is_featured: form.is_featured,
        reading_time: form.reading_time || estimateReadingTime(form.content),
        seo_title: form.seo_title || form.title,
        seo_description: form.seo_description || form.excerpt,
      });

      if (res.error) {
        notify(res.error, 'error');
        return;
      }

      if (res.blog) {
        if (editing) {
          updateBlogsState((prev) => prev.map((b) => (b.id === editing.id ? res.blog : b)));
        } else {
          updateBlogsState((prev) => [res.blog, ...prev]);
        }
      }

      notify(
        finalStatus === 'published'
          ? 'Blog article published live!'
          : 'Blog saved as draft!',
        'success'
      );
      setModalOpen(false);
      router.refresh();
    });
  };

  const toggleStatus = (blog: BlogPost) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    startTransition(async () => {
      const res = await toggleBlogStatusAction(blog.id, newStatus, blog.published_at);
      if (res.error) {
        notify(res.error, 'error');
        return;
      }
      if (res.blog) {
        updateBlogsState((prev) => prev.map((b) => (b.id === blog.id ? res.blog : b)));
      }
      notify(
        newStatus === 'published' ? 'Blog published live!' : 'Blog moved to drafts.',
        'info'
      );
      router.refresh();
    });
  };

  const toggleFeatured = (blog: BlogPost) => {
    startTransition(async () => {
      const res = await toggleBlogFeaturedAction(blog.id, !blog.is_featured);
      if (res.error) {
        notify(res.error, 'error');
        return;
      }
      if (res.blog) {
        updateBlogsState((prev) => prev.map((b) => (b.id === blog.id ? res.blog : b)));
      }
      notify(
        blog.is_featured ? 'Removed from featured blogs.' : 'Marked as featured blog!',
        'info'
      );
      router.refresh();
    });
  };

  const handleDelete = (id: string | number) => {
    if (!confirm('Are you sure you want to permanently delete this blog article?')) return;
    startTransition(async () => {
      const res = await deleteBlogAction(id);
      if (res.error) {
        notify(res.error, 'error');
        return;
      }
      updateBlogsState((prev) => prev.filter((b) => b.id !== id));
      notify('Blog article deleted.', 'info');
      router.refresh();
    });
  };

  const usedCategories = ['All', ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))];

  // Filter + search
  const filtered = blogs.filter((b) => {
    if (activeFilter !== 'All' && b.status !== activeFilter.toLowerCase()) return false;
    if (categoryFilter !== 'All' && b.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.author_name || '').toLowerCase().includes(q) ||
        (b.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Blog & Articles Management"
        subtitle="Create, import, preview, and publish campus stories, event recaps, and entrepreneurship insights."
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={() => setShowImportModal(true)} variant="secondary" size="sm">
              Import from URL
            </Button>
            <Button onClick={openCreate} variant="primary" size="sm" arrow>
              Create Blog
            </Button>
          </div>
        }
      />

      {feedback && (
        <div
          className={`mb-4 p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
              : 'bg-[#3E8F5A]/10 border-[#3E8F5A]/30 text-[#2f7a1d] dark:text-[#79d45e]'
          }`}
        >
          <span>{feedback.text}</span>
          <button type="button" onClick={() => setFeedback(null)} className="text-xs underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Import URL Modal */}
      <Modal open={showImportModal} onClose={() => setShowImportModal(false)} title="Import Article from External URL">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-warm-secondary leading-relaxed">
            Paste a public article URL to extract its title, summary, cover image, author, and key highlights.
            The extracted content will open in the editor as a <strong>Draft</strong> for your review and rewriting.
          </p>
          <div>
            <label className={adminLabel}>External Article URL *</label>
            <input
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="https://techcrunch.com/... or https://yourstory.com/..."
              className={adminInput}
            />
          </div>
          <div className="bg-warm-secondary border border-warm rounded-xl p-3.5 text-[11px] text-warm-muted leading-relaxed space-y-1">
            <div className="font-bold text-warm-primary">Copyright &amp; Attribution Safety:</div>
            <p>
              • Imported articles are never auto-published.<br />
              • Always review, summarize/rewrite in your own voice, and verify source attribution before publishing.<br />
              • The original source name and URL are preserved automatically.
            </p>
          </div>
          <Button
            onClick={handleImport}
            variant="primary"
            size="md"
            className="justify-center"
            disabled={importing || !importUrl.trim()}
          >
            {importing ? 'Extracting Metadata & Content…' : 'Extract into Blog Editor'}
          </Button>
        </div>
      </Modal>

      {/* Create / Edit Blog Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Blog Article' : 'Create Blog Article'}
        wide
      >
        <form onSubmit={(e) => handleSave(e)} className="flex flex-col gap-4 max-h-[76vh] overflow-y-auto pr-1">
          {/* Top Editor / Live Preview Toggle */}
          <div className="flex items-center justify-between bg-warm-secondary border border-warm rounded-xl p-2">
            <span className="text-xs font-bold text-warm-primary px-2">
              {editorPreview ? 'Article Preview' : 'Article Editor'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setEditorPreview(false)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  !editorPreview ? 'bg-[#211B17] text-[#FCFAF6]' : 'text-warm-secondary hover:text-warm-primary'
                }`}
              >
                Write / Edit
              </button>
              <button
                type="button"
                onClick={() => setEditorPreview(true)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  editorPreview ? 'bg-[#211B17] text-[#FCFAF6]' : 'text-warm-secondary hover:text-warm-primary'
                }`}
              >
                Preview Layout
              </button>
            </div>
          </div>

          {editorPreview ? (
            <div className="p-5 bg-warm-bg border border-warm rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="badge-pill border-orange-accent/40 text-orange-accent text-[11px] font-bold">
                  {customCategory.trim() || form.category}
                </span>
                <span className="text-xs text-warm-muted">
                  • {form.reading_time || estimateReadingTime(form.content)} min read
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-warm-primary leading-tight">
                {form.title || 'Untitled Blog Article'}
              </h2>
              <p className="text-sm text-warm-secondary leading-relaxed">
                {form.excerpt || 'No short description provided yet.'}
              </p>
              <div className="text-xs text-warm-muted pb-3 border-b border-warm">
                By <strong>{form.author_name || 'E-Cell UIET MDU'}</strong>
                {form.author_designation ? ` · ${form.author_designation}` : ''}
              </div>
              {form.cover_image_url && (
                <div className="relative aspect-[2/1] rounded-xl overflow-hidden border border-warm">
                  <Image src={form.cover_image_url} alt={form.title || 'Cover'} fill className="object-cover" />
                </div>
              )}
              <div
                className="prose-warm text-warm-primary text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content) }}
              />
              {form.source_url && (
                <div className="p-3.5 bg-warm-secondary border border-warm rounded-xl text-xs">
                  <div className="font-bold text-warm-primary">
                    Source: {form.source_name || form.source_url}
                  </div>
                  <div className="text-orange-accent truncate">{form.source_url}</div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Title */}
              <div>
                <label className={adminLabel}>Blog Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm({
                      ...form,
                      title,
                      slug: editing ? form.slug : generateSlug(title),
                    });
                  }}
                  placeholder="e.g. How Students Can Build Their First Startup"
                  className={adminInput}
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className={adminLabel}>SEO-Friendly URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                  placeholder="how-students-can-build-their-first-startup"
                  className={`${adminInput} text-xs font-mono`}
                />
                <div className="text-[11px] text-warm-muted mt-1">
                  Public URL: <span className="font-mono">/blog/{form.slug || 'your-article-slug'}</span>
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={adminLabel}>Category *</label>
                  <select
                    value={
                      customCategory
                        ? '__custom__'
                        : CATEGORIES.includes(form.category)
                        ? form.category
                        : '__custom__'
                    }
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setCustomCategory(form.category || 'Custom');
                      } else {
                        setForm({ ...form, category: e.target.value });
                        setCustomCategory('');
                      }
                    }}
                    className={adminInput}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__custom__">+ Create Custom Category…</option>
                  </select>
                  {(customCategory || !CATEGORIES.includes(form.category)) && (
                    <input
                      type="text"
                      value={customCategory || form.category}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                        setForm({ ...form, category: e.target.value });
                      }}
                      placeholder="Enter custom category name"
                      className={`${adminInput} mt-2`}
                    />
                  )}
                </div>
                <div>
                  <label className={adminLabel}>Publication Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as BlogFormData['status'] })
                    }
                    className={adminInput}
                  >
                    <option value="draft">Draft (Unpublished)</option>
                    <option value="published">Published (Public)</option>
                    <option value="archived">Archived (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className={adminLabel}>Short Description / Excerpt *</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="A crisp 1–2 sentence summary shown on blog cards and social previews…"
                  rows={2}
                  className={`${adminInput} resize-none`}
                  required
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className={adminLabel}>Cover Image * (Upload to blog-images or Paste URL)</label>
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="text-xs font-semibold px-4 py-2 rounded-full bg-warm-secondary border border-warm text-warm-primary hover:border-orange-accent transition-colors cursor-pointer"
                    disabled={uploadingCover}
                  >
                    {uploadingCover
                      ? 'Uploading…'
                      : form.cover_image_url
                      ? 'Replace Cover Image'
                      : 'Upload Cover Image'}
                  </button>
                  {form.cover_image_url && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-warm relative">
                        <Image src={form.cover_image_url} alt="Cover preview" fill className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, cover_image_url: null })}
                        className="text-xs text-[#c74a62] font-semibold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <input
                  type="url"
                  value={form.cover_image_url || ''}
                  onChange={(e) => setForm({ ...form, cover_image_url: e.target.value || null })}
                  placeholder="Or paste cover image URL (https://...)"
                  className={`${adminInput} mt-2`}
                />
              </div>

              {/* Main Content Editor with Formatting & Inline Image Toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-warm-primary">
                    Main Article Content *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInlineImgHelper(!showInlineImgHelper)}
                    className="text-[11px] font-bold text-orange-accent hover:underline cursor-pointer"
                  >
                    + Insert Inline Image with Caption
                  </button>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 mb-2 flex-wrap bg-warm-secondary border border-warm rounded-xl p-1.5">
                  {[
                    { label: 'H1', title: 'Heading 1', action: () => insertMarkdown('\n# ') },
                    { label: 'H2', title: 'Heading 2', action: () => insertMarkdown('\n## ') },
                    { label: 'H3', title: 'Heading 3', action: () => insertMarkdown('\n### ') },
                    { label: 'B', title: 'Bold', action: () => insertMarkdown('**', '**') },
                    { label: 'I', title: 'Italic', action: () => insertMarkdown('*', '*') },
                    { label: '• List', title: 'Bullet List', action: () => insertMarkdown('\n- ') },
                    { label: '1. List', title: 'Numbered List', action: () => insertMarkdown('\n1. ') },
                    { label: '❝ Quote', title: 'Blockquote', action: () => insertMarkdown('\n> ') },
                    { label: '🔗 Link', title: 'Insert Link', action: () => insertMarkdown('[Link text](', 'https://)') },
                    { label: '— Rule', title: 'Horizontal Separator', action: () => insertMarkdown('\n\n---\n\n') },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={btn.action}
                      className="px-2.5 py-1 rounded-lg bg-warm-surface border border-warm text-warm-primary text-[11px] font-bold hover:border-orange-accent transition-colors cursor-pointer"
                      title={btn.title}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Inline Image Upload Helper */}
                {showInlineImgHelper && (
                  <div className="mb-3 p-3.5 bg-warm-secondary border border-warm rounded-xl space-y-2.5">
                    <div className="text-xs font-bold text-warm-primary">
                      Insert Inline Article Image (with Alt Text &amp; Caption)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={inlineAlt}
                        onChange={(e) => setInlineAlt(e.target.value)}
                        placeholder="Image Alt Text (for accessibility)"
                        className={adminInput}
                      />
                      <input
                        type="text"
                        value={inlineCaption}
                        onChange={(e) => setInlineCaption(e.target.value)}
                        placeholder="Optional Caption below image"
                        className={adminInput}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        ref={inlineInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInlineImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => inlineInputRef.current?.click()}
                        disabled={uploadingInline}
                        className="btn-pill-primary text-xs py-1.5 px-4 font-semibold cursor-pointer"
                      >
                        {uploadingInline ? 'Uploading & Inserting…' : 'Upload & Insert Image'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowInlineImgHelper(false)}
                        className="text-xs text-warm-muted hover:text-warm-primary px-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <textarea
                  ref={contentRef}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder={`Write your article content...\n\n## Section Heading\n\nWrite clean paragraphs with **bold** and *italic* formatting.\n\n- Key takeaway one\n- Key takeaway two\n\n> Inspiring founder quote or highlight`}
                  rows={11}
                  className={`${adminInput} resize-y font-mono text-xs leading-relaxed`}
                  required
                />
                <div className="text-[11px] text-warm-muted mt-1 flex items-center justify-between">
                  <span>
                    Estimated reading time: {estimateReadingTime(form.content)} min ·{' '}
                    {form.content.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <span>Supports Markdown &amp; Inline Images</span>
                </div>
              </div>

              {/* Additional Images Gallery */}
              <div>
                <label className={adminLabel}>Additional Article Images (Optional Gallery)</label>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadingGallery}
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-warm-secondary border border-warm text-warm-primary hover:border-orange-accent transition-colors cursor-pointer"
                  >
                    {uploadingGallery ? 'Uploading…' : '+ Upload Additional Image'}
                  </button>
                </div>
                {form.additional_images && form.additional_images.length > 0 && (
                  <div className="flex items-center gap-3 flex-wrap">
                    {form.additional_images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group w-20 h-14 rounded-lg overflow-hidden border border-warm">
                        <Image src={imgUrl} alt={`Visual ${idx + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              additional_images: (form.additional_images || []).filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className={adminLabel}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. Startup, Workshop, Ideathon, Student Founders"
                  className={adminInput}
                />
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={adminLabel}>Author Name</label>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                    placeholder="E-Cell UIET MDU"
                    className={adminInput}
                  />
                </div>
                <div>
                  <label className={adminLabel}>Author Designation</label>
                  <input
                    type="text"
                    value={form.author_designation || ''}
                    onChange={(e) => setForm({ ...form, author_designation: e.target.value || null })}
                    placeholder="e.g. E-Cell Editorial Team / Student Coordinator"
                    className={adminInput}
                  />
                </div>
              </div>

              {/* External Source Attribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={adminLabel}>Source Name (if external reference)</label>
                  <input
                    type="text"
                    value={form.source_name || ''}
                    onChange={(e) => setForm({ ...form, source_name: e.target.value || null })}
                    placeholder="e.g. TechCrunch / Y Combinator"
                    className={adminInput}
                  />
                </div>
                <div>
                  <label className={adminLabel}>Original Source URL</label>
                  <input
                    type="url"
                    value={form.source_url || ''}
                    onChange={(e) => setForm({ ...form, source_url: e.target.value || null })}
                    placeholder="https://example.com/original-article"
                    className={adminInput}
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    form.is_featured ? 'bg-orange-accent' : 'bg-warm-secondary border border-warm'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      form.is_featured ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold text-warm-primary">
                  Mark as Featured Blog (highlighted on /blog and Homepage)
                </span>
              </div>

              {/* Advanced Options (Publication Date, Reading Time, SEO) */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-orange-accent hover:underline text-left cursor-pointer"
              >
                {showAdvanced
                  ? '▾ Hide SEO & Publication Metadata'
                  : '▸ Configure Publication Date, Reading Time & SEO Metadata'}
              </button>

              {showAdvanced && (
                <div className="flex flex-col gap-4 pl-3 border-l-2 border-orange-accent/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={adminLabel}>Publication Date</label>
                      <input
                        type="datetime-local"
                        value={form.published_at ? form.published_at.slice(0, 16) : ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                          })
                        }
                        className={adminInput}
                      />
                    </div>
                    <div>
                      <label className={adminLabel}>Reading Time (Minutes)</label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={form.reading_time || estimateReadingTime(form.content)}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            reading_time: e.target.value ? parseInt(e.target.value, 10) : null,
                          })
                        }
                        className={adminInput}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={adminLabel}>SEO Meta Title</label>
                    <input
                      type="text"
                      value={form.seo_title || ''}
                      onChange={(e) => setForm({ ...form, seo_title: e.target.value || null })}
                      placeholder="Custom SEO title (defaults to Blog Title)"
                      className={adminInput}
                    />
                  </div>
                  <div>
                    <label className={adminLabel}>SEO Meta Description</label>
                    <textarea
                      value={form.seo_description || ''}
                      onChange={(e) => setForm({ ...form, seo_description: e.target.value || null })}
                      placeholder="Custom meta description for search engines (defaults to Excerpt)"
                      rows={2}
                      className={`${adminInput} resize-none`}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-warm flex-wrap">
            <Button
              type="button"
              variant="secondary"
              size="md"
              disabled={isPending}
              className="flex-1 justify-center"
              onClick={(e) => handleSave(e, false)}
            >
              {isPending ? 'Saving…' : 'Save as Draft'}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              arrow
              disabled={isPending}
              className="flex-1 justify-center"
              onClick={(e) => handleSave(e, true)}
            >
              {isPending
                ? 'Publishing…'
                : editing && form.status === 'published'
                ? 'Update Published Blog'
                : 'Publish Blog'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPills options={STATUS_FILTERS} active={activeFilter} onChange={setActiveFilter} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-warm-secondary border border-warm rounded-full px-3.5 py-1.5 text-xs font-semibold text-warm-primary outline-none focus:border-orange-accent"
          >
            {usedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs by title, category, tag…"
          className="bg-warm-secondary border border-warm rounded-full px-4 py-2 text-xs text-warm-primary placeholder:text-warm-muted outline-none focus:border-orange-accent w-full md:w-64"
        />
      </div>

      {/* Blog table */}
      <div className={adminCard}>
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className={adminTh}>Article</th>
                  <th className={adminTh}>Category</th>
                  <th className={adminTh}>Status</th>
                  <th className={adminTh}>Date</th>
                  <th className={adminTh}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((blog) => (
                  <tr
                    key={blog.id}
                    className="transition-colors duration-150 hover:bg-warm-secondary/40"
                  >
                    <td className={adminTd}>
                      <div className="flex items-center gap-3">
                        {blog.cover_image_url && (
                          <div className="w-12 h-8 rounded-lg overflow-hidden border border-warm relative shrink-0">
                            <Image src={blog.cover_image_url} alt="" fill className="object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-warm-primary truncate max-w-[260px]">
                            {blog.title}
                          </div>
                          <div className="text-[11px] text-warm-muted truncate max-w-[260px]">
                            By {blog.author_name} · /blog/{blog.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={adminTd}>
                      <span className="badge-pill text-[11px]">{blog.category}</span>
                      {blog.is_featured && (
                        <span className="badge-pill text-[10px] border-orange-accent/40 text-orange-accent ml-1">
                          ★ Featured
                        </span>
                      )}
                    </td>
                    <td className={adminTd}>
                      <button
                        type="button"
                        onClick={() => toggleStatus(blog)}
                        title="Click to toggle Published / Draft"
                        className="cursor-pointer"
                      >
                        <StatusBadge
                          status={
                            blog.status === 'published'
                              ? 'Accepted'
                              : blog.status === 'draft'
                              ? 'Pending'
                              : 'Rejected'
                          }
                        />
                        <span className="ml-1.5 text-[11px] font-semibold uppercase text-warm-muted">
                          ({blog.status})
                        </span>
                      </button>
                    </td>
                    <td className={adminTd}>
                      <div className="text-xs">{formatDate(blog.published_at || blog.created_at)}</div>
                      {blog.reading_time && (
                        <div className="text-[11px] text-warm-muted">{blog.reading_time} min read</div>
                      )}
                    </td>
                    <td className={adminTd}>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openEdit(blog)}
                          className="text-xs font-semibold text-warm-primary underline underline-offset-2 hover:text-orange-accent cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(blog)}
                          className="text-xs font-semibold text-[#2f7a1d] dark:text-[#79d45e] underline underline-offset-2 cursor-pointer"
                        >
                          {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFeatured(blog)}
                          className="text-xs font-semibold text-orange-accent underline underline-offset-2 cursor-pointer"
                        >
                          {blog.is_featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <Link
                          href={`/blog/preview/${blog.id}`}
                          target="_blank"
                          className="text-xs font-semibold text-[#1d6fb3] dark:text-[#70b5ff] underline underline-offset-2"
                        >
                          Preview
                        </Link>
                        {blog.status === 'published' && (
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="text-xs font-semibold text-warm-secondary hover:text-warm-primary underline underline-offset-2"
                          >
                            Live
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(blog.id)}
                          className="text-xs font-semibold text-[#c74a62] underline underline-offset-2 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              text={
                search || activeFilter !== 'All' || categoryFilter !== 'All'
                  ? 'No blogs match your current filters.'
                  : 'No blog posts yet — create your first article or import one from a URL.'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
