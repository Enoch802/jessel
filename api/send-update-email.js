// api/send-update-email.js
// Sends an email to a project's client whenever a new update (milestone
// or commit) is added. Uses Brevo's API — your BREVO_API_KEY lives in
// Vercel's environment variables, never in frontend code.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientEmail, projectName, updateText, clientLink } = req.body;

  if (!clientEmail || !projectName || !updateText || !clientLink) {
    return res.status(400).json({ error: 'clientEmail, projectName, updateText, and clientLink are all required' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: 'Jessel',
          email: 'jenoch637@gmail.com',
        },
        to: [{ email: clientEmail }],
        subject: `New update on ${projectName}`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #0D2818;">${projectName}</h2>
            <p style="color: #333; font-size: 15px; line-height: 1.6;">${updateText}</p>
            <a href="${clientLink}" style="display: inline-block; margin-top: 16px; background: #0D2818; color: #F5F5DC; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase;">
              View full update
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 32px;">Powered by Jessel</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Brevo send failed:', errData);
      return res.status(response.status).json({ error: errData.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-update-email error:', err);
    return res.status(500).json({ error: 'Server error sending email' });
  }
}
