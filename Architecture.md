# System Architecture - UIET E-CELL

## 1. High-Level Architecture & App Flow
1. **Client Layer (Browser/Mobile)**: User interacts with the UI. Next.js serves static/dynamic pages.
2. **Application Layer (Next.js App Router)**: Handles routing, Server-Side Rendering (SSR), API routes, and Server Actions for form submissions.
3. **Data/Auth Layer (Supabase)**: Handles user authentication, PostgreSQL database queries via PostgREST, and file storage (profile pics, event posters).

**Typical Flow**: 
User visits site -> Next.js checks Auth via Supabase SSR Cookies -> Middleware protects secure routes -> User views dashboard -> Server Actions fetch data directly from Supabase DB -> UI rendered.

## 2. Technology Stack (Free Tier Optimized)
- **Frontend Framework**: Next.js (App Router)
- **UI Library / Styling**: React, Tailwind CSS
- **Component Library**: shadcn/ui (Free, accessible, unstyled components built with Radix UI)
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL, GoTrue Auth, Row Level Security)
- **Hosting**: Vercel (Frontend), Supabase Cloud (Backend)
- **Version Control**: GitHub

## 3. Folder Structure (Next.js App Router)
```text
c:\E-CELL_UIET-MDU\
├── app/                  # Next.js App Router (Pages, Layouts, API routes)
│   ├── (auth)/           # Login, Register, Forgot Password
│   ├── (dashboard)/      # Protected routes (Profile, Mentorship)
│   ├── events/           # Public events pages
│   ├── api/              # Next.js API routes (if webhooks needed)
│   ├── layout.tsx        # Root layout (Providers, Navbar, Footer)
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui base components (buttons, inputs)
│   ├── layout/           # Navbar, Footer, Sidebar
│   └── shared/           # Cards, modals used across pages
├── lib/                  # Utility functions
│   ├── supabase/         # Supabase client configurations (browser, server)
│   └── utils.ts          # Tailwind merge utilities (clsx, twMerge)
├── types/                # TypeScript interface definitions (Supabase DB types)
├── public/               # Static assets (images, logos)
├── middleware.ts         # Next.js middleware for route protection (Supabase Auth)
└── ...config files (tailwind.config.ts, tsconfig.json, next.config.mjs)
```

## 4. Connection & Integration Strategy
- **Supabase SSR**: Use `@supabase/ssr` to securely manage auth sessions in Next.js Server Components, Server Actions, and Middleware.
- **Database Access**: Prefer fetching data in Next.js Server Components directly to reduce client-side JS and improve SEO. Pass initial data to Client Components if interactivity is needed.
- **Environment Variables**: Store `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` securely.
