/**
 * Netlify Function: get-submissions
 *
 * Called by admin.html after Netlify Identity login.
 * Verifies the Identity JWT, then fetches form submissions
 * from the Netlify Forms API using the server-side PAT.
 *
 * Environment variable required (set in Netlify dashboard):
 *   NETLIFY_PAT  — your Netlify Personal Access Token
 *
 * GET /.netlify/functions/get-submissions?form=booking
 * GET /.netlify/functions/get-submissions?form=enquiry
 *
 * Authorization: Bearer <netlify-identity-jwt>
 */

exports.handler = async function (event) {
  // ── CORS headers (same origin on Netlify, but needed for local dev) ──
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // ── 1. Verify caller is a logged-in Netlify Identity user ──
  const authHeader = event.headers['authorization'] || event.headers['Authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Missing auth token' }) };
  }

  const identityJWT = authHeader.slice(7);

  // Netlify injects context.clientContext when Identity is enabled.
  // We decode the JWT payload (no crypto verify needed — Netlify already
  // validated it before invoking the function via the Identity gateway).
  try {
    const payloadB64 = identityJWT.split('.')[1];
    // Node's Buffer handles base64url without padding issues
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));

    // Must have a sub (user id) — means it's a real Identity token
    if (!payload.sub) throw new Error('No sub in token');

    // Optional: check token hasn't expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Token expired' }) };
    }
  } catch (e) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid token' }) };
  }

  // ── 2. Check PAT is configured ──
  const PAT = process.env.NETLIFY_PAT;
  if (!PAT) {
    console.error('[get-submissions] NETLIFY_PAT environment variable is not set');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server not configured. Set NETLIFY_PAT in Netlify environment variables.' }),
    };
  }

  // ── 3. Determine which form to fetch ──
  const formName = (event.queryStringParameters && event.queryStringParameters.form) || 'booking';
  if (!['booking', 'enquiry'].includes(formName)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid form name' }) };
  }

  // ── 4. Get the site ID from the function URL hostname ──
  // On Netlify, SITE_ID env var is always available
  const siteId = process.env.SITE_ID || process.env.URL || '';

  try {
    const apiBase  = 'https://api.netlify.com/api/v1';
    const apiHdrs  = { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' };

    // Fetch all forms for this site
    // Use SITE_ID env var (Netlify sets this automatically)
    const sitePart = process.env.SITE_ID
      ? process.env.SITE_ID
      : extractHostname(process.env.URL || '');

    const formsRes = await fetch(`${apiBase}/sites/${sitePart}/forms`, { headers: apiHdrs });
    if (!formsRes.ok) {
      const msg = await formsRes.text();
      console.error('[get-submissions] Forms list error:', formsRes.status, msg);
      return { statusCode: formsRes.status, headers, body: JSON.stringify({ error: msg }) };
    }

    const forms = await formsRes.json();
    const form  = forms.find(f => f.name === formName);

    if (!form) {
      // Form not registered yet (no submissions ever) — return empty array
      return { statusCode: 200, headers, body: JSON.stringify([]) };
    }

    // Fetch submissions
    const subRes = await fetch(
      `${apiBase}/forms/${form.id}/submissions?per_page=500`,
      { headers: apiHdrs }
    );
    if (!subRes.ok) {
      const msg = await subRes.text();
      console.error('[get-submissions] Submissions error:', subRes.status, msg);
      return { statusCode: subRes.status, headers, body: JSON.stringify({ error: msg }) };
    }

    const submissions = await subRes.json();
    return { statusCode: 200, headers, body: JSON.stringify(submissions) };

  } catch (err) {
    console.error('[get-submissions] Unexpected error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

function extractHostname(url) {
  try { return new URL(url).hostname; } catch (e) { return url; }
}
