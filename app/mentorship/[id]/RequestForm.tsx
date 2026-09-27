'use client'

import { useState } from 'react'
import { submitMentorshipRequest } from './actions'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RequestForm({ mentorId }: { mentorId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setErrorMsg('')
    const result = await submitMentorshipRequest(formData)

    if (result?.error) {
      setErrorMsg(result.error)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div className="p-6 bg-[#3E8F5A]/10 border border-[#3E8F5A]/30 rounded-2xl text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-[#3E8F5A] mx-auto" />
        <div className="text-base font-bold text-warm-primary">
          Mentorship Request Sent!
        </div>
        <p className="text-xs text-warm-secondary leading-relaxed max-w-md mx-auto">
          Your request has been securely recorded. The E-Cell Mentorship team will connect you with the mentor via your provided email address.
        </p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="mentorId" value={mentorId} />
      <input
        type="text"
        name="website_hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {errorMsg && (
        <div className="p-3 bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30 rounded-xl text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
            Your Full Name *
          </label>
          <input
            type="text"
            name="studentName"
            required
            placeholder="e.g. Priyanshu Hooda"
            className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            name="studentEmail"
            required
            placeholder="you@uiet.mdu.ac.in"
            className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            name="studentPhone"
            placeholder="+91 98765 43210"
            className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
            Branch &amp; Year
          </label>
          <input
            type="text"
            name="studentBranch"
            placeholder="e.g. B.Tech CSE • 3rd Year"
            className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
          Your Message &amp; Goals *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="I'm working on a campus startup and would love your advice on product validation, architecture, and pitch preparation..."
          className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-pill-primary text-xs py-3 px-6 font-semibold disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
      >
        <span>{status === 'loading' ? 'Sending Request...' : 'Send Mentorship Request'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  )
}
