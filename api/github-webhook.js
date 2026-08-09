// api/github-webhook.js
// GitHub calls this automatically every time someone pushes code to a
// connected repo. This saves each commit as an update and turns it into
// a plain-English summary via Groq.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;
  const repoFullName = payload?.repository?.full_name;
  const commits = payload?.commits || [];

  if (!repoFullName || commits.length === 0) {
    return res.status(200).json({ received: true, note: 'No commits to process' });
  }

  // Find which Jessel project this repo belongs to
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .ilike('github_repo', repoFullName)
    .single();

  if (!project) {
    console.error('Project lookup failed. repoFullName received:', repoFullName, 'Supabase error:', projectError);
    return res.status(200).json({
      received: true,
      note: 'No matching project found',
      debug_repoFullName_received: repoFullName,
      debug_supabase_error: projectError ? projectError.message : null,
    });
  }

  for (const commit of commits) {
    let friendlySummary = commit.message;

    // Turn the raw commit message into plain English via Groq
    try {
      const siteUrl = `https://${req.headers.host}`;
      const summarizeRes = await fetch(`${siteUrl}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commitMessage: commit.message }),
      });
      const summarizeData = await summarizeRes.json();
      if (summarizeData.summary) friendlySummary = summarizeData.summary;
    } catch (err) {
      console.error('Summarize call failed, using raw message instead:', err);
    }

    await supabase.from('updates').insert({
      project_id: project.id,
      type: 'commit',
      raw_message: commit.message,
      friendly_summary: friendlySummary,
      commit_sha: commit.id,
    });
  }

  return res.status(200).json({ received: true, processed: commits.length });
}
