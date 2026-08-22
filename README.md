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
- forgot-password.html
- reset-password.html
- dashboard.html
- projects.html
- new-project.html
- project-detail.html?id=PROJECT_ID   (dynamic via query param)
- client-page.html?p=CLIENT_LINK_SLUG (dynamic via query param, public, no login)
- settings.html
- terms.html
- privacy.html

## api/ folder (Vercel Serverless Functions)

These become live backend endpoints automatically once deployed on Vercel:

- api/create-webhook.js — creates a GitHub webhook for a project
- api/github-callback.js — exchanges the GitHub OAuth code and redirects back
- api/github-webhook.js — receives GitHub push events and records updates
- api/send-digests.js — sends scheduled daily or weekly client digests
- api/send-update-email.js — sends a single client update through Brevo
- api/summarize.js — turns a commit message into plain English using Groq

## Deploying

1. Push this whole folder to your GitHub repo, exactly as-is
2. Connect that repo to Vercel
3. In Vercel's project settings, add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - GROQ_API_KEY
4. Deploy — your 9 pages go live immediately, api/ functions activate automatically

## Not built yet

- Real GitHub OAuth connection + webhook activation is still being completed.
- Automatic email sending to clients depends on `BREVO_API_KEY`.
- Google sign-in requires enabling the Google provider in Supabase Auth settings.

## Structure

```text
.
├── *.html                 Public frontend routes (served from the root)
├── api/                   Vercel serverless functions and integrations
├── assets/icons/          PWA icons referenced by manifest.json
├── apple-touch-icon.png   Root fallback for iOS home-screen icons
├── manifest.json          PWA metadata
├── supabase-config.js     Browser Supabase client configuration
├── sw.js                  Minimal service worker
├── vercel.json             Vercel deployment and cron configuration
└── package.json            Runtime dependency metadata
```

The root-level pages and `api/` directory are intentional: Vercel maps them
directly to their public URLs, and the frontend has no build or bundling step.




