# Vercel Deployment Guide for UIET E-Cell

This guide walks you through deploying the UIET E-Cell project to [Vercel](https://vercel.com) in just a few minutes.

---

## 1. Prerequisites

- A [Vercel](https://vercel.com) account.
- A [GitHub](https://github.com), [GitLab](https://gitlab.com), or [Bitbucket](https://bitbucket.org) account where this repository is pushed.
- Your Supabase Project URL and Anon API Key (found in your Supabase Dashboard under **Project Settings** > **API**).

---

## 2. Push Code to Git

Make sure your latest changes are committed and pushed to your remote repository:

```bash
git add .
git commit -m "chore: prepare project for Vercel deployment"
git push origin main
```

---

## 3. Import Project in Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** > **"Project"**.
3. Under **Import Git Repository**, select your repository (`E-CELL_UIET-MDU` or equivalent).
4. In the project configuration screen:
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` or `next build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

---

## 4. Configure Environment Variables

Before clicking **Deploy**, expand the **Environment Variables** section and add the following keys (see [`.env.example`](file:///.env.example) for reference):

| Variable Name | Required | Description | Example / Location |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Your Supabase project URL | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Your Supabase anon public key | `eyJhbGci...` |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Optional | Web3Forms access key for contact forms | Key from web3forms.com |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Optional | EmailJS Service ID | Found in EmailJS dashboard |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Optional | EmailJS Template ID | Found in EmailJS dashboard |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Optional | EmailJS Public Key | Found in EmailJS dashboard |

> [!TIP]
> Ensure both `Production` and `Preview` environments are checked for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` so pull request previews also work seamlessly.

---

## 5. Deploy & Verify

1. Click **"Deploy"**.
2. Vercel will clone the repo, install dependencies, run `next build`, and deploy edge/serverless functions across global CDN points.
3. Once finished, Vercel will provide you with a live URL (e.g., `https://ecell-uiet-mdu.vercel.app`).
4. Visit your deployment to verify:
   - Homepage loads fast with GSAP animations and Tailwind styling.
   - Authentication routes (`/login`, `/signup`) connect to Supabase.
   - Protected routes (`/dashboard`, `/profile`, `/admin`) redirect properly via `proxy.ts`.
   - Dynamic event pages (`/events`) and mentorship directory (`/mentorship`) render properly.

---

## 6. Supabase Auth Redirect URL Configuration

After deploying, make sure to add your Vercel URL to Supabase's allowed redirect URLs:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** > **URL Configuration**.
3. Under **Redirect URLs**, add:
   - `https://your-app-name.vercel.app/**`
   - `https://your-custom-domain.com/**` (if using custom domain)
4. Under **Site URL**, set:
   - `https://your-app-name.vercel.app`

---

## 7. Custom Domain (Optional)

1. In your Vercel project, go to **Settings** > **Domains**.
2. Enter your custom domain (e.g. `ecell.uietmdu.ac.in` or `ecelluiet.org`).
3. Follow the DNS instructions (add CNAME/A records at your domain registrar).
4. Vercel automatically provisions and renews SSL certificates for you.
