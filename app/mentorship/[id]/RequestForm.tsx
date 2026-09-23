'use client'

import { useState } from 'react'
import { submitMentorshipRequest } from './actions'
import { ArrowRight } from 'lucide-react'

export default function RequestForm({ mentorId, studentId }: { mentorId: string, studentId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    await submitMentorshipRequest(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="mentorId" value={mentorId} />
      <input type="hidden" name="studentId" value={studentId} />
      
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
          Your Message &amp; Goals
        </label>
        <textarea 
          name="message" 
          required 
          rows={5}
          placeholder="I'm working on a tech startup and would love your advice on navigating validation and architecture..."
          className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-pill-primary text-xs py-2.5 px-6 font-semibold disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
      >
        <span>{isSubmitting ? 'Sending Request...' : 'Send Mentorship Request'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </form>
  )
}
