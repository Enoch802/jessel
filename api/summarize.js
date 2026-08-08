// api/summarize.js
// Turns a raw commit message into a plain-English summary using Groq.
// Called from the frontend or from github-webhook.js once that's wired up.
//
// Your GROQ_API_KEY lives in Vercel's environment variables (never in
// frontend code) — this function runs on the server, so the key stays safe.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { commitMessage } = req.body;
  if (!commitMessage) {
    return res.status(400).json({ error: 'commitMessage is required' });
  }

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'You rewrite raw git commit messages into one short, friendly sentence a non-technical client can understand. No jargon. No commit hashes. Just what changed and why it matters, in plain English.',
          },
          { role: 'user', content: commitMessage },
        ],
        max_tokens: 60,
      }),
    });

    const data = await groqResponse.json();
    const summary = data?.choices?.[0]?.message?.content?.trim() || commitMessage;

    return res.status(200).json({ summary });
  } catch (err) {
    console.error('Groq summarize error:', err);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
}
