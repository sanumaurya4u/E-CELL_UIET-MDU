# UIET E-CELL — Visual Design System & UI Guidelines

A comprehensive design specification for the UIET E-CELL platform, inspired by modern editorial technology aesthetics: warm off-white surfaces, deep warm dark mode, high-contrast typography, refined pill geometry, and vibrant burnt-orange accents.

> **CRITICAL RULE**: This design system strictly governs visual presentation, CSS, styling, layout hierarchy, and responsive aesthetics. All existing application logic, authentication, database schemas, APIs, routes, and UIET E-CELL content remain 100% intact.

---

## 1. Design Philosophy & Personality

- **Personality**: Premium, Modern, Editorial, Technical, Minimal, Trustworthy, Student-Friendly, Professional.
- **Visual Stance**: Feels like a world-class technology company and incubator platform rather than a generic university portal or cookie-cutter SaaS template.
- **Aesthetic Principles**:
  - **Generous Whitespace & Breathing Room**: Clean section padding, controlled content line widths, avoiding visual clutter.
  - **Editorial Typography**: Large, commanding headlines with selective burnt-orange emphasis words, balanced with crisp, highly legible body copy.
  - **Warm Humanist Tones**: Replacing cold generic slate/blue grays with warm, welcoming off-whites, creams, and earthy deep dark tones.
  - **Refined Geometry**: Rounded pill tags (`rounded-full`), balanced container radii (`16px`–`24px`), and ultra-clean 1px structural borders.
  - **Restrained Elevation**: No heavy neon dropshadows or distracting glassmorphism. Visual hierarchy is established through contrast, spacing, typography, and crisp borders.

---

## 2. Color System & Design Tokens

### Light Theme
- **Page Background**: `#F8F5EF` (Warm Cream / Off-White)
- **Primary Surface / Card**: `#FCFAF6` (Warm Pure Surface)
- **Secondary Surface**: `#F3EFE7` (Warm Tinted Surface)
- **Primary Text / Heading**: `#211B17` (Deep Ink Charcoal)
- **Secondary Text**: `#6F665E` (Warm Charcoal)
- **Muted Text / Metadata**: `#948A80` (Muted Warm Gray)
- **Border Subtle**: `#DDD6CC` (Thin Warm Neutral Border)
- **Primary Accent**: `#E96832` (Vibrant Burnt Orange)
- **Accent Hover / Dark**: `#D95725` (Deep Terracotta)
- **Accent Subtle BG**: `#FDF0EA` (Soft Orange Tint for Badges)
- **Success**: `#3E8F5A`
- **Warning**: `#C58A24`
- **Danger**: `#C94B45`

### Dark Theme
- **Page Background**: `#120F0D` (Warm Near-Black)
- **Primary Surface / Card**: `#171310` (Warm Dark Surface)
- **Secondary Surface**: `#1D1815` (Deep Dark Elevation)
- **Primary Text / Heading**: `#F5EFE5` (Warm Bone White)
- **Secondary Text**: `#C9BFB3` (Soft Beige Gray)
- **Muted Text / Metadata**: `#968C82` (Warm Muted Charcoal)
- **Border Subtle**: `#39322C` (Warm Deep Border)
- **Primary Accent**: `#F2763E` (Luminous Burnt Orange)
- **Accent Hover**: `#FF8750`
- **Accent Subtle BG**: `rgba(242, 118, 62, 0.12)` (Warm Orange Dark Tint)
- **Success**: `#4EAC6E`
- **Warning**: `#D89B36`
- **Danger**: `#DB5A54`

---

## 3. Typography Scale & Hierarchy

- **Primary Font**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
- **Optional Accent Serif**: `Instrument Serif`, `Georgia`, `serif` (used selectively for editorial emphasis or italics)
- **Scale**:
  - **Display (Hero Headline)**: `44px`–`72px` desktop / `32px`–`42px` mobile; `font-weight: 800` (Extrabold) or `700` (Bold); `letter-spacing: -0.035em`; `line-height: 1.06`.
  - **H1**: `36px`–`48px`; `font-weight: 700`; `letter-spacing: -0.025em`; `line-height: 1.15`.
  - **H2 (Section Headings)**: `28px`–`36px`; `font-weight: 700`; `letter-spacing: -0.02em`.
  - **H3 (Card Titles)**: `20px`–`24px`; `font-weight: 600` or `700`.
  - **H4 (Subheadings)**: `16px`–`18px`; `font-weight: 600`.
  - **Body**: `15px`–`16px`; `font-weight: 400`; `line-height: 1.6`.
  - **Small / Metadata**: `13px`–`14px`; `font-weight: 500`.
  - **Eyebrow / Overline**: `11px`–`12px`; `font-weight: 700`; `text-transform: uppercase`; `letter-spacing: 0.08em`.
- **Editorial Headline Treatment**:
  - Section headlines feature deliberate contrast: crisp dark ink words with key focal words colored in vibrant burnt orange (`#E96832` / `#F2763E`).
  - Text balance (`text-wrap: balance`) enabled on display headings to prevent awkward widows.

---

## 4. Component Design Language

### A. Navigation Bar
- **Appearance**: Floating or sticky header, ultra-clean, minimal, translucent with blur (`backdrop-blur-md`).
- **Surfaces**: Warm tinted background (`bg-[#F8F5EF]/90` light, `bg-[#120F0D]/90` dark) with a subtle bottom border (`border-[#DDD6CC]` / `border-[#39322C]`).
- **Links Container**: Centered pill group container (`rounded-full bg-black/5 dark:bg-white/5 p-1 border border-black/5 dark:border-white/10`).
- **Active Navigation Pill**: Active link presented inside a solid dark pill (`bg-[#211B17] text-white` in light mode, `bg-[#F5EFE5] text-[#120F0D]` in dark mode). Inactive links use clean hover states.
- **Branding**: Clean UIET E-CELL logo lockup with icon and optional orange campus badge.
- **Actions**: Discrete text link for Secondary ("Log in") + solid dark pill button for Primary ("Sign up" / "Join").

### B. Eyebrow Badges & Status Pills
- **Geometry**: Fully rounded (`rounded-full` / `border-radius: 9999px`).
- **Eyebrows**: Thin border (`border-[#DDD6CC]`), subtle warm fill, orange dot or icon, tracking uppercase (`text-[11px] font-bold tracking-wider text-[#E96832]`).
- **Category & Skill Tags**: Small pill tags (`px-3 py-1 text-xs font-medium bg-[#F3EFE7] dark:bg-[#1D1815] border border-[#DDD6CC] dark:border-[#39322C] text-[#211B17] dark:text-[#F5EFE5]`).
- **Status Indicators**: Tiny colored dot (green for active/open, orange for live/recruiting, red for urgent).

### C. Buttons
- **Primary Button**:
  - Solid dark/near-black pill (`bg-[#211B17] text-[#FCFAF6] hover:bg-black dark:bg-[#F5EFE5] dark:text-[#120F0D] dark:hover:bg-white`).
  - Shape: Rounded pill (`rounded-full`) or modern rounded (`rounded-xl`).
  - Icon: Subtle directional arrow (`→`) with gentle slide transition on hover.
  - Spacing: `px-6 py-3 text-sm font-semibold`.
- **Secondary Button**:
  - Outlined warm pill (`bg-transparent border border-[#DDD6CC] dark:border-[#39322C] text-[#211B17] dark:text-[#F5EFE5] hover:bg-[#F3EFE7] dark:hover:bg-[#1D1815]`).
  - Spacing: `px-6 py-3 text-sm font-semibold`.
- **Ghost / Tertiary**:
  - Borderless, clean hover underline or soft background pill tint.

### D. Cards & Grid System
- **Surfaces**: Warm primary surface (`#FCFAF6` light, `#171310` dark).
- **Borders**: 1px crisp structural border (`border-[#DDD6CC]` light, `border-[#39322C]` dark).
- **Corner Radius**: `16px` to `20px` (`rounded-2xl`).
- **Hover Behavior**: Subtle lift `transform: translateY(-2px)` and border warmth shift; no aggressive scaling.
- **Internal Card Structure**:
  - Header with title and status pill.
  - Category metadata in monospace or clean small caps.
  - Body text with comfortable line-height.
  - Pill tags row with flex wrap.
  - Card footer with metadata stats and directional action link (`Enter →`).

### E. Interactive Preview Panels & Dashboard Widgets
- **Mac-Style Terminal / Live Panels**:
  - Top bar with three colored window control dots (pink, yellow, green).
  - Upper label: `CAMPUS-ACTIVITY · LIVE` with a live club count pill.
  - Stepper / Pipeline: Horizontal pill tab container (`1. Discover`, `2. Register`, `3. Passport`).
  - Embedded preview card with high-contrast match badge (`98% Match` in orange).
  - Bottom stats grid with high-impact numbers and small uppercase labels (`8 SOCIETIES`, `100% FREE ACCESS`, `NAAC ACCREDITED`).

### F. Dark Section / Feature Callout
- **Inverted Dark Banner**: A dedicated high-contrast warm near-black section (`#120F0D` / `#171310`) inside the light theme for high-impact showcases (e.g., student accomplishments, verified records, passport).
- **Accents**: Vibrant orange headline text highlights, luminous badge borders, crisp white pill CTA.

### G. Forms & Inputs
- **Input Fields**:
  - Warm surface background (`bg-[#FCFAF6]` light, `bg-[#1D1815]` dark).
  - Border: 1px subtle neutral (`border-[#DDD6CC]` / `border-[#39322C]`).
  - Corner Radius: `10px`–`12px` (`rounded-xl`).
  - Focus Ring: Subdued orange accent ring (`focus:ring-2 focus:ring-[#E96832]/30 focus:border-[#E96832]`).
  - Typography: Crisp labels, muted placeholders (`placeholder-[#948A80]`).
- **Buttons / Actions**: Full-width or inline pill buttons matching primary button styling.

### H. Dashboard & Admin Styling
- **Sidebar**: Clean warm surface with subtle border divider, active menu indicator using warm orange or solid dark pill, consistent Lucide icons.
- **Data Tables**:
  - Spacious rows with thin dividers (`border-b border-[#DDD6CC] dark:border-[#39322C]`).
  - Bold, clean headers with uppercase tracking.
  - Status badges with pill borders.
  - Responsive horizontal scrolling wrapper on small screens.
- **Empty States**: Centered warm dashed container, concise copy, and clear action button.

### I. Footer
- **Structure**: Clean grid with company branding, quick links, connect links, and copyright/legal links.
- **Dividers**: Thin warm top border (`border-t border-[#DDD6CC] dark:border-[#39322C]`).
- **Typography**: Muted secondary text with clear hover transitions on links.

---

## 5. Spacing, Rhythm & Responsive Breakpoints

### Spacing Rhythm
- **Micro Spacing**: `4px`, `8px`, `12px`, `16px`, `24px` (inside components, cards, pills).
- **Macro Spacing**: `32px`, `48px`, `64px`, `80px`, `96px`, `128px` (section gaps and hero padding).
- **Desktop Section Spacing**: `96px`–`128px` between major page sections.
- **Tablet Section Spacing**: `80px`–`96px`.
- **Mobile Section Spacing**: `60px`–`72px`.

### Responsive Breakpoints
- `360px` / `390px` / `430px`: Compact mobile; single-column layouts; full-width CTA buttons; clean horizontal scroll for track pills; zero horizontal overflow.
- `768px`: Tablet; 2-column card grids; responsive navbar with mobile drawer or compact menu.
- `1024px` / `1280px` / `1440px`: Full editorial desktop; 2-column hero with interactive widget panel; 2-column or 3-column card layouts; generous max-width (`max-w-6xl` / `max-w-7xl`).

---

## 6. Motion & Micro-Interactions

- **Timing**: Snappy and subtle (`150ms`–`250ms`).
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` or `ease-out`.
- **Allowed Transitions**:
  - Button arrow nudge on hover (`translate-x-1`).
  - Card gentle lift (`translate-y-[-2px]`).
  - Smooth background-color and border-color transitions.
  - Tab and pill toggle fade.
- **Accessibility**: All animations automatically disabled if `prefers-reduced-motion: reduce` is active.

---

## 7. Strict Boundaries & Preservation Rules

1. **Brand Identity**: UIET E-CELL (Entrepreneurship Cell of UIET MDU Rohtak) remains the sole brand.
2. **Zero Content Overwrite**: No mock text, placeholder copy, or foreign copy from inspiration screenshots.
3. **Zero Logic Mutation**: No changes to Supabase authentication, Server Actions, API routes, database schemas, forms validation, or routing.
4. **Single Source of Truth**: All tokens centralized in `app/globals.css` and applied uniformly across components and pages.
