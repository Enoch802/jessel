// api/github-callback.js
// GitHub sends the freelancer here after they click "Authorize" on GitHub's
// consent screen. This exchanges the temporary code GitHub gives us for a
// real access token, saves it to the freelancer's account, then sends them
// back to the project page.

export default async function handler(req, res) {
  const { code, state } = req.query; // state = the project id we're connecting

  if (!code) {
    return res.redirect('/dashboard.html?github_error=missing_code');
  }

  try {
    // Exchange the temporary code for a real access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('GitHub token exchange failed:', tokenData);
      return res.redirect('/dashboard.html?github_error=token_exchange_failed');
    }

    // Send the freelancer back to the project page with the token in the URL
    // (project-detail.html will pick this up and save it, then clean the URL)
    const redirectUrl = state
      ? `/project-detail.html?id=${state}&github_token=${tokenData.access_token}`
      : `/dashboard.html?github_token=${tokenData.access_token}`;

    return res.redirect(redirectUrl);
  } catch (err) {
    console.error('GitHub callback error:', err);
    return res.redirect('/dashboard.html?github_error=server_error');
  }
}
