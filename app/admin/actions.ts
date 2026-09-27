'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Authentication required.')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Administrator privileges required.')
  }

  return { supabase, user }
}

function revalidateAllPublicPaths() {
  revalidatePath('/', 'layout')
  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath('/resources')
  revalidatePath('/startups')
  revalidatePath('/mentorship')
  revalidatePath('/blog')
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/admin')
}

async function uploadFileIfPresent(
  supabase: any,
  file: File | null,
  bucket: 'event_posters' | 'startup_logos' | 'site_images' | 'blog-images'
): Promise<string | null> {
  if (!file || file.size === 0) return null

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ]
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid image file format. Allowed: JPG, PNG, WEBP, GIF, SVG.')
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be under 5 MB.')
  }

  const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-zA-Z0-9]/g, '')
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type, upsert: false })

  if (uploadErr) {
    throw new Error(`Storage upload failed: ${uploadErr.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

/* ─────────────────────────────────────────────────────────────
   1. EVENTS & EVENT RSVPs
   ───────────────────────────────────────────────────────────── */

export async function saveEventAction(formData: FormData) {
  try {
    const { supabase } = await requireAdmin()

    const id = ((formData.get('id') as string) || '').trim()
    const title = ((formData.get('title') as string) || '').trim()
    const description = ((formData.get('description') as string) || '').trim()
    const dateRaw = ((formData.get('date') as string) || '').trim()
    const location = ((formData.get('location') as string) || '').trim()
    const registrationLink = ((formData.get('registration_link') as string) || '').trim()
    const existingImageUrl = ((formData.get('image_url') as string) || '').trim()
    const posterFile = formData.get('poster_file') as File | null

    if (!title || !description || !dateRaw || !location) {
      return { error: 'Title, date, location, and description are required.' }
    }

    const uploadedUrl = await uploadFileIfPresent(supabase, posterFile, 'event_posters')
    const finalImageUrl = uploadedUrl || existingImageUrl || null

    const payload = {
      title,
      description,
      date: new Date(dateRaw).toISOString(),
      location,
      registration_link: registrationLink || null,
      image_url: finalImageUrl,
    }

    if (id) {
      const { error } = await supabase.from('events').update(payload).eq('id', id)
      if (error) return { error: error.message }
    } else {
      const { error } = await supabase.from('events').insert([payload])
      if (error) return { error: error.message }
    }

    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to save event.' }
  }
}

export async function deleteEventAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete event.' }
  }
}

export async function deleteEventRsvpAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('event_rsvps').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete registration.' }
  }
}

/* ─────────────────────────────────────────────────────────────
   2. ANNOUNCEMENTS / NOTICES
   ───────────────────────────────────────────────────────────── */

export async function saveAnnouncementAction(formData: FormData) {
  try {
    const { supabase } = await requireAdmin()

    const id = ((formData.get('id') as string) || '').trim()
    const title = ((formData.get('title') as string) || '').trim()
    const content = ((formData.get('content') as string) || '').trim()
    const category = ((formData.get('category') as string) || 'Notice').trim()
    const linkUrl = ((formData.get('link_url') as string) || '').trim()
    const linkText = ((formData.get('link_text') as string) || '').trim()
    const isPinned = formData.get('is_pinned') === 'true'
    const isActive = formData.get('is_active') !== 'false'

    if (!title || !content) {
      return { error: 'Announcement title and content are required.' }
    }

    const payload = {
      title,
      content,
      category,
      link_url: linkUrl || null,
      link_text: linkText || null,
      is_pinned: isPinned,
      is_active: isActive,
    }

    if (id) {
      const { error } = await supabase
        .from('announcements')
        .update(payload)
        .eq('id', id)
      if (error) return { error: error.message }
    } else {
      const { error } = await supabase.from('announcements').insert([payload])
      if (error) return { error: error.message }
    }

    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to save announcement.' }
  }
}

export async function deleteAnnouncementAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete announcement.' }
  }
}

/* ─────────────────────────────────────────────────────────────
   3. RESOURCES LIBRARY
   ───────────────────────────────────────────────────────────── */

export async function saveResourceAction(formData: FormData) {
  try {
    const { supabase } = await requireAdmin()

    const id = ((formData.get('id') as string) || '').trim()
    const title = ((formData.get('title') as string) || '').trim()
    const description = ((formData.get('description') as string) || '').trim()
    const url = ((formData.get('url') as string) || '').trim()
    const category = ((formData.get('category') as string) || 'Pitch Decks & Templates').trim()

    if (!title || !description || !url) {
      return { error: 'Title, description, and URL are required.' }
    }

    const payload = { title, description, url, category }

    if (id) {
      const { error } = await supabase.from('resources').update(payload).eq('id', id)
      if (error) return { error: error.message }
    } else {
      const { error } = await supabase.from('resources').insert([payload])
      if (error) return { error: error.message }
    }

    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to save resource.' }
  }
}

export async function deleteResourceAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('resources').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete resource.' }
  }
}

/* ─────────────────────────────────────────────────────────────
   4. STARTUP DIRECTORY & MODERATION
   ───────────────────────────────────────────────────────────── */

export async function saveStartupAction(formData: FormData) {
  try {
    const { supabase } = await requireAdmin()

    const id = ((formData.get('id') as string) || '').trim()
    const name = ((formData.get('name') as string) || '').trim()
    const tagline = ((formData.get('tagline') as string) || '').trim()
    const description = ((formData.get('description') as string) || '').trim()
    const websiteUrl = ((formData.get('website_url') as string) || '').trim()
    const founderName = ((formData.get('founder_name') as string) || '').trim()
    const founderEmail = ((formData.get('founder_email') as string) || '').trim()
    const founderBranch = ((formData.get('founder_branch') as string) || '').trim()
    const status = ((formData.get('status') as string) || 'approved').trim()
    const existingLogoUrl = ((formData.get('logo_url') as string) || '').trim()
    const logoFile = formData.get('logo_file') as File | null

    if (!name || !tagline || !description) {
      return { error: 'Startup name, tagline, and description are required.' }
    }

    const uploadedLogo = await uploadFileIfPresent(supabase, logoFile, 'startup_logos')
    const finalLogoUrl = uploadedLogo || existingLogoUrl || null

    const payload = {
      name,
      tagline,
      description,
      website_url: websiteUrl || null,
      founder_name: founderName || null,
      founder_email: founderEmail || null,
      founder_branch: founderBranch || null,
      logo_url: finalLogoUrl,
      status,
    }

    if (id) {
      const { error } = await supabase.from('startups').update(payload).eq('id', id)
      if (error) return { error: error.message }
    } else {
      const { error } = await supabase.from('startups').insert([payload])
      if (error) return { error: error.message }
    }

    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to save startup.' }
  }
}

export async function updateStartupStatusAction(
  id: string,
  status: 'approved' | 'pending' | 'rejected'
) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase
      .from('startups')
      .update({ status })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to update startup status.' }
  }
}

export async function deleteStartupAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('startups').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete startup.' }
  }
}

/* ─────────────────────────────────────────────────────────────
   5. MENTORSHIP HUB & REQUESTS
   ───────────────────────────────────────────────────────────── */

export async function saveMentorAction(formData: FormData) {
  try {
    const { supabase } = await requireAdmin()

    const id = ((formData.get('id') as string) || '').trim()
    const fullName = ((formData.get('full_name') as string) || '').trim()
    const branch = ((formData.get('branch') as string) || '').trim()
    const gradYearRaw = ((formData.get('graduation_year') as string) || '').trim()
    const bio = ((formData.get('bio') as string) || '').trim()
    const linkedinUrl = ((formData.get('linkedin_url') as string) || '').trim()
    const existingAvatar = ((formData.get('avatar_url') as string) || '').trim()
    const avatarFile = formData.get('avatar_file') as File | null

    if (!fullName) {
      return { error: 'Mentor full name is required.' }
    }

    const uploadedAvatar = await uploadFileIfPresent(supabase, avatarFile, 'site_images')
    const finalAvatar = uploadedAvatar || existingAvatar || null

    const payload = {
      role: 'mentor',
      full_name: fullName,
      branch: branch || null,
      graduation_year: gradYearRaw ? parseInt(gradYearRaw, 10) : null,
      bio: bio || null,
      linkedin_url: linkedinUrl || null,
      avatar_url: finalAvatar,
    }

    if (id) {
      const { error } = await supabase.from('users').update(payload).eq('id', id)
      if (error) return { error: error.message }
    } else {
      const { error } = await supabase.from('users').insert([payload])
      if (error) return { error: error.message }
    }

    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to save mentor.' }
  }
}

export async function deleteMentorAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .eq('role', 'mentor')
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to remove mentor.' }
  }
}

export async function updateMentorshipRequestStatusAction(
  id: string,
  status: 'pending' | 'accepted' | 'declined'
) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase
      .from('mentorship_requests')
      .update({ status })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to update mentorship request.' }
  }
}

export async function deleteMentorshipRequestAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase
      .from('mentorship_requests')
      .delete()
      .eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete mentorship request.' }
  }
}

/* ─────────────────────────────────────────────────────────────
   6. WEBSITE IMAGES / GALLERY MANAGEMENT
   ───────────────────────────────────────────────────────────── */

export async function saveSiteImageAction(formData: FormData) {
  try {
    const { supabase } = await requireAdmin()

    const id = ((formData.get('id') as string) || '').trim()
    const title = ((formData.get('title') as string) || '').trim()
    const category = ((formData.get('category') as string) || 'Events').trim()
    const description = ((formData.get('description') as string) || '').trim()
    const orderRaw = ((formData.get('display_order') as string) || '0').trim()
    const existingUrl = ((formData.get('image_url') as string) || '').trim()
    const imageFile = formData.get('image_file') as File | null

    if (!title) {
      return { error: 'Image title is required.' }
    }

    const uploadedUrl = await uploadFileIfPresent(supabase, imageFile, 'site_images')
    const finalUrl = uploadedUrl || existingUrl

    if (!finalUrl) {
      return { error: 'Please upload an image file or provide an image URL.' }
    }

    const payload = {
      title,
      category,
      description: description || null,
      image_url: finalUrl,
      display_order: parseInt(orderRaw, 10) || 0,
      is_active: true,
    }

    if (id) {
      const { error } = await supabase
        .from('site_images')
        .update(payload)
        .eq('id', id)
      if (error) return { error: error.message }
    } else {
      const { error } = await supabase.from('site_images').insert([payload])
      if (error) return { error: error.message }
    }

    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to save image.' }
  }
}

export async function deleteSiteImageAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('site_images').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete image.' }
  }
}

/* ─────────────────────────────────────────────────────────────
   7. DYNAMIC HOMEPAGE / SITE BLOCKS
   ───────────────────────────────────────────────────────────── */

export async function saveSiteBlocksAction(formData: FormData) {
  try {
    const { supabase } = await requireAdmin()

    const statsPayload = {
      members: ((formData.get('stats_members') as string) || '150+').trim(),
      events: ((formData.get('stats_events') as string) || '20+').trim(),
      startups: ((formData.get('stats_startups') as string) || '15+').trim(),
      mentors: ((formData.get('stats_mentors') as string) || '20+').trim(),
      departments: ((formData.get('stats_departments') as string) || '8').trim(),
      accreditation: ((formData.get('stats_accreditation') as string) || 'NAAC').trim(),
    }

    const tagsRaw = ((formData.get('spotlight_tags') as string) || '').trim()
    const spotlightPayload = {
      badge: ((formData.get('spotlight_badge') as string) || 'RECRUITING').trim(),
      title: ((formData.get('spotlight_title') as string) || '').trim(),
      subtitle: ((formData.get('spotlight_subtitle') as string) || '').trim(),
      ctaText: ((formData.get('spotlight_cta_text') as string) || 'Apply Now').trim(),
      ctaLink: ((formData.get('spotlight_cta_link') as string) || '/contact').trim(),
      tags: tagsRaw
        ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
        : ['React / Next.js', 'TypeScript', 'Supabase'],
    }

    const siteInfoPayload = {
      email: ((formData.get('site_email') as string) || 'ecellmdu@gmail.com').trim(),
      phone: ((formData.get('site_phone') as string) || '').trim(),
      address: ((formData.get('site_address') as string) || '').trim(),
      linkedin: ((formData.get('site_linkedin') as string) || '').trim(),
      instagram: ((formData.get('site_instagram') as string) || '').trim(),
    }

    const { error } = await supabase.from('site_blocks').upsert([
      { key: 'stats', data: statsPayload, updated_at: new Date().toISOString() },
      {
        key: 'hero_spotlight',
        data: spotlightPayload,
        updated_at: new Date().toISOString(),
      },
      { key: 'site_info', data: siteInfoPayload, updated_at: new Date().toISOString() },
    ])

    if (error) return { error: error.message }

    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to save homepage blocks.' }
  }
}

/* ─────────────────────────────────────────────────────────────
   8. RECRUITMENT / CONTACT APPLICATIONS
   ───────────────────────────────────────────────────────────── */

export async function updateApplicationStatusAction(id: string, status: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to update application status.' }
  }
}

export async function deleteApplicationAction(id: string) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete application.' }
  }
}

/* ─────────────────────────────────────────────────────────────
   9. BLOG / ARTICLES MANAGEMENT
   ───────────────────────────────────────────────────────────── */

function makeCleanSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function uploadBlogImageAction(formData: FormData) {
  try {
    const { supabase } = await requireAdmin()
    const file = formData.get('image_file') as File | null
    if (!file || file.size === 0) {
      return { error: 'Please select an image file to upload.' }
    }
    const url = await uploadFileIfPresent(supabase, file, 'blog-images')
    return { success: true, url }
  } catch (err: any) {
    return { error: err.message || 'Failed to upload blog image.' }
  }
}

export async function saveBlogAction(payload: {
  id?: string | number | null
  title: string
  slug?: string
  excerpt: string
  content: string
  cover_image_url?: string | null
  additional_images?: string[]
  category: string
  tags?: string[]
  author_name?: string
  author_designation?: string | null
  source_url?: string | null
  source_name?: string | null
  published_at?: string | null
  status: 'draft' | 'published' | 'archived'
  is_featured?: boolean
  reading_time?: number | null
  seo_title?: string | null
  seo_description?: string | null
}) {
  try {
    const { supabase } = await requireAdmin()

    const title = (payload.title || '').trim()
    const excerpt = (payload.excerpt || '').trim()
    const content = (payload.content || '').trim()
    const category = (payload.category || 'General').trim()

    if (!title || !excerpt || !content || !category) {
      return { error: 'Title, category, short description, and main content are required.' }
    }

    let baseSlug = makeCleanSlug(payload.slug || title)
    if (!baseSlug) {
      baseSlug = `article-${Date.now()}`
    }

    // Ensure unique slug
    let finalSlug = baseSlug
    const { data: existingSlugRow } = await supabase
      .from('blogs')
      .select('id, slug')
      .eq('slug', finalSlug)
      .maybeSingle()

    if (existingSlugRow && String(existingSlugRow.id) !== String(payload.id || '')) {
      finalSlug = `${baseSlug}-${Math.floor(Date.now() / 1000).toString().slice(-4)}`
    }

    const words = content.split(/\s+/).filter(Boolean).length
    const readingTime = payload.reading_time || Math.max(1, Math.ceil(words / 200))
    const status = payload.status || 'draft'
    const publishedAt =
      status === 'published'
        ? payload.published_at || new Date().toISOString()
        : payload.published_at || null

    const dbRow = {
      title,
      slug: finalSlug,
      excerpt,
      content,
      cover_image_url: payload.cover_image_url || null,
      additional_images: payload.additional_images || [],
      category,
      tags: payload.tags || [],
      author_name: (payload.author_name || 'E-Cell UIET MDU').trim(),
      author_designation: payload.author_designation?.trim() || null,
      source_url: payload.source_url?.trim() || null,
      source_name: payload.source_name?.trim() || null,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
      status,
      is_featured: Boolean(payload.is_featured),
      reading_time: readingTime,
      seo_title: (payload.seo_title || title).trim(),
      seo_description: (payload.seo_description || excerpt).trim(),
    }

    let savedBlog: any = null
    if (payload.id) {
      const { data, error } = await supabase
        .from('blogs')
        .update(dbRow)
        .eq('id', payload.id)
        .select('*')
        .single()
      if (error) return { error: error.message }
      savedBlog = data
    } else {
      const { data, error } = await supabase
        .from('blogs')
        .insert([dbRow])
        .select('*')
        .single()
      if (error) return { error: error.message }
      savedBlog = data
    }

    revalidateAllPublicPaths()
    revalidatePath(`/blog/${finalSlug}`)
    return { success: true, blog: savedBlog }
  } catch (err: any) {
    return { error: err.message || 'Failed to save blog post.' }
  }
}

export async function toggleBlogStatusAction(
  id: string | number,
  newStatus: 'draft' | 'published' | 'archived',
  currentPublishedAt?: string | null
) {
  try {
    const { supabase } = await requireAdmin()
    const publishedAt =
      newStatus === 'published'
        ? currentPublishedAt || new Date().toISOString()
        : currentPublishedAt || null

    const { data, error } = await supabase
      .from('blogs')
      .update({
        status: newStatus,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    if (data?.slug) revalidatePath(`/blog/${data.slug}`)
    return { success: true, blog: data }
  } catch (err: any) {
    return { error: err.message || 'Failed to update blog status.' }
  }
}

export async function toggleBlogFeaturedAction(id: string | number, isFeatured: boolean) {
  try {
    const { supabase } = await requireAdmin()
    const { data, error } = await supabase
      .from('blogs')
      .update({
        is_featured: isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true, blog: data }
  } catch (err: any) {
    return { error: err.message || 'Failed to update featured status.' }
  }
}

export async function deleteBlogAction(id: string | number) {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidateAllPublicPaths()
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete blog post.' }
  }
}

