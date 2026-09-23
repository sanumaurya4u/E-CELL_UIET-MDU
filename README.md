# UIET E-Cell

Official site for the Entrepreneurship Cell of UIET, Maharshi Dayanand University, Rohtak — built with Next.js, Tailwind CSS, and Supabase.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Supabase** for live data (events, team, sponsors, stats, applications) and admin authentication
- **GSAP** for scroll-driven animation

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin

The `/admin` route is a CMS-style dashboard for managing events, team members, gallery photos, partners, homepage stats, site settings, and membership applications. It authenticates against Supabase with a local fallback, and every save persists directly to the Supabase tables that `DataProvider` reads on page load.

## Build

```bash
npm run build
```
