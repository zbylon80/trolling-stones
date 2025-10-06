import type { APIRoute } from 'astro';
import { adminCookieName, destroySession } from '../../utils/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  const token = cookies.get(adminCookieName)?.value;
  if (token) {
    destroySession(token);
  }
  cookies.delete(adminCookieName, { path: '/' });
  cookies.delete(adminCookieName, { path: '/admin' });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
