import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from './actions'
import { avatarUrl } from '@/lib/utils'
import Image from 'next/image'
import { Sparkles, ArrowRight } from 'lucide-react'

const BRANCHES = [
  'CSE (Computer Science)',
  'ECE (Electronics & Communication)',
  'ME (Mechanical Engineering)',
  'Civil Engineering',
  'Biotech',
  'Electrical Engineering'
]

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's extended profile from the `users` table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  async function handleUpdate(formData: FormData) {
    'use server'
    await updateProfile(formData)
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 mb-20">
      <div className="card-warm overflow-hidden shadow-xs">
        
        {/* Profile Header Banner */}
        <div className="bg-[#120F0D] border-b border-warm h-32 relative">
          <div className="absolute top-4 right-4">
            <span className="badge-pill bg-[#1D1815] border-[#39322C] text-orange-accent text-[11px] font-bold">
              {profile?.role === 'admin' ? 'ORGANIZER / ADMIN' : 'VERIFIED STUDENT'}
            </span>
          </div>
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 rounded-full border-4 border-warm-surface overflow-hidden bg-warm-secondary shadow-xs">
              <Image 
                src={avatarUrl(profile?.full_name || user.email)} 
                alt="Avatar" 
                width={80} 
                height={80} 
                className="object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-14 px-6 sm:px-8 pb-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-accent uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIGITAL INNOVATION PASSPORT</span>
            </div>
            <h1 className="text-2xl font-extrabold text-warm-primary">
              {profile?.full_name || 'Campus Innovator'}
            </h1>
            <p className="text-xs text-warm-muted">
              {user.email}
            </p>
          </div>

          <form action={handleUpdate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-warm-primary">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  defaultValue={profile?.full_name || ''}
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-warm-primary">Graduation Year</label>
                <input 
                  type="number" 
                  name="graduationYear"
                  min="2020" max="2035"
                  defaultValue={profile?.graduation_year || ''}
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-warm-primary">Branch / Major</label>
                <select 
                  name="branch" 
                  defaultValue={profile?.branch || ''}
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary focus:outline-none focus:border-orange-accent transition-colors"
                >
                  <option value="">Select your branch</option>
                  {BRANCHES.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-warm-primary">LinkedIn URL</label>
                <input 
                  type="url" 
                  name="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  defaultValue={profile?.linkedin_url || ''}
                  className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-warm-primary">Bio / Startup Idea</label>
              <textarea 
                name="bio"
                rows={3}
                placeholder="Tell us about your interests, technical skills, or venture idea..."
                defaultValue={profile?.bio || ''}
                className="w-full rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-warm">
              <button 
                type="submit"
                className="btn-pill-primary text-xs py-2.5 px-6 font-semibold cursor-pointer"
              >
                <span>Save Changes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
