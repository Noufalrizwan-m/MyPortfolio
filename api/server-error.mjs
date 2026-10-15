import { readFileSync } from 'node:fs';

// A genuine HTTP 500 response with the portfolio's recovery UI.
// Vercel infrastructure failures outside this route use the platform's own page.
export function GET() {
  return new Response(readFileSync(new URL('../dist/500.html', import.meta.url), 'utf8'), {
    status: 500,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
