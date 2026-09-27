'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar,
  Megaphone,
  BookOpen,
  Rocket,
  Users,
  Image as ImageIcon,
  LayoutTemplate,
  FileText,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
  Shield,
  Sparkles,
  Pin,
  X,
} from 'lucide-react'
import {
  saveEventAction,
  deleteEventAction,
  deleteEventRsvpAction,
  saveAnnouncementAction,
  deleteAnnouncementAction,
  saveResourceAction,
  deleteResourceAction,
  saveStartupAction,
  updateStartupStatusAction,
  deleteStartupAction,
  saveMentorAction,
  deleteMentorAction,
  updateMentorshipRequestStatusAction,
  deleteMentorshipRequestAction,
  saveSiteImageAction,
  deleteSiteImageAction,
  saveSiteBlocksAction,
  updateApplicationStatusAction,
  deleteApplicationAction,
} from './actions'
import { formatDate } from '@/lib/utils'
import BlogManager from '@/components/admin/BlogManager'

interface AdminCmsProps {
  adminName: string
  adminEmail: string
  events: any[]
  eventRsvps: any[]
  announcements: any[]
  resources: any[]
  startups: any[]
  mentors: any[]
  mentorshipRequests: any[]
  siteImages: any[]
  siteBlocks: Record<string, any>
  applications: any[]
  blogs: any[]
}

type TabId =
  | 'overview'
  | 'events'
  | 'announcements'
  | 'blog'
  | 'resources'
  | 'startups'
  | 'mentorship'
  | 'images'
  | 'blocks'
  | 'applications'

const TABS: Array<{ id: TabId; label: string; icon: any; badge?: (p: AdminCmsProps) => number }> = [
  { id: 'overview', label: 'Overview', icon: Sparkles },
  {
    id: 'events',
    label: 'Events & RSVPs',
    icon: Calendar,
    badge: (p) => p.eventRsvps.length,
  },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  {
    id: 'blog',
    label: 'Blog Management',
    icon: FileText,
    badge: (p) => (p.blogs || []).length,
  },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  {
    id: 'startups',
    label: 'Startups',
    icon: Rocket,
    badge: (p) => p.startups.filter((s) => s.status === 'pending').length,
  },
  {
    id: 'mentorship',
    label: 'Mentorship',
    icon: Users,
    badge: (p) => p.mentorshipRequests.filter((r) => r.status === 'pending').length,
  },
  { id: 'images', label: 'Website Images', icon: ImageIcon },
  { id: 'blocks', label: 'Homepage Blocks', icon: LayoutTemplate },
  {
    id: 'applications',
    label: 'Applications',
    icon: FileText,
    badge: (p) => p.applications.filter((a) => (a.status || 'Pending') === 'Pending').length,
  },
]

const RESOURCE_CATEGORIES = [
  'Pitch Decks & Templates',
  'Free Tools / Software Credits',
  'Funding & Grants Guides',
  'Legal & Incorporation',
  'Roadmaps & Playbooks',
]

const inputCls =
  'w-full rounded-xl px-3.5 py-2.5 bg-warm-secondary border border-warm text-xs sm:text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors'
const labelCls =
  'block text-[11px] font-bold uppercase tracking-wider text-warm-primary mb-1.5'

export default function AdminCmsClient(props: AdminCmsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )

  // Modal / Form states for editing vs adding
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [rsvpEventFilter, setRsvpEventFilter] = useState<string>('ALL')

  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null)
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)

  const [editingResource, setEditingResource] = useState<any | null>(null)
  const [showResourceForm, setShowResourceForm] = useState(false)

  const [editingStartup, setEditingStartup] = useState<any | null>(null)
  const [showStartupForm, setShowStartupForm] = useState(false)

  const [editingMentor, setEditingMentor] = useState<any | null>(null)
  const [showMentorForm, setShowMentorForm] = useState(false)

  const [editingImage, setEditingImage] = useState<any | null>(null)
  const [showImageForm, setShowImageForm] = useState(false)

  function notify(type: 'success' | 'error', text: string) {
    setFeedback({ type, text })
    setTimeout(() => {
      setFeedback((prev) => (prev?.text === text ? null : prev))
    }, 4500)
  }

  function runAction(fn: () => Promise<{ error?: string; success?: boolean }>, successMsg: string, onDone?: () => void) {
    startTransition(async () => {
      const res = await fn()
      if (res?.error) {
        notify('error', res.error)
      } else {
        notify('success', successMsg)
        if (onDone) onDone()
        router.refresh()
      }
    })
  }

  const exportRsvpsCsv = () => {
    const rowsToExport =
      rsvpEventFilter === 'ALL'
        ? props.eventRsvps
        : props.eventRsvps.filter((r) => r.event_id === rsvpEventFilter)
    if (!rowsToExport.length) {
      notify('error', 'No event registrations to export.')
      return
    }
    const headers = ['Event,Full Name,Email,Phone,Branch,Roll No,Registered At']
    const lines = rowsToExport.map((r) => {
      const evTitle =
        props.events.find((e) => e.id === r.event_id)?.title || r.event_id
      return `"${evTitle}","${r.full_name || ''}","${r.email || ''}","${r.phone || ''}","${r.branch || ''}","${r.roll_no || ''}","${r.created_at || ''}"`
    })
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...lines].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', `ecell_event_rsvps_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const exportApplicationsCsv = () => {
    if (!props.applications.length) {
      notify('error', 'No applications to export.')
      return
    }
    const headers = ['Name,Enrollment,Email,Phone,Branch & Year,Department,Status,Submitted At']
    const lines = props.applications.map(
      (a) =>
        `"${a.name || ''}","${a.enrollment || ''}","${a.email || ''}","${a.phone || ''}","${a.branch_year || ''}","${a.dept_interest || ''}","${a.status || 'Pending'}","${a.created_at || ''}"`
    )
    const csv = 'data:text/csv;charset=utf-8,' + [headers, ...lines].join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', `ecell_applications_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const statsBlock = props.siteBlocks.stats || {
    members: '150+',
    events: '20+',
    startups: '15+',
    mentors: '20+',
    departments: '8',
    accreditation: 'NAAC A+',
  }
  const spotlightBlock = props.siteBlocks.hero_spotlight || {
    badge: 'RECRUITING',
    title: 'UIET Campus AI Assistant & Query Bot',
    subtitle: 'By E-Cell Tech Team • 3 Open Positions',
    ctaText: 'Apply for Project Roles',
    ctaLink: '/contact',
    tags: ['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'NLP'],
  }
  const siteInfoBlock = props.siteBlocks.site_info || {
    email: 'ecelluietfs@gmail.com',
    phone: '+91 98123 45678',
    address: 'UIET Building, MDU Campus, Rohtak, Haryana - 124001',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-warm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-secondary border border-warm text-orange-accent text-[11px] font-bold tracking-wider uppercase mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>AUTHORIZED ADMIN CMS • {props.adminEmail}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-warm-primary">
            E-Cell Content Management System
          </h1>
          <p className="text-xs sm:text-sm text-warm-secondary mt-1">
            Manage events, posters, announcements, resources, startups, mentorship, images, and homepage blocks. All changes update the public website immediately.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            className="btn-pill-secondary text-xs py-2 px-4 font-semibold"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-[#3E8F5A]/10 border-[#3E8F5A]/30 text-[#2f7a1d] dark:text-[#79d45e]'
              : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Horizontal / Responsive Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 border-b border-warm">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = activeTab === t.id
          const badgeVal = t.badge ? t.badge(props) : 0
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                active
                  ? 'bg-[#211B17] dark:bg-[#F5EFE5] text-[#FCFAF6] dark:text-[#120F0D] border-[#211B17] dark:border-[#F5EFE5] shadow-2xs'
                  : 'bg-warm-surface text-warm-secondary border-warm hover:text-warm-primary hover:bg-warm-secondary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              {badgeVal > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none font-extrabold ${
                    active
                      ? 'bg-orange-accent text-white'
                      : 'bg-orange-accent/15 text-orange-accent'
                  }`}
                >
                  {badgeVal}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: OVERVIEW
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'Events Published',
                value: props.events.length,
                sub: `${props.eventRsvps.length} Total RSVPs`,
                tab: 'events' as TabId,
              },
              {
                label: 'Announcements',
                value: props.announcements.length,
                sub: `${props.announcements.filter((a) => a.is_pinned).length} Pinned Banner`,
                tab: 'announcements' as TabId,
              },
              {
                label: 'Blog Articles',
                value: (props.blogs || []).length,
                sub: `${(props.blogs || []).filter((b) => b.status === 'published').length} Published`,
                tab: 'blog' as TabId,
              },
              {
                label: 'Resources',
                value: props.resources.length,
                sub: 'Public Founder Toolkit',
                tab: 'resources' as TabId,
              },
              {
                label: 'Startups',
                value: props.startups.length,
                sub: `${props.startups.filter((s) => s.status === 'pending').length} Pending Review`,
                tab: 'startups' as TabId,
              },
              {
                label: 'Mentors',
                value: props.mentors.length,
                sub: `${props.mentorshipRequests.length} Student Requests`,
                tab: 'mentorship' as TabId,
              },
              {
                label: 'Website Images',
                value: props.siteImages.length,
                sub: 'Gallery & Visual Assets',
                tab: 'images' as TabId,
              },
              {
                label: 'Homepage Blocks',
                value: 3,
                sub: 'Stats, Spotlight & Info',
                tab: 'blocks' as TabId,
              },
              {
                label: 'Applications',
                value: props.applications.length,
                sub: `${props.applications.filter((a) => (a.status || 'Pending') === 'Pending').length} Pending Review`,
                tab: 'applications' as TabId,
              },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => setActiveTab(card.tab)}
                className="card-warm p-5 text-left hover:border-orange-accent transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-warm-primary">
                    {card.value}
                  </div>
                  <div className="text-xs font-bold text-warm-primary mt-1">
                    {card.label}
                  </div>
                </div>
                <div className="text-[11px] text-orange-accent font-semibold mt-3">
                  {card.sub} →
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card-warm p-6">
            <h2 className="text-base font-extrabold text-warm-primary mb-4">
              Quick Content Operations
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null)
                  setShowEventForm(true)
                  setActiveTab('events')
                }}
                className="btn-pill-primary text-xs py-2.5 px-4 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('blog')}
                className="btn-pill-secondary text-xs py-2.5 px-4 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write / Import Blog Article</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingAnnouncement(null)
                  setShowAnnouncementForm(true)
                  setActiveTab('announcements')
                }}
                className="btn-pill-secondary text-xs py-2.5 px-4 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Announcement</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingResource(null)
                  setShowResourceForm(true)
                  setActiveTab('resources')
                }}
                className="btn-pill-secondary text-xs py-2.5 px-4 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Resource</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingStartup(null)
                  setShowStartupForm(true)
                  setActiveTab('startups')
                }}
                className="btn-pill-secondary text-xs py-2.5 px-4 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Startup</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingImage(null)
                  setShowImageForm(true)
                  setActiveTab('images')
                }}
                className="btn-pill-secondary text-xs py-2.5 px-4 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Website Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: EVENTS & PUBLIC REGISTRATIONS (RSVPs)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-warm-primary">
                Events &amp; Poster Management
              </h2>
              <p className="text-xs text-warm-secondary">
                Create, edit, or delete E-Cell events and upload official event posters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingEvent(null)
                setShowEventForm(!showEventForm)
              }}
              className="btn-pill-primary text-xs py-2.5 px-4 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showEventForm ? 'Close Event Form' : 'Add New Event'}</span>
            </button>
          </div>

          {showEventForm && (
            <form
              action={(fd) =>
                runAction(
                  () => saveEventAction(fd),
                  editingEvent ? 'Event updated!' : 'Event created!',
                  () => {
                    setShowEventForm(false)
                    setEditingEvent(null)
                  }
                )
              }
              className="card-warm p-6 space-y-4"
            >
              <h3 className="text-base font-extrabold text-warm-primary">
                {editingEvent ? `Edit Event: ${editingEvent.title}` : 'Create New Event'}
              </h3>
              <input type="hidden" name="id" value={editingEvent?.id || ''} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingEvent?.title || ''}
                    placeholder="e.g. Innostorm 2026: Campus Ideathon"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Date &amp; Time *</label>
                  <input
                    type="datetime-local"
                    name="date"
                    required
                    defaultValue={
                      editingEvent?.date
                        ? new Date(editingEvent.date).toISOString().slice(0, 16)
                        : ''
                    }
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Venue / Location *</label>
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue={editingEvent?.location || ''}
                    placeholder="e.g. UIET Seminar Hall, MDU Rohtak"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    External Registration Link (Optional — leave blank for built-in RSVP)
                  </label>
                  <input
                    type="url"
                    name="registration_link"
                    defaultValue={editingEvent?.registration_link || ''}
                    placeholder="https://forms.google.com/..."
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Event Description *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  defaultValue={editingEvent?.description || ''}
                  placeholder="Full details, eligibility, schedule, and prizes..."
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Upload Event Poster Image (Max 5MB)</label>
                  <input
                    type="file"
                    name="poster_file"
                    accept="image/*"
                    className="w-full text-xs text-warm-secondary file:mr-3 file:py-2 file:px-3.5 file:rounded-full file:border file:border-warm file:text-xs file:font-semibold file:bg-warm-secondary file:text-warm-primary"
                  />
                </div>
                <div>
                  <label className={labelCls}>Or Poster Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    defaultValue={editingEvent?.image_url || ''}
                    placeholder="/gallery/page_1.jpg or https://..."
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventForm(false)
                    setEditingEvent(null)
                  }}
                  className="btn-pill-secondary text-xs py-2 px-4 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-pill-primary text-xs py-2 px-5 font-semibold cursor-pointer"
                >
                  {isPending
                    ? 'Saving...'
                    : editingEvent
                      ? 'Update Event'
                      : 'Publish Event'}
                </button>
              </div>
            </form>
          )}

          {/* Events List Table */}
          <div className="card-warm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-warm bg-warm-secondary/60 text-[11px] font-bold uppercase tracking-wider text-warm-muted">
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">RSVPs</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm text-xs sm:text-sm">
                  {props.events.map((ev) => {
                    const rsvpCount = props.eventRsvps.filter(
                      (r) => r.event_id === ev.id
                    ).length
                    return (
                      <tr key={ev.id} className="hover:bg-warm-secondary/40">
                        <td className="py-3.5 px-4 font-bold text-warm-primary">
                          {ev.title}
                        </td>
                        <td className="py-3.5 px-4 text-warm-secondary whitespace-nowrap">
                          {formatDate(ev.date)}
                        </td>
                        <td className="py-3.5 px-4 text-warm-secondary">
                          {ev.location}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="badge-pill text-[11px] font-bold">
                            {rsvpCount} Registered
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEvent(ev)
                              setShowEventForm(true)
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-warm-primary hover:text-orange-accent cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete event "${ev.title}"?`)) {
                                runAction(
                                  () => deleteEventAction(ev.id),
                                  'Event deleted.'
                                )
                              }
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline cursor-pointer ml-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Private Event Registrations (RSVPs) Section */}
          <div className="card-warm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-warm-primary">
                  Submitted Event Registrations ({props.eventRsvps.length})
                </h3>
                <p className="text-xs text-warm-secondary">
                  Private visitor registrations submitted without login. Visible only to Administrators.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={rsvpEventFilter}
                  onChange={(e) => setRsvpEventFilter(e.target.value)}
                  className="rounded-full px-3.5 py-1.5 bg-warm-secondary border border-warm text-xs font-semibold text-warm-primary"
                >
                  <option value="ALL">All Events ({props.eventRsvps.length})</option>
                  {props.events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={exportRsvpsCsv}
                  className="btn-pill-secondary text-xs py-1.5 px-3.5 font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-warm text-[11px] font-bold uppercase tracking-wider text-warm-muted">
                    <th className="py-2.5 px-3">Participant</th>
                    <th className="py-2.5 px-3">Email &amp; Phone</th>
                    <th className="py-2.5 px-3">Branch / Roll No</th>
                    <th className="py-2.5 px-3">Event</th>
                    <th className="py-2.5 px-3 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm text-xs">
                  {(rsvpEventFilter === 'ALL'
                    ? props.eventRsvps
                    : props.eventRsvps.filter((r) => r.event_id === rsvpEventFilter)
                  ).map((rsvp) => {
                    const evTitle =
                      props.events.find((e) => e.id === rsvp.event_id)?.title ||
                      'Event'
                    return (
                      <tr key={rsvp.id}>
                        <td className="py-2.5 px-3 font-bold text-warm-primary">
                          {rsvp.full_name}
                        </td>
                        <td className="py-2.5 px-3 text-warm-secondary">
                          <div>{rsvp.email}</div>
                          {rsvp.phone && (
                            <div className="text-[11px] text-warm-muted">{rsvp.phone}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-warm-secondary">
                          {rsvp.branch || '—'} {rsvp.roll_no ? `(${rsvp.roll_no})` : ''}
                        </td>
                        <td className="py-2.5 px-3 text-warm-secondary">{evTitle}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              runAction(
                                () => deleteEventRsvpAction(rsvp.id),
                                'Registration entry removed.'
                              )
                            }
                            className="text-red-600 hover:underline font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {props.eventRsvps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-warm-muted">
                        No event registrations received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: ANNOUNCEMENTS / NOTICE BOARD
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-warm-primary">
                Announcements &amp; Notice Board
              </h2>
              <p className="text-xs text-warm-secondary">
                Publish campus notices and toggle the pinned top announcement banner.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingAnnouncement(null)
                setShowAnnouncementForm(!showAnnouncementForm)
              }}
              className="btn-pill-primary text-xs py-2.5 px-4 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {showAnnouncementForm ? 'Close Form' : 'Add Announcement'}
              </span>
            </button>
          </div>

          {showAnnouncementForm && (
            <form
              action={(fd) =>
                runAction(
                  () => saveAnnouncementAction(fd),
                  editingAnnouncement
                    ? 'Announcement updated!'
                    : 'Announcement published!',
                  () => {
                    setShowAnnouncementForm(false)
                    setEditingAnnouncement(null)
                  }
                )
              }
              className="card-warm p-6 space-y-4"
            >
              <h3 className="text-base font-extrabold text-warm-primary">
                {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
              </h3>
              <input type="hidden" name="id" value={editingAnnouncement?.id || ''} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Headline / Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingAnnouncement?.title || ''}
                    placeholder="e.g. Applications Open for Ideathon 2026"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Category Badge</label>
                  <select
                    name="category"
                    defaultValue={editingAnnouncement?.category || 'Notice'}
                    className={inputCls}
                  >
                    <option value="Notice">Notice</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="Event">Event</option>
                    <option value="Opportunity">Opportunity</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Announcement Content *</label>
                <textarea
                  name="content"
                  required
                  rows={3}
                  defaultValue={editingAnnouncement?.content || ''}
                  placeholder="Write the announcement details..."
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Action Link URL (Optional)</label>
                  <input
                    type="text"
                    name="link_url"
                    defaultValue={editingAnnouncement?.link_url || ''}
                    placeholder="/events or https://..."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Action Button Label (Optional)</label>
                  <input
                    type="text"
                    name="link_text"
                    defaultValue={editingAnnouncement?.link_text || ''}
                    placeholder="e.g. Register Now"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-warm-primary cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_pinned"
                    value="true"
                    defaultChecked={editingAnnouncement?.is_pinned ?? false}
                    className="rounded border-warm"
                  />
                  <span>Pin to top of website navbar banner</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-bold text-warm-primary cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    value="true"
                    defaultChecked={editingAnnouncement?.is_active ?? true}
                    className="rounded border-warm"
                  />
                  <span>Visible on public website</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAnnouncementForm(false)
                    setEditingAnnouncement(null)
                  }}
                  className="btn-pill-secondary text-xs py-2 px-4 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-pill-primary text-xs py-2 px-5 font-semibold cursor-pointer"
                >
                  {isPending ? 'Saving...' : 'Save Announcement'}
                </button>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {props.announcements.map((a) => (
              <div
                key={a.id}
                className="card-warm p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="badge-pill border-orange-accent/40 text-orange-accent text-[10px] font-bold uppercase">
                        {a.category}
                      </span>
                      {a.is_pinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#211B17] text-white text-[10px] font-bold">
                          <Pin className="w-2.5 h-2.5" /> PINNED BANNER
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-warm-muted">
                      {formatDate(a.created_at)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-warm-primary mb-1">
                    {a.title}
                  </h3>
                  <p className="text-xs text-warm-secondary leading-relaxed">
                    {a.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-warm flex items-center justify-between text-xs">
                  <span className="text-warm-muted">
                    {a.link_url ? `Link: ${a.link_url}` : 'No link attached'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAnnouncement(a)
                        setShowAnnouncementForm(true)
                      }}
                      className="font-semibold text-warm-primary hover:text-orange-accent cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete announcement "${a.title}"?`)) {
                          runAction(
                            () => deleteAnnouncementAction(a.id),
                            'Announcement deleted.'
                          )
                        }
                      }}
                      className="font-semibold text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: RESOURCES LIBRARY
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-warm-primary">
                Resource Library Management
              </h2>
              <p className="text-xs text-warm-secondary">
                Add, edit, or delete startup guides, templates, and software credit links shown on /resources.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingResource(null)
                setShowResourceForm(!showResourceForm)
              }}
              className="btn-pill-primary text-xs py-2.5 px-4 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showResourceForm ? 'Close Form' : 'Add Resource'}</span>
            </button>
          </div>

          {showResourceForm && (
            <form
              action={(fd) =>
                runAction(
                  () => saveResourceAction(fd),
                  editingResource ? 'Resource updated!' : 'Resource added!',
                  () => {
                    setShowResourceForm(false)
                    setEditingResource(null)
                  }
                )
              }
              className="card-warm p-6 space-y-4"
            >
              <h3 className="text-base font-extrabold text-warm-primary">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <input type="hidden" name="id" value={editingResource?.id || ''} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Resource Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingResource?.title || ''}
                    placeholder="e.g. Y Combinator Seed Pitch Deck Template"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <select
                    name="category"
                    defaultValue={
                      editingResource?.category || RESOURCE_CATEGORIES[0]
                    }
                    className={inputCls}
                  >
                    {RESOURCE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Resource URL / Link *</label>
                <input
                  type="url"
                  name="url"
                  required
                  defaultValue={editingResource?.url || ''}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={editingResource?.description || ''}
                  placeholder="Explain how this resource helps student entrepreneurs..."
                  className={inputCls}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResourceForm(false)
                    setEditingResource(null)
                  }}
                  className="btn-pill-secondary text-xs py-2 px-4 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-pill-primary text-xs py-2 px-5 font-semibold cursor-pointer"
                >
                  {isPending ? 'Saving...' : 'Save Resource'}
                </button>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {props.resources.map((r) => (
              <div
                key={r.id}
                className="card-warm p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <span className="badge-pill border-orange-accent/40 text-orange-accent text-[10px] font-bold mb-2">
                    {r.category}
                  </span>
                  <h3 className="text-base font-bold text-warm-primary mb-1">
                    {r.title}
                  </h3>
                  <p className="text-xs text-warm-secondary leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-warm flex items-center justify-between text-xs">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-orange-accent hover:underline truncate max-w-[220px]"
                  >
                    {r.url}
                  </a>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingResource(r)
                        setShowResourceForm(true)
                      }}
                      className="font-semibold text-warm-primary hover:text-orange-accent cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete resource "${r.title}"?`)) {
                          runAction(
                            () => deleteResourceAction(r.id),
                            'Resource deleted.'
                          )
                        }
                      }}
                      className="font-semibold text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: STARTUPS DIRECTORY & MODERATION
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'startups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-warm-primary">
                Startup Directory &amp; Submissions
              </h2>
              <p className="text-xs text-warm-secondary">
                Add/edit campus startups or approve pending public submissions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingStartup(null)
                setShowStartupForm(!showStartupForm)
              }}
              className="btn-pill-primary text-xs py-2.5 px-4 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showStartupForm ? 'Close Form' : 'Add Startup'}</span>
            </button>
          </div>

          {showStartupForm && (
            <form
              action={(fd) =>
                runAction(
                  () => saveStartupAction(fd),
                  editingStartup ? 'Startup updated!' : 'Startup added!',
                  () => {
                    setShowStartupForm(false)
                    setEditingStartup(null)
                  }
                )
              }
              className="card-warm p-6 space-y-4"
            >
              <h3 className="text-base font-extrabold text-warm-primary">
                {editingStartup ? `Edit Startup: ${editingStartup.name}` : 'Add New Startup'}
              </h3>
              <input type="hidden" name="id" value={editingStartup?.id || ''} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Startup Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingStartup?.name || ''}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Tagline *</label>
                  <input
                    type="text"
                    name="tagline"
                    required
                    defaultValue={editingStartup?.tagline || ''}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Visibility Status</label>
                  <select
                    name="status"
                    defaultValue={editingStartup?.status || 'approved'}
                    className={inputCls}
                  >
                    <option value="approved">Approved (Public)</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={editingStartup?.description || ''}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Founder Name</label>
                  <input
                    type="text"
                    name="founder_name"
                    defaultValue={editingStartup?.founder_name || ''}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Founder Email</label>
                  <input
                    type="email"
                    name="founder_email"
                    defaultValue={editingStartup?.founder_email || ''}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Founder Branch / Batch</label>
                  <input
                    type="text"
                    name="founder_branch"
                    defaultValue={editingStartup?.founder_branch || ''}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Website URL</label>
                  <input
                    type="url"
                    name="website_url"
                    defaultValue={editingStartup?.website_url || ''}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Upload Logo File</label>
                  <input
                    type="file"
                    name="logo_file"
                    accept="image/*"
                    className="w-full text-xs text-warm-secondary file:mr-3 file:py-2 file:px-3 file:rounded-full file:border file:border-warm file:text-xs file:font-semibold file:bg-warm-secondary file:text-warm-primary"
                  />
                </div>
                <div>
                  <label className={labelCls}>Or Logo Image URL</label>
                  <input
                    type="text"
                    name="logo_url"
                    defaultValue={editingStartup?.logo_url || ''}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowStartupForm(false)
                    setEditingStartup(null)
                  }}
                  className="btn-pill-secondary text-xs py-2 px-4 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-pill-primary text-xs py-2 px-5 font-semibold cursor-pointer"
                >
                  {isPending ? 'Saving...' : 'Save Startup'}
                </button>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {props.startups.map((s) => (
              <div
                key={s.id}
                className="card-warm p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-warm-primary">
                      {s.name}
                    </h3>
                    <span
                      className={`badge-pill text-[10px] font-bold uppercase ${
                        s.status === 'approved'
                          ? 'border-[#3E8F5A]/40 text-[#3E8F5A]'
                          : s.status === 'pending'
                            ? 'border-orange-accent/40 text-orange-accent'
                            : 'border-red-500/40 text-red-600'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-orange-accent mb-2">
                    {s.tagline}
                  </div>
                  <p className="text-xs text-warm-secondary leading-relaxed mb-3">
                    {s.description}
                  </p>
                  <div className="text-[11px] text-warm-muted">
                    Founder: {s.founder_name || 'UIET Student'}{' '}
                    {s.founder_email ? `(${s.founder_email})` : ''}{' '}
                    {s.founder_branch ? `• ${s.founder_branch}` : ''}
                  </div>
                </div>

                <div className="pt-3 border-t border-warm flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    {s.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() =>
                          runAction(
                            () => updateStartupStatusAction(s.id, 'approved'),
                            'Startup approved and published!'
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3E8F5A]/15 text-[#2f7a1d] dark:text-[#79d45e] font-bold cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    {s.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() =>
                          runAction(
                            () => updateStartupStatusAction(s.id, 'rejected'),
                            'Startup marked as rejected.'
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 font-bold cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStartup(s)
                        setShowStartupForm(true)
                      }}
                      className="font-semibold text-warm-primary hover:text-orange-accent cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete startup "${s.name}"?`)) {
                          runAction(
                            () => deleteStartupAction(s.id),
                            'Startup deleted.'
                          )
                        }
                      }}
                      className="font-semibold text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 6: MENTORSHIP HUB & REQUESTS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'mentorship' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-warm-primary">
                Mentors &amp; Public Mentorship Requests
              </h2>
              <p className="text-xs text-warm-secondary">
                Manage alumni/expert mentors and review incoming student mentorship requests.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingMentor(null)
                setShowMentorForm(!showMentorForm)
              }}
              className="btn-pill-primary text-xs py-2.5 px-4 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showMentorForm ? 'Close Form' : 'Add Mentor'}</span>
            </button>
          </div>

          {showMentorForm && (
            <form
              action={(fd) =>
                runAction(
                  () => saveMentorAction(fd),
                  editingMentor ? 'Mentor updated!' : 'Mentor added!',
                  () => {
                    setShowMentorForm(false)
                    setEditingMentor(null)
                  }
                )
              }
              className="card-warm p-6 space-y-4"
            >
              <h3 className="text-base font-extrabold text-warm-primary">
                {editingMentor ? `Edit Mentor: ${editingMentor.full_name}` : 'Add New Mentor'}
              </h3>
              <input type="hidden" name="id" value={editingMentor?.id || ''} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    defaultValue={editingMentor?.full_name || ''}
                    placeholder="e.g. Vikramaditya Hooda"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Domain / Branch</label>
                  <input
                    type="text"
                    name="branch"
                    defaultValue={editingMentor?.branch || ''}
                    placeholder="e.g. CSE (Computer Science)"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Graduation Year</label>
                  <input
                    type="number"
                    name="graduation_year"
                    defaultValue={editingMentor?.graduation_year || ''}
                    placeholder="2019"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Mentor Bio &amp; Expertise</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={editingMentor?.bio || ''}
                  placeholder="Expertise areas, company/startup role, and how they help students..."
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    defaultValue={editingMentor?.linkedin_url || ''}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Upload Photo</label>
                  <input
                    type="file"
                    name="avatar_file"
                    accept="image/*"
                    className="w-full text-xs text-warm-secondary file:mr-3 file:py-2 file:px-3 file:rounded-full file:border file:border-warm file:text-xs file:font-semibold file:bg-warm-secondary file:text-warm-primary"
                  />
                </div>
                <div>
                  <label className={labelCls}>Or Photo URL</label>
                  <input
                    type="text"
                    name="avatar_url"
                    defaultValue={editingMentor?.avatar_url || ''}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMentorForm(false)
                    setEditingMentor(null)
                  }}
                  className="btn-pill-secondary text-xs py-2 px-4 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-pill-primary text-xs py-2 px-5 font-semibold cursor-pointer"
                >
                  {isPending ? 'Saving...' : 'Save Mentor'}
                </button>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {props.mentors.map((m) => (
              <div
                key={m.id}
                className="card-warm p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-warm-primary">
                    {m.full_name}
                  </h3>
                  <div className="text-xs font-semibold text-orange-accent mb-2">
                    {m.branch || 'Industry Mentor'}{' '}
                    {m.graduation_year ? `• Batch ${m.graduation_year}` : ''}
                  </div>
                  <p className="text-xs text-warm-secondary leading-relaxed">
                    {m.bio}
                  </p>
                </div>
                <div className="pt-3 border-t border-warm flex items-center justify-end gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMentor(m)
                      setShowMentorForm(true)
                    }}
                    className="font-semibold text-warm-primary hover:text-orange-accent cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove mentor "${m.full_name}"?`)) {
                        runAction(
                          () => deleteMentorAction(m.id),
                          'Mentor removed.'
                        )
                      }
                    }}
                    className="font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Incoming Student Mentorship Requests */}
          <div className="card-warm p-6 space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-warm-primary">
                Incoming Mentorship Requests ({props.mentorshipRequests.length})
              </h3>
              <p className="text-xs text-warm-secondary">
                Submitted publicly by students without login. Protected by Admin-only RLS.
              </p>
            </div>

            <div className="space-y-3">
              {props.mentorshipRequests.map((req) => {
                const mentorName =
                  props.mentors.find((m) => m.id === req.mentor_id)?.full_name ||
                  'Mentor'
                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-warm-secondary border border-warm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-warm-primary">
                          {req.student_name || 'Student'}
                        </span>
                        <span className="text-xs text-warm-muted">
                          ({req.student_email || 'No email'})
                        </span>
                        {req.student_phone && (
                          <span className="text-xs text-warm-muted">
                            • {req.student_phone}
                          </span>
                        )}
                        {req.student_branch && (
                          <span className="badge-pill text-[10px]">
                            {req.student_branch}
                          </span>
                        )}
                        <span className="badge-pill border-orange-accent/40 text-orange-accent text-[10px] font-bold">
                          For: {mentorName}
                        </span>
                      </div>
                      <p className="text-xs text-warm-secondary leading-relaxed">
                        {req.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="badge-pill text-[10px] uppercase font-bold">
                        {req.status}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          runAction(
                            () =>
                              updateMentorshipRequestStatusAction(
                                req.id,
                                'accepted'
                              ),
                            'Marked as accepted.'
                          )
                        }
                        className="px-2.5 py-1 rounded-full bg-[#3E8F5A]/15 text-[#2f7a1d] dark:text-[#79d45e] text-xs font-bold cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          runAction(
                            () =>
                              updateMentorshipRequestStatusAction(
                                req.id,
                                'declined'
                              ),
                            'Marked as declined.'
                          )
                        }
                        className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-bold cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          runAction(
                            () => deleteMentorshipRequestAction(req.id),
                            'Request deleted.'
                          )
                        }
                        className="text-xs text-red-600 hover:underline ml-1 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
              {props.mentorshipRequests.length === 0 && (
                <p className="text-xs text-warm-muted py-4 text-center">
                  No mentorship requests submitted yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 7: WEBSITE IMAGES / GALLERY MANAGEMENT
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-warm-primary">
                Website Images &amp; Campus Gallery
              </h2>
              <p className="text-xs text-warm-secondary">
                Upload or manage photos displayed in the Campus Moments gallery on the Homepage and About page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingImage(null)
                setShowImageForm(!showImageForm)
              }}
              className="btn-pill-primary text-xs py-2.5 px-4 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showImageForm ? 'Close Form' : 'Add Website Image'}</span>
            </button>
          </div>

          {showImageForm && (
            <form
              action={(fd) =>
                runAction(
                  () => saveSiteImageAction(fd),
                  editingImage ? 'Image updated!' : 'Image added to gallery!',
                  () => {
                    setShowImageForm(false)
                    setEditingImage(null)
                  }
                )
              }
              className="card-warm p-6 space-y-4"
            >
              <h3 className="text-base font-extrabold text-warm-primary">
                {editingImage ? 'Edit Website Image' : 'Add Website / Gallery Image'}
              </h3>
              <input type="hidden" name="id" value={editingImage?.id || ''} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Title / Caption *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingImage?.title || ''}
                    placeholder="e.g. Eureka Pitching Finals"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    name="category"
                    defaultValue={editingImage?.category || 'Events'}
                    className={inputCls}
                  >
                    <option value="Events">Events</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Team">Team</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    defaultValue={editingImage?.display_order ?? 0}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Short Description (Optional)</label>
                <input
                  type="text"
                  name="description"
                  defaultValue={editingImage?.description || ''}
                  placeholder="Brief description of this moment..."
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Upload Image File (Max 5MB)</label>
                  <input
                    type="file"
                    name="image_file"
                    accept="image/*"
                    className="w-full text-xs text-warm-secondary file:mr-3 file:py-2 file:px-3.5 file:rounded-full file:border file:border-warm file:text-xs file:font-semibold file:bg-warm-secondary file:text-warm-primary"
                  />
                </div>
                <div>
                  <label className={labelCls}>Or Image Path / URL</label>
                  <input
                    type="text"
                    name="image_url"
                    defaultValue={editingImage?.image_url || ''}
                    placeholder="/gallery/page_1.jpg or https://..."
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowImageForm(false)
                    setEditingImage(null)
                  }}
                  className="btn-pill-secondary text-xs py-2 px-4 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-pill-primary text-xs py-2 px-5 font-semibold cursor-pointer"
                >
                  {isPending ? 'Uploading...' : 'Save Image'}
                </button>
              </div>
            </form>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {props.siteImages.map((img) => (
              <div
                key={img.id}
                className="card-warm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-warm-secondary relative overflow-hidden border-b border-warm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 badge-pill bg-warm-surface/90 text-[10px] font-bold">
                      {img.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-warm-primary">
                      {img.title}
                    </h4>
                    {img.description && (
                      <p className="text-xs text-warm-secondary mt-1 line-clamp-2">
                        {img.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-warm flex items-center justify-end gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingImage(img)
                      setShowImageForm(true)
                    }}
                    className="font-semibold text-warm-primary hover:text-orange-accent cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove image "${img.title}"?`)) {
                        runAction(
                          () => deleteSiteImageAction(img.id),
                          'Image deleted.'
                        )
                      }
                    }}
                    className="font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 8: DYNAMIC HOMEPAGE & SITE CONTENT BLOCKS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'blocks' && (
        <form
          action={(fd) =>
            runAction(
              () => saveSiteBlocksAction(fd),
              'Homepage content blocks and site info updated!'
            )
          }
          className="space-y-6"
        >
          <div className="card-warm p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-warm-primary">
              1. Homepage Metrics &amp; Campus Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Active Members</label>
                <input
                  type="text"
                  name="stats_members"
                  defaultValue={statsBlock.members}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Events Hosted</label>
                <input
                  type="text"
                  name="stats_events"
                  defaultValue={statsBlock.events}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Active Startups</label>
                <input
                  type="text"
                  name="stats_startups"
                  defaultValue={statsBlock.startups}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Verified Mentors</label>
                <input
                  type="text"
                  name="stats_mentors"
                  defaultValue={statsBlock.mentors}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Engineering Departments</label>
                <input
                  type="text"
                  name="stats_departments"
                  defaultValue={statsBlock.departments}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Accreditation Label</label>
                <input
                  type="text"
                  name="stats_accreditation"
                  defaultValue={statsBlock.accreditation}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="card-warm p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-warm-primary">
              2. Homepage Featured Initiative / Recruitment Spotlight Card
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Status Badge</label>
                <input
                  type="text"
                  name="spotlight_badge"
                  defaultValue={spotlightBlock.badge}
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Project / Initiative Title</label>
                <input
                  type="text"
                  name="spotlight_title"
                  defaultValue={spotlightBlock.title}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Subtitle</label>
                <input
                  type="text"
                  name="spotlight_subtitle"
                  defaultValue={spotlightBlock.subtitle}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>CTA Button Text</label>
                <input
                  type="text"
                  name="spotlight_cta_text"
                  defaultValue={spotlightBlock.ctaText}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>CTA Link URL</label>
                <input
                  type="text"
                  name="spotlight_cta_link"
                  defaultValue={spotlightBlock.ctaLink}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Skill / Tech Tags (Comma-separated)</label>
              <input
                type="text"
                name="spotlight_tags"
                defaultValue={(spotlightBlock.tags || []).join(', ')}
                className={inputCls}
              />
            </div>
          </div>

          <div className="card-warm p-6 space-y-4">
            <h2 className="text-lg font-extrabold text-warm-primary">
              3. Official Campus Contact &amp; Social Links (Footer)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Official Email</label>
                <input
                  type="email"
                  name="site_email"
                  defaultValue={siteInfoBlock.email}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Contact Phone</label>
                <input
                  type="text"
                  name="site_phone"
                  defaultValue={siteInfoBlock.phone}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>LinkedIn URL</label>
                <input
                  type="url"
                  name="site_linkedin"
                  defaultValue={siteInfoBlock.linkedin}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Instagram URL</label>
                <input
                  type="url"
                  name="site_instagram"
                  defaultValue={siteInfoBlock.instagram}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Campus Address</label>
              <input
                type="text"
                name="site_address"
                defaultValue={siteInfoBlock.address}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="btn-pill-primary text-xs py-3 px-6 font-semibold cursor-pointer"
            >
              {isPending ? 'Saving Changes...' : 'Save All Homepage & Site Blocks'}
            </button>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 9: PUBLIC RECRUITMENT / CONTACT APPLICATIONS
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'applications' && (
        <div className="card-warm p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-extrabold text-warm-primary">
                E-Cell Team Applications ({props.applications.length})
              </h2>
              <p className="text-xs text-warm-secondary">
                Submitted publicly via /contact without login. Strictly protected by Admin-only RLS.
              </p>
            </div>
            <button
              type="button"
              onClick={exportApplicationsCsv}
              className="btn-pill-secondary text-xs py-2 px-4 font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {props.applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-warm-secondary border border-warm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-warm-primary">
                      {app.name}
                    </span>
                    {app.enrollment && (
                      <span className="badge-pill text-[10px] font-mono">
                        {app.enrollment}
                      </span>
                    )}
                    {app.dept_interest && (
                      <span className="badge-pill border-orange-accent/40 text-orange-accent text-[10px] font-bold">
                        {app.dept_interest}
                      </span>
                    )}
                    {app.branch_year && (
                      <span className="text-xs text-warm-muted">
                        • {app.branch_year}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-warm-secondary">
                    {app.email} {app.phone ? `• ${app.phone}` : ''}
                  </div>
                  {app.why_join && (
                    <p className="text-xs text-warm-secondary italic pt-1">
                      &ldquo;{app.why_join}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <span className="badge-pill text-[10px] font-bold uppercase">
                    {app.status || 'Pending'}
                  </span>
                  {['Shortlisted', 'Accepted', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        runAction(
                          () => updateApplicationStatusAction(app.id, st),
                          `Application marked as ${st}.`
                        )
                      }
                      className="px-2.5 py-1 rounded-full bg-warm-surface border border-warm text-xs font-semibold hover:border-orange-accent cursor-pointer"
                    >
                      {st}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      runAction(
                        () => deleteApplicationAction(app.id),
                        'Application deleted.'
                      )
                    }
                    className="text-xs text-red-600 hover:underline ml-1 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {props.applications.length === 0 && (
              <p className="text-xs text-warm-muted py-6 text-center">
                No recruitment applications submitted yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 10: BLOG / ARTICLES MANAGEMENT
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'blog' && (
        <div className="card-warm p-6">
          <BlogManager blogs={props.blogs || []} />
        </div>
      )}
    </div>
  )
}

