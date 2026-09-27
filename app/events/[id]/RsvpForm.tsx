'use client'

import { useState } from 'react'
import { submitRsvp } from './actions'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function RsvpForm({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setMessage('')
    const result = await submitRsvp(eventId, formData)

    if (result.error) {
      setStatus('error')
      setMessage(result.error)
    } else {
      setStatus('success')
      setMessage('Your registration is confirmed! No account or login needed.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center p-5 bg-[#3E8F5A]/10 border border-[#3E8F5A]/30 text-[#2f7a1d] dark:text-[#79d45e] rounded-2xl text-xs font-semibold space-y-2">
        <CheckCircle2 className="w-6 h-6 mx-auto" />
        <div className="text-sm font-bold">Registration Confirmed!</div>
        <p className="font-normal leading-relaxed">{message}</p>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-3.5">
      {/* Honeypot anti-spam field */}
      <input
        type="text"
        name="website_hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label
          htmlFor="fullName"
          className="block text-[11px] font-bold uppercase tracking-wider text-warm-primary mb-1"
        >
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          required
          minLength={2}
          maxLength={100}
          className="w-full rounded-xl px-3.5 py-2.5 bg-warm-secondary border border-warm text-xs text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
          placeholder="e.g. Rohan Verma"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-[11px] font-bold uppercase tracking-wider text-warm-primary mb-1"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-xl px-3.5 py-2.5 bg-warm-secondary border border-warm text-xs text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-[11px] font-bold uppercase tracking-wider text-warm-primary mb-1"
        >
          Phone / WhatsApp *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="w-full rounded-xl px-3.5 py-2.5 bg-warm-secondary border border-warm text-xs text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label
            htmlFor="branch"
            className="block text-[11px] font-bold uppercase tracking-wider text-warm-primary mb-1"
          >
            Branch &amp; Year
          </label>
          <input
            type="text"
            id="branch"
            name="branch"
            className="w-full rounded-xl px-3 py-2 bg-warm-secondary border border-warm text-xs text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
            placeholder="CSE 2nd Yr"
          />
        </div>
        <div>
          <label
            htmlFor="rollNo"
            className="block text-[11px] font-bold uppercase tracking-wider text-warm-primary mb-1"
          >
            Roll / Reg No
          </label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            className="w-full rounded-xl px-3 py-2 bg-warm-secondary border border-warm text-xs text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
            placeholder="24CSE012"
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 font-medium">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full btn-pill-primary py-2.5 px-4 text-xs font-semibold justify-center disabled:opacity-50 cursor-pointer"
      >
        <span>{status === 'loading' ? 'Registering...' : 'Register Now (No Login)'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  )
}
