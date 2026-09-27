import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminCmsClient from './AdminCmsClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/login?message=Access restricted to authorized E-Cell Administrators.')
  }

  // Fetch all CMS datasets in parallel on the server
  const [
    { data: events },
    { data: eventRsvps },
    { data: announcements },
    { data: resources },
    { data: startups },
    { data: mentors },
    { data: mentorshipRequests },
    { data: siteImages },
    { data: siteBlocksRows },
    { data: applications },
    { data: blogs },
    { data: team },
  ] = await Promise.all([
    supabase.from('events').select('*').order('date', { ascending: false }),
    supabase
      .from('event_rsvps')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase.from('resources').select('*').order('created_at', { ascending: false }),
    supabase.from('startups').select('*').order('created_at', { ascending: false }),
    supabase
      .from('users')
      .select('*')
      .eq('role', 'mentor')
      .order('created_at', { ascending: false }),
    supabase
      .from('mentorship_requests')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('site_images')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase.from('site_blocks').select('*'),
    supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('team')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true }),
  ])

  const siteBlocks: Record<string, any> = {}
  for (const row of siteBlocksRows || []) {
    siteBlocks[row.key] = row.data
  }

  return (
    <AdminCmsClient
      adminName={profile?.full_name || user.email?.split('@')[0] || 'Admin'}
      adminEmail={user.email || ''}
      events={events || []}
      eventRsvps={eventRsvps || []}
      announcements={announcements || []}
      resources={resources || []}
      startups={startups || []}
      mentors={mentors || []}
      mentorshipRequests={mentorshipRequests || []}
      siteImages={siteImages || []}
      siteBlocks={siteBlocks}
      applications={applications || []}
      blogs={blogs || []}
      team={team || []}
    />
  )
}
