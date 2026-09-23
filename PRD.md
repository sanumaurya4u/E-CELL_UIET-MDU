# Product Requirements Document (PRD) - UIET E-CELL

## 1. Project Overview
**Name**: UIET E-CELL Platform
**Objective**: Build a centralized, digital platform for the Entrepreneurship Cell of UIET (MDU). It aims to foster innovation, connect students with mentors/alumni, and provide a single hub for all entrepreneurial activities, events, and resources.
**Budget Strategy**: Zero-budget. All infrastructure will rely on generous free tiers (Vercel, Supabase, GitHub).

## 2. Target Users
- **Students / Aspiring Entrepreneurs**: Looking for guidance, team members, resources, and event updates.
- **Alumni / Mentors**: Willing to guide students, share experiences, and offer expertise.
- **Investors / Industry Experts**: Looking for promising student startups to support or fund.
- **E-Cell Organizers / Admins**: Managing events, content, and user connections on the platform.

## 3. Core Features (MVP)
1. **Authentication & Profiles**:
   - Secure Login/Signup (Email, Google) via Supabase Auth.
   - User roles (Student, Mentor, Admin).
   - Profile management (Skills, Startup Idea, LinkedIn, GitHub).
2. **Event Management**:
   - Centralized calendar/list of upcoming workshops, hackathons, and speaker sessions.
   - Registration functionality for events.
3. **Startup Directory (Showcase)**:
   - A space where UIET student startups can list their projects, seek co-founders, or request feedback.
4. **Mentorship Hub**:
   - A directory of available alumni and mentors.
   - A system for students to request a mentoring session or ask questions.
5. **Resource Library**:
   - Curated list of free tools, pitch deck templates, startup guides, and roadmaps.
6. **Notice Board & Announcements**:
   - Admin-managed announcements for immediate updates.

## 4. Non-Functional Requirements
- **Responsive Design**: Must be perfectly usable on mobile devices, as students primarily use phones.
- **Performance**: Fast load times using Next.js Server Components.
- **Cost**: $0 operational cost. Must stay within Supabase Free Tier (500MB DB, 50k MAU) and Vercel Hobby Tier.
