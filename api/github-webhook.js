// api/github-webhook.js
// This becomes a live endpoint automatically once deployed on Vercel:
// https://your-site.vercel.app/api/github-webhook
//
// GitHub will POST here every time someone pushes code, once the
// GitHub OAuth App + webhook are set up (a later step — this file
// is ready to receive that data, it just isn't connected yet).

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key needed here to bypass RLS safely on the server
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO once GitHub App is set up:
  // 1. Verify the request really came from GitHub (check the signature header)
  // 2. Find which Jessel project this repo belongs to
  // 3. For each commit in the push, insert a row into the `updates` table
  // 4. Call /api/summarize to turn the raw commit message into plain English
  // 5. Trigger the email notification if the client has one on file

  const payload = req.body;
  console.log('Received GitHub webhook (not yet processed):', payload?.repository?.full_name);

  return res.status(200).json({ received: true, note: 'GitHub webhook wiring not yet implemented' });
}
