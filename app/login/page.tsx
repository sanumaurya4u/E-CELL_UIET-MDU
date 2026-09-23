import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { Rocket, ArrowRight } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const resolvedParams = await searchParams

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:max-w-md justify-center mx-auto pt-14 pb-20">
      
      <div className="text-center mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#211B17] text-white flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <Rocket className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-warm-primary">Welcome back</h1>
        <p className="text-sm text-warm-secondary mt-1">Log in to your UIET E-Cell account</p>
      </div>

      <div className="card-warm p-7 sm:p-8 shadow-xs">
        <form className="flex flex-col gap-4" action={login}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-warm-primary" htmlFor="email">
              Email Address
            </label>
            <input
              className="rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-warm-primary" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button className="btn-pill-primary w-full py-3 mt-3 text-sm font-semibold cursor-pointer">
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {resolvedParams?.message && (
            <p className="mt-2 p-3 bg-red-100 text-red-700 border border-red-200 text-center rounded-xl text-xs font-medium">
              {resolvedParams.message}
            </p>
          )}
        </form>
      </div>

      <p className="text-xs text-center text-warm-secondary mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-warm-primary hover:text-orange-accent transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  )
}
