// api/create-webhook.js
// Called once, right after a freelancer picks which repo to connect.
// Tells GitHub: "notify Jessel at /api/github-webhook every time this repo
// gets a push" — this is what makes commits start flowing in automatically.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken, owner, repo } = req.body;
  if (!accessToken || !owner || !repo) {
    return res.status(400).json({ error: 'accessToken, owner, and repo are required' });
  }

  const siteUrl = `https://${req.headers.host}`;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'web',
        active: true,
        events: ['push'],
        config: {
          url: `${siteUrl}/api/github-webhook`,
          content_type: 'json',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('GitHub webhook creation failed:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to create webhook' });
    }

    return res.status(200).json({ success: true, webhookId: data.id });
  } catch (err) {
    console.error('create-webhook error:', err);
    return res.status(500).json({ error: 'Server error creating webhook' });
  }
}
