'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { submitStartup } from './actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewStartupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [file, setFile] = useState<File | null>(null)
  
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    
    const formData = new FormData(e.currentTarget)
    let logoUrl = ''

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('startup_logos')
        .upload(fileName, file)

      if (uploadError) {
        setErrorMsg('Failed to upload logo: ' + uploadError.message)
        setIsSubmitting(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('startup_logos')
        .getPublicUrl(fileName)
        
      logoUrl = publicUrlData.publicUrl
    }

    formData.set('logoUrl', logoUrl)

    const result = await submitStartup(formData)
    
    if (result?.error) {
      setErrorMsg(result.error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 mb-20">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Submit Your Startup</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Your startup will be reviewed by an admin before appearing in the public directory.</p>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Startup Name *</label>
            <input required type="text" name="name" className="w-full rounded-md px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tagline *</label>
            <input required type="text" name="tagline" placeholder="e.g. AI-powered note taking" className="w-full rounded-md px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea required name="description" rows={5} className="w-full rounded-md px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700"></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL (Optional)</label>
            <input type="url" name="websiteUrl" placeholder="https://" className="w-full rounded-md px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Logo (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Startup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
