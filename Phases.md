# Project Phases - UIET E-CELL

Since this is a comprehensive platform, development must be broken down into manageable phases. The AI should focus on completing one phase entirely before moving to the next.

## Phase 1: Foundation & Authentication (Current)
- Setup Next.js, Tailwind CSS, shadcn/ui.
- Initialize Supabase project and configure environment variables.
- Implement basic layout (Navbar, Footer, responsive shell).
- Implement Supabase Auth (Sign Up, Log In, Log Out) using `@supabase/ssr`.
- Create Next.js Middleware to protect authenticated routes.
- Setup basic landing page (`/`).

## Phase 2: User Profiles & Role Management
- Create `users` table in Supabase and link it to Auth triggers.
- Build the User Profile page (View & Edit info like Name, Branch, Year, Bio, LinkedIn).
- Implement basic Role-Based Access Control (Admin vs. Student).
- Build a simple Admin dashboard skeleton.

## Phase 3: Events Management System
- Define `events` schema and RLS policies in Supabase.
- Build Admin UI to Create/Edit/Delete events.
- Build Public UI to list upcoming and past events.
- Implement Event Details page.
- (Optional) Allow students to "Register" or RSVP for events.

## Phase 4: Startup Directory & Resources
- Define `startups` and `resources` schemas.
- Build a showcase page for UIET student startups.
- Build a resource library page (links, PDFs, templates).
- Allow admins to easily upload/manage resources and startups.

## Phase 5: Mentorship Hub
- Define `mentors` (linked to users) and `mentorship_requests` schemas.
- Build directory of mentors/alumni.
- Implement a form for students to request a session/guidance from a mentor.
- Create a dashboard view for mentors to accept/decline requests.

## Phase 6: Polish, SEO & Launch
- Finalize UI/UX design (colors, typography).
- Add loading skeletons, empty states, and toast notifications for all actions.
- SEO optimization (Metadata, OpenGraph tags).
- Thorough testing of mobile responsiveness.
- Final deployment checks on Vercel.
