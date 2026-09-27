# 🧠 AI Project Memory (`memory.md`) — UIET E-CELL Platform

> **PURPOSE FOR AI AGENTS**: Read this file FIRST before scanning the repository. It tracks the exact architecture, file map, database schema, design system tokens, completed work, and pending tasks so you do not waste tokens re-reading the codebase or hallucinating paths/tables.
> **MAINTENANCE RULE**: Update this file whenever you add/modify routes, components, database tables, or complete items in `Phases.md`.

**Last Updated**: 2026-09-27

---

## 1. Project Identity, Access Model & Core Stack

- **Project**: UIET E-CELL Platform (Entrepreneurship Cell, UIET MDU Rohtak)
- **Access Model**: **PUBLIC VISITOR + ADMIN ONLY**
  - **Public Visitors / Students**: 100% open access without login or signup. Can browse all pages (`/`, `/events`, `/events/[id]`, `/startups`, `/mentorship`, `/mentorship/[id]`, `/resources`, `/about`, `/team`, `/contact`) and submit public forms (Event RSVP, Startup Submission, Mentorship Request, Recruitment Application) without creating an account.
  - **Admin (`role === 'admin'`)**: The only role that authenticates via `/login` (linked discreetly in the Footer) to access `/admin` and manage website content. Enforced via Middleware (`proxy.ts` + `lib/supabase/middleware.ts`), Server Actions (`app/admin/actions.ts` `requireAdmin()`), and Supabase RLS (`public.is_admin()`).
- **Framework**: **Next.js 16.3.1** (App Router), **React 19.2.8**, **TypeScript 6.0.3**
- **Styling**: **Tailwind CSS v4** (`@import 'tailwindcss';` in `app/globals.css`) + CSS custom variables (Warm Editorial Campus theme)
- **Backend / Auth / Storage**: **Supabase** (`@supabase/ssr` `^0.12.7` & `@supabase/supabase-js` `^2.112.3`)

### ⚠️ Critical Next.js 16 Conventions in This Repo
1. **Read `AGENTS.md`**: This repo uses Next.js 16.3.1.
2. **Middleware / Proxy**: Route protection is in `proxy.ts` (calling `updateSession` from `lib/supabase/middleware.ts`), NOT `middleware.ts`.
3. **Async Dynamic APIs**: In Next.js 16, `cookies()`, `headers()`, `params`, and `searchParams` are asynchronous (`Promise<...>`). Always `await` them in Server Components and Server Actions.

---

## 2. Complete Repository File Map

### `app/` (Routes & Server Actions)
- `app/layout.tsx` — Root layout (`Inter` font, `Navbar` with pinned announcement banner, `Footer` with discreet Admin Login link, `.bg-warm-bg`).
- `app/globals.css` — Tailwind v4 config, Warm Editorial design tokens, button/card/badge primitives.
- `app/page.tsx` — Editorial Landing Page fetching active `announcements`, `site_images`, and dynamic `site_blocks` (`stats`, `hero_spotlight`, `site_info`).
- `app/auth/actions.ts` — Server Actions: `login` (strictly verifies `users.role === 'admin'`), `signout`, and disabled `signup`.
- `app/login/page.tsx` — Protected E-Cell Admin Portal Login page.
- `app/signup/page.tsx`, `app/dashboard/page.tsx`, `app/profile/page.tsx` — Redirects to `/` (retired student account routes).
- `app/events/page.tsx` — Public Events directory (splits Upcoming vs. Past events from Supabase `events` table).
- `app/events/[id]/page.tsx`, `RsvpForm.tsx`, `actions.ts` — Event detail page + public no-login RSVP form (`submitRsvp` into `event_rsvps` with duplicate email check & honeypot protection).
- `app/startups/page.tsx` — Public Startup Directory (`startups` where `status = 'approved'`).
- `app/startups/new/page.tsx` & `actions.ts` — Public no-login Startup Submission form (`submitPublicStartup` inserts with `status = 'pending'`).
- `app/mentorship/page.tsx` — Public Mentorship Hub (`users` where `role = 'mentor'`).
- `app/mentorship/[id]/page.tsx`, `RequestForm.tsx`, `actions.ts` — Public no-login Mentorship Request page (`submitMentorshipRequest` into `mentorship_requests`).
- `app/resources/page.tsx` & `ResourcesClient.tsx` — Public Resource Library with category filtering.
- `app/contact/page.tsx` & `actions.ts` — Public Recruitment / Contact page (`submitApplication` into `applications`).
- `app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/AdminCmsClient.tsx`, `app/admin/actions.ts` — Unified Server-Verified Admin CMS managing Events & RSVPs, Announcements, Resources, Startups, Mentors & Requests, Website Images, Homepage Blocks, and Applications.
- `app/about/page.tsx`, `app/team/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx` — Informational & legal pages.

---

## 3. Database Schema & RLS State (`Database.md`)

1. **`public.is_admin()`**: `SECURITY DEFINER` SQL helper checking `EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')`.
2. **Public Read + Admin Write Tables**: `events`, `announcements`, `resources`, `site_images`, `site_blocks`, `users` (mentors).
3. **Public Insert + Admin Read/Manage Tables (Private Submissions)**: `event_rsvps`, `mentorship_requests`, `applications`.
4. **Moderated Directory Table**: `startups` (Public `SELECT` where `status = 'approved'`, Public `INSERT` where `status = 'pending'`, Admin `ALL`).
5. **Storage Buckets**: `event_posters`, `startup_logos`, `site_images` (Public `SELECT`, Admin-only `INSERT`/`UPDATE`/`DELETE`).
