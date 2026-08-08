# Jessel

Plain HTML/CSS/JS site + Vercel serverless functions. No build step for the
frontend — every .html file works exactly as-is.

## Setup

1. Open `supabase-config.js` and paste in your real Supabase Project URL
   and Publishable (anon) key (from Supabase -> Project Settings -> API).
2. That's it for the frontend — just open any .html file in a browser, or
   deploy straight to Vercel.

## Pages

- login.html
- signup.html
- dashboard.html
- new-project.html
- project-detail.html?id=PROJECT_ID   (dynamic via query param)
- client-page.html?p=CLIENT_LINK_SLUG (dynamic via query param, public, no login)
- settings.html
- terms.html
- privacy.html

## api/ folder (Vercel Serverless Functions)

These become live backend endpoints automatically once deployed on Vercel:

- api/github-webhook.js — receives GitHub push events (not wired to a real
  GitHub OAuth App yet — that's the next step)
- api/summarize.js — turns a commit message into plain English using Groq
  (needs GROQ_API_KEY set in Vercel's environment variables)

## Deploying

1. Push this whole folder to your GitHub repo, exactly as-is
2. Connect that repo to Vercel
3. In Vercel's project settings, add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - GROQ_API_KEY
4. Deploy — your 9 pages go live immediately, api/ functions activate automatically

## Not built yet

- Real GitHub OAuth connection + webhook activation (api/github-webhook.js is
  ready to receive data, but nothing sends it there yet)
- Automatic email sending to clients (Resend)
- Google sign-in requires enabling the Google provider in Supabase Auth settings
