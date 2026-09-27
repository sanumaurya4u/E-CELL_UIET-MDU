# Database Schema & RLS Rules - UIET E-CELL (Supabase)

This project uses Supabase (PostgreSQL) with a **PUBLIC VISITOR + ADMIN ONLY** access model:
- **Public Visitors / Students**: Can browse all public content (`events`, `announcements`, `resources`, approved `startups`, `users` where `role = 'mentor'`, `site_images`, `site_blocks`) and submit public forms (`event_rsvps`, `startups` with `status = 'pending'`, `mentorship_requests`, `applications`) **without logging in or creating an account**.
- **Admin Users (`role = 'admin'`)**: Are the only authenticated users who access `/admin` and perform content management (`INSERT`, `UPDATE`, `DELETE`, moderation, and storage uploads).

---

## 1. Helper Function

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
```

---

## 2. Tables

### `users` (Admin Profiles & Mentor Directory)
Stores Admin profiles (linked to `auth.users(id)`) and Admin-managed Mentor profiles (`role = 'mentor'`).
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `role` (text: `'student'`, `'mentor'`, `'admin'`, default: `'student'`)
- `full_name` (text)
- `avatar_url` (text, nullable)
- `branch` (text, nullable) — e.g., CSE, ECE, Industry Expert
- `graduation_year` (int, nullable)
- `bio` (text, nullable)
- `linkedin_url` (text, nullable)
- `created_at` (timestamptz)

### `events`
Stores E-Cell events, workshops, and hackathons.
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `title` (text)
- `description` (text)
- `date` (timestamptz)
- `location` (text)
- `registration_link` (text, nullable)
- `image_url` (text, nullable)
- `created_at` (timestamptz)

### `event_rsvps`
Stores public visitor registrations for events (no login required).
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `event_id` (uuid, references `events(id)` ON DELETE CASCADE)
- `full_name` (text)
- `email` (text)
- `phone` (text, nullable)
- `branch` (text, nullable)
- `roll_no` (text, nullable)
- `created_at` (timestamptz)
- **Constraint**: Unique index on `(event_id, lower(trim(email)))` to prevent duplicate registrations.

### `announcements`
Stores Admin-managed notices, recruitment updates, and pinned top banners.
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `title` (text)
- `content` (text)
- `category` (text, default `'Notice'`) — e.g., `'Notice'`, `'Event'`, `'Recruitment'`, `'Opportunity'`, `'Urgent'`
- `link_url` (text, nullable)
- `link_text` (text, nullable)
- `is_pinned` (boolean, default `false`)
- `is_active` (boolean, default `true`)
- `created_at` (timestamptz)

### `resources`
Curated links, templates, and guides for entrepreneurship.
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `title` (text)
- `description` (text)
- `url` (text)
- `category` (text) — e.g., `'Pitch Decks & Templates'`, `'Free Tools / Software Credits'`, `'Funding & Grants Guides'`, `'Legal & Incorporation'`
- `created_at` (timestamptz)

### `startups`
Directory of student startups (Admin-created or submitted by public visitors for Admin approval).
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `founder_id` (uuid, nullable, references `users(id)` ON DELETE SET NULL)
- `founder_name` (text, nullable)
- `founder_email` (text, nullable)
- `founder_branch` (text, nullable)
- `name` (text)
- `tagline` (text)
- `description` (text)
- `website_url` (text, nullable)
- `logo_url` (text, nullable)
- `status` (text: `'pending'`, `'approved'`, `'rejected'`, default: `'pending'`)
- `created_at` (timestamptz)

### `mentorship_requests`
Public requests from students/visitors to mentors (no login required).
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `student_id` (uuid, nullable, references `users(id)` ON DELETE SET NULL)
- `mentor_id` (uuid, references `users(id)` ON DELETE CASCADE)
- `student_name` (text)
- `student_email` (text)
- `student_phone` (text, nullable)
- `student_branch` (text, nullable)
- `message` (text)
- `status` (text: `'pending'`, `'accepted'`, `'declined'`, default: `'pending'`)
- `created_at` (timestamptz)

### `site_images`
Admin-managed campus gallery and website images.
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `title` (text)
- `category` (text, default `'Events'`) — e.g., `'Events'`, `'Competitions'`, `'Workshops'`, `'Team'`, `'Homepage'`
- `image_url` (text)
- `description` (text, nullable)
- `display_order` (int, default `0`)
- `is_active` (boolean, default `true`)
- `created_at` (timestamptz)

### `site_blocks`
Dynamic homepage and site-wide content blocks (`stats`, `hero_spotlight`, `site_info`).
- `key` (text, primary key)
- `data` (jsonb)
- `updated_at` (timestamptz)

### `applications`
Public E-Cell team recruitment / contact submissions (no login required).
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `name` (text)
- `enrollment` (text, nullable)
- `email` (text)
- `phone` (text, nullable)
- `branch_year` (text, nullable)
- `dept_interest` (text, nullable)
- `why_join` (text, nullable)
- `linkedin` (text, nullable)
- `status` (text, default `'Pending'`)
- `created_at` (timestamptz)

### `blogs`
Stores E-Cell blog articles, campus stories, event recaps, and curated industry insights.
- `id` (uuid, primary key, default `gen_random_uuid()`)
- `title` (text)
- `slug` (text, unique)
- `excerpt` (text)
- `content` (text — Markdown formatted article content)
- `cover_image_url` (text, nullable)
- `additional_images` (text[], default `'{}'`)
- `category` (text, default `'General'`)
- `tags` (text[], default `'{}'`)
- `author_name` (text, default `'E-Cell UIET MDU'`)
- `author_designation` (text, nullable)
- `source_url` (text, nullable)
- `source_name` (text, nullable)
- `published_at` (timestamptz, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- `status` (text: `'draft'`, `'published'`, `'archived'`, default `'draft'`)
- `is_featured` (boolean, default `false`)
- `reading_time` (int, default `3`)
- `seo_title` (text, nullable)
- `seo_description` (text, nullable)

---

## 3. Row Level Security (RLS) Policies

All tables MUST have RLS enabled.

- **`users`**:
  - `SELECT`: Public (`true`).
  - `INSERT / UPDATE / DELETE`: Admin (`public.is_admin()`) or user updating own profile (`auth.uid() = id`).
- **`events` & `resources`**:
  - `SELECT`: Public (`true`).
  - `INSERT / UPDATE / DELETE`: Strictly Admin (`public.is_admin()`).
- **`announcements` & `site_images`**:
  - `SELECT`: Public for active items (`is_active = true OR public.is_admin()`).
  - `INSERT / UPDATE / DELETE`: Strictly Admin (`public.is_admin()`).
- **`blogs`**:
  - `SELECT`: Public for published blogs (`status = 'published'`), Admin for all (`public.is_admin()`).
  - `INSERT / UPDATE / DELETE`: Strictly Admin (`public.is_admin()`).
- **`site_blocks`**:
  - `SELECT`: Public (`true`).
  - `INSERT / UPDATE / DELETE`: Strictly Admin (`public.is_admin()`).
- **`startups`**:
  - `SELECT`: Public for approved (`status = 'approved'`), Admin for all (`public.is_admin()`).
  - `INSERT`: Public visitors can insert only with `status = 'pending'` and valid required fields; Admin can insert any status.
  - `UPDATE / DELETE`: Strictly Admin (`public.is_admin()`).
- **`event_rsvps`, `mentorship_requests`, `applications`** (Private Public Form Submissions):
  - `INSERT`: Public (with non-empty validation checks).
  - `SELECT / UPDATE / DELETE`: Strictly Admin (`public.is_admin()`). Private registration/request data is NEVER publicly readable.

---

## 4. Storage Buckets & Policies
- `event_posters`: Public read (`SELECT`), Admin-only upload/update/delete (`public.is_admin()`).
- `startup_logos`: Public read (`SELECT`), Admin-only upload/update/delete (`public.is_admin()`).
- `site_images`: Public read (`SELECT`), Admin-only upload/update/delete (`public.is_admin()`).
- `blog-images`: Public read (`SELECT`), Admin-only upload/update/delete (`public.is_admin()`).

