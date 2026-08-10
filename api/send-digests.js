// api/send-digests.js
// Runs automatically once a day (via Vercel Cron, configured in vercel.json).
// For each project, checks whether today is the right day to send a
// commit digest based on its "daily" or "weekly" setting, gathers the
// relevant commits, and emails one summary to the client.
//
// Milestones are NOT included here — those already email instantly
// when added, from project-detail.html.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Vercel Cron sends a GET request on schedule. Allow POST too for manual testing.
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = new Date();
  const isMonday = now.getUTCDay() === 1; // weekly digests go out on Mondays

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .not('client_email', 'is', null);

  if (projectsError) {
    console.error('Failed to fetch projects for digest:', projectsError);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }

  const results = [];

  for (const project of projects) {
    const isWeekly = (project.digest_frequency || 'daily').toLowerCase() === 'weekly';
    if (isWeekly && !isMonday) continue; // only send weekly digests on Mondays

    // How far back to look: 1 day for daily projects, 7 days for weekly ones
    const daysBack = isWeekly ? 7 : 1;
    const since = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000).toISOString();

    const { data: commits } = await supabase
      .from('updates')
      .select('*')
      .eq('project_id', project.id)
      .eq('type', 'commit')
      .gte('created_at', since)
      .order('created_at', { ascending: true });

    if (!commits || commits.length === 0) continue; // nothing new, skip this project

    const summaryList = commits.map((c) => `<li style="margin-bottom: 8px;">${c.friendly_summary || c.raw_message}</li>`).join('');
    const clientLink = `https://${req.headers.host}/client-page.html?p=${project.client_link_slug}`;

    try {
      const emailRes = await fetch(`https://${req.headers.host}/api/send-update-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: project.client_email,
          projectName: project.name,
          updateText: `<ul style="padding-left: 20px;">${summaryList}</ul>`,
          clientLink,
        }),
      });

      results.push({ project: project.name, sent: emailRes.ok, commitCount: commits.length });
    } catch (err) {
      console.error(`Digest email failed for project ${project.name}:`, err);
      results.push({ project: project.name, sent: false, error: err.message });
    }
  }

  return res.status(200).json({ processed: projects.length, results });
}
