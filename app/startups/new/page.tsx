'use client'

import { useState } from 'react'
import { submitPublicStartup } from './actions'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function PublicNewStartupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setErrorMsg('')

    const result = await submitPublicStartup(formData)

    if (result?.error) {
      setErrorMsg(result.error)
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 pb-20">
      <Link
        href="/startups"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-secondary hover:text-orange-accent mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Startup Directory</span>
      </Link>

      <div className="card-warm p-6 sm:p-10 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-secondary border border-warm text-orange-accent text-[11px] font-bold tracking-wider uppercase mb-3">
          <span>E-CELL | UIET MDU ROHTAK • STUDENT-LED VENTURES</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-warm-primary mb-2">
          Submit Your Startup
        </h1>
        <p className="text-xs sm:text-sm text-warm-secondary mb-8 leading-relaxed">
          List your student-led venture or campus project in the E-Cell | UIET MDU Rohtak directory. Submissions are reviewed by the E-Cell Admin Board before appearing publicly.
        </p>

        {status === 'success' ? (
          <div className="p-8 bg-[#3E8F5A]/10 border border-[#3E8F5A]/30 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#3E8F5A] mx-auto" />
            <h2 className="text-lg font-extrabold text-warm-primary">
              Startup Submitted for Review!
            </h2>
            <p className="text-xs sm:text-sm text-warm-secondary max-w-md mx-auto leading-relaxed">
              Thank you for submitting your venture. Once verified by the E-Cell Admin team, it will be published in the public Startup Directory.
            </p>
            <div className="pt-2">
              <Link
                href="/startups"
                className="btn-pill-primary text-xs px-5 py-2.5 font-semibold"
              >
                <span>Return to Startup Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-5">
            {/* Honeypot anti-spam field */}
            <input
              type="text"
              name="website_hp"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {errorMsg && (
              <div className="p-3.5 bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                  Startup / Venture Name *
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. AgroPulse IoT"
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                  Short Tagline *
                </label>
                <input
                  required
                  type="text"
                  name="tagline"
                  placeholder="e.g. Smart crop diagnostics for farmers"
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                What are you building? (Description) *
              </label>
              <textarea
                required
                name="description"
                rows={4}
                placeholder="Describe the problem you solve, your product/MVP, and traction or co-founder needs..."
                className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                  Founder Name(s) *
                </label>
                <input
                  required
                  type="text"
                  name="founderName"
                  placeholder="e.g. Aarav Deswal"
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                  Founder Email *
                </label>
                <input
                  required
                  type="email"
                  name="founderEmail"
                  placeholder="founder@uiet.mdu.ac.in"
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                  Branch &amp; Year / Batch
                </label>
                <input
                  type="text"
                  name="founderBranch"
                  placeholder="e.g. B.Tech CSE • 3rd Year"
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-warm-primary mb-1.5">
                  Website / Demo Link (Optional)
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  placeholder="https://yourstartup.com"
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-warm flex justify-end">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-pill-primary text-xs px-6 py-3 font-semibold disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {status === 'loading' ? 'Submitting Venture...' : 'Submit Startup for Review'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
