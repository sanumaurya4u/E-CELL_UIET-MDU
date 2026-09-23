'use client'

import { useState } from 'react'
import { submitRsvp } from './actions'

export default function RsvpForm({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    const result = await submitRsvp(eventId, formData)
    
    if (result.error) {
      setStatus('error')
      setMessage(result.error)
    } else {
      setStatus('success')
      setMessage('Successfully registered for the event!')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-sm font-medium">
        {message}
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
        <input 
          type="text" 
          id="fullName" 
          name="fullName" 
          required 
          className="w-full rounded-md px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          className="w-full rounded-md px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com"
        />
      </div>
      
      {status === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting...' : 'Confirm RSVP'}
      </button>
    </form>
  )
}
