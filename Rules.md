# AI Coding Rules & Boundaries - UIET E-CELL

## 1. Allowed Technologies
- **DO USE**: Next.js App Router (`app/` directory), React, Tailwind CSS, shadcn/ui.
- **DO USE**: Supabase for all backend needs (PostgreSQL, Auth, Storage). Use `@supabase/ssr` for Next.js integration.
- **DO USE**: Lucide React for icons.
- **DO USE**: TypeScript for all new files. Maintain strict typing.
- **DO AVOID**: Next.js legacy Pages Router (`pages/` directory).
- **DO AVOID**: Any paid third-party APIs, SaaS, or libraries that do not have a robust free tier suitable for a student project.
- **DO AVOID**: Heavy client-side state management (like Redux) unless absolutely necessary. Rely on React state, Context API, and server-side data fetching first.

## 2. File & Directory Rules
- Keep all UI components in the `components/` directory.
- `shadcn/ui` components should go into `components/ui/`.
- Custom, complex components go into `components/shared/` or feature-specific folders.
- All Supabase connection logic and helper functions must be localized in `lib/supabase/`.
- Define TypeScript interfaces reflecting database schemas in a `types/` folder (or generate them via Supabase CLI).

## 3. Security & Data Fetching
- **Server First**: Default to Next.js Server Components for data fetching to protect API keys and reduce bundle size.
- **Route Protection**: Use `middleware.ts` combined with Supabase Auth to protect private routes (`/dashboard`, `/profile`).
- **Data Mutation**: Use Next.js Server Actions for form submissions and data mutations. Do not use standard API routes (`app/api/`) unless building a public API endpoint or webhook receiver.
- **RLS**: Never bypass Supabase Row Level Security (RLS) on the client side. Ensure RLS policies are strictly defined for all tables.

## 4. Error Handling & AI Behavior
- **Graceful Degradation**: Always handle Supabase fetch errors. Display user-friendly error messages (e.g., using `shadcn` Toast component) rather than crashing the app.
- **No Hallucinations**: Do not assume the existence of database tables or columns. Refer to `Database.md` strictly. If a table change is needed, it must be planned and agreed upon first.
- **Incremental Changes**: Build features step-by-step. Do not attempt to write the entire app in one prompt. Follow `Phases.md`.
- **Clean Code**: Remove unused imports, format code properly, and use descriptive variable names.
