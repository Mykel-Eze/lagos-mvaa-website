// Vercel Edge Middleware — gates the API documentation behind HTTP Basic Auth.
//
// Scope: ONLY /api_documentation_000 (and its assets). The rest of the portal stays
// public — see `config.matcher` below.
//
// Credentials are read from environment variables (never hardcode them). Set them in
// the Vercel dashboard → Project → Settings → Environment Variables, then redeploy:
//   DOCS_BASIC_AUTH_USER
//   DOCS_BASIC_AUTH_PASSWORD
//
// This runs at the edge before the static files are served, so it also protects
// style.css / app.js (an attacker can't bypass the gate by fetching them directly).

export const config = {
  // Cover both the bare path and everything under it (html, css, js).
  matcher: [ '/api_documentation_000', '/api_documentation_000/:path*' ],
};

export default function middleware(request) {
  const user = process.env.DOCS_BASIC_AUTH_USER;
  const pass = process.env.DOCS_BASIC_AUTH_PASSWORD;

  // Fail closed: if credentials aren't configured, block rather than expose the docs.
  if (!user || !pass) {
    return new Response('API documentation access is not configured.', { status: 503 });
  }

  const header = request.headers.get('authorization') || '';
  const [ scheme, encoded ] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    let decoded = '';
    try { decoded = atob(encoded); } catch { decoded = ''; }
    const sep = decoded.indexOf(':');
    if (sep !== -1) {
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      if (u === user && p === pass) {
        return undefined; // authorized — continue to the static docs
      }
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="MVAA API Documentation", charset="UTF-8"',
    },
  });
}
