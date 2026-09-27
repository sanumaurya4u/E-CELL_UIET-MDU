'use client'

import { useState } from 'react'
import { saveEventAction } from '@/app/admin/actions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const result = await saveEventAction(formData)

    if (result?.error) {
      setErrorMsg(result.error)
      setIsSubmitting(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 pb-20">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-secondary hover:text-orange-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Admin Dashboard</span>
      </Link>

      <div className="card-warm p-6 sm:p-10 shadow-xs">
        <h1 className="text-2xl font-extrabold text-warm-primary mb-6">
          Create New Event
        </h1>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30 rounded-xl text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
              Event Title *
            </label>
            <input
              required
              type="text"
              name="title"
              placeholder="e.g. Innostorm 2026 Ideathon"
              className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary focus:outline-none focus:border-orange-accent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                Date &amp; Time *
              </label>
              <input
                required
                type="datetime-local"
                name="date"
                className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary focus:outline-none focus:border-orange-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                Location *
              </label>
              <input
                required
                type="text"
                name="location"
                placeholder="e.g. UIET Seminar Hall"
                className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary focus:outline-none focus:border-orange-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
              Description *
            </label>
            <textarea
              required
              name="description"
              rows={5}
              className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary focus:outline-none focus:border-orange-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
              External Registration Link (Optional)
            </label>
            <input
              type="url"
              name="registration_link"
              placeholder="e.g. Google Forms link (leave blank for built-in RSVP)"
              className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary focus:outline-none focus:border-orange-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
              Event Poster Upload (Optional)
            </label>
            <input
              type="file"
              name="poster_file"
              accept="image/*"
              className="w-full text-xs text-warm-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-warm file:text-xs file:font-semibold file:bg-warm-secondary file:text-warm-primary hover:file:border-orange-accent"
            />
          </div>

          <div className="pt-4 border-t border-warm flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pill-primary text-xs px-6 py-3 font-semibold disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating...' : 'Create Event'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
