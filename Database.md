# Database Schema & RLS Rules - UIET E-CELL (Supabase)

This project uses Supabase (PostgreSQL). Below is the intended schema structure and Row Level Security (RLS) definitions.

## 1. Tables

### `users` (Profiles)
Stores extended profile data for authenticated users.
- `id` (uuid, primary key, references `auth.users(id)`)
- `role` (text: 'student', 'mentor', 'admin', default: 'student')
- `full_name` (text)
- `avatar_url` (text, nullable)
- `branch` (text, nullable) - e.g., CSE, ECE
- `graduation_year` (int, nullable)
- `bio` (text, nullable)
- `linkedin_url` (text, nullable)
- `created_at` (timestamp)

### `events`
Stores E-Cell events, workshops, hackathons.
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `date` (timestamp)
- `location` (text)
- `registration_link` (text, nullable)
- `image_url` (text, nullable)
- `created_at` (timestamp)

### `startups`
Directory of student startups.
- `id` (uuid, primary key)
- `founder_id` (uuid, references `users(id)`)
- `name` (text)
- `tagline` (text)
- `description` (text)
- `website_url` (text, nullable)
- `logo_url` (text, nullable)
- `created_at` (timestamp)

### `resources`
Curated links/files for entrepreneurship.
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `url` (text)
- `category` (text) - e.g., 'Pitch Deck', 'Roadmap', 'Tools'
- `created_at` (timestamp)

### `mentorship_requests`
Requests from students to mentors.
- `id` (uuid, primary key)
- `student_id` (uuid, references `users(id)`)
- `mentor_id` (uuid, references `users(id)`)
- `message` (text)
- `status` (text: 'pending', 'accepted', 'declined', default: 'pending')
- `created_at` (timestamp)

## 2. Row Level Security (RLS) Policies

All tables MUST have RLS enabled.

**`users`**:
- SELECT: Public (Anyone can view profiles).
- INSERT/UPDATE: Authenticated users can only update their own row (`auth.uid() = id`). Admin can update all.

**`events` & `resources`**:
- SELECT: Public (Anyone can view).
- INSERT/UPDATE/DELETE: Only Admin role can modify.

**`startups`**:
- SELECT: Public (Anyone can view).
- INSERT/UPDATE: Founder (`auth.uid() = founder_id`) or Admin.
- DELETE: Founder or Admin.

**`mentorship_requests`**:
- SELECT: Students can see their own requests (`auth.uid() = student_id`). Mentors can see requests sent to them (`auth.uid() = mentor_id`).
- INSERT: Authenticated users (Students).
- UPDATE: Mentor can update status of requests directed to them.

## 3. Storage Buckets
- `avatars`: Public read, authenticated users can upload their own.
- `event_posters`: Public read, admins can upload.
- `startup_logos`: Public read, founders can upload.
