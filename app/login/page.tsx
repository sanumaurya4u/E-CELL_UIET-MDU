import Link from 'next/link'
import Image from 'next/image'
import { login } from '@/app/auth/actions'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const resolvedParams = await searchParams

  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:max-w-md justify-center mx-auto pt-14 pb-20">
      <div className="text-center mb-8">
        <div className="h-12 px-3.5 rounded-xl bg-white border border-warm inline-flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <Image
            src="/logo.png"
            alt="E-Cell | UIET MDU Rohtak"
            width={96}
            height={46}
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="block">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-secondary border border-warm text-orange-accent text-[11px] font-bold tracking-wider uppercase mb-2">
            <span>E-CELL | UIET MDU ROHTAK · ADMIN PORTAL</span>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-warm-primary">
          Admin Sign In
        </h1>
        <p className="text-xs text-warm-secondary mt-1.5 max-w-xs mx-auto leading-relaxed">
          Sign in with your authorized E-Cell | UIET MDU Rohtak administrator credentials to manage website content.
        </p>
      </div>

      <div className="card-warm p-7 sm:p-8 shadow-xs">
        <form className="flex flex-col gap-4" action={login}>
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-bold uppercase tracking-wider text-warm-primary"
              htmlFor="email"
            >
              Admin Email
            </label>
            <input
              id="email"
              className="rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
              name="email"
              placeholder="admin@uiet.mdu.ac.in"
              required
              type="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-bold uppercase tracking-wider text-warm-primary"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              className="rounded-xl px-4 py-2.5 bg-warm-secondary border border-warm text-sm text-warm-primary placeholder:text-warm-muted focus:outline-none focus:border-orange-accent transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button className="btn-pill-primary w-full py-3 mt-3 text-sm font-semibold cursor-pointer">
            <span>Sign In to Admin Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {resolvedParams?.message && (
            <p className="mt-2 p-3 bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30 text-center rounded-xl text-xs font-medium">
              {resolvedParams.message}
            </p>
          )}
        </form>

        <div className="mt-6 pt-4 border-t border-warm text-center">
          <p className="text-[11px] text-warm-muted leading-relaxed">
            Students and visitors do not need an account to browse events, resources, startups, or register for activities.
          </p>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-secondary hover:text-orange-accent transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>
      </div>
    </div>
  )
}
