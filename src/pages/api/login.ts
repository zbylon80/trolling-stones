import type { APIRoute } from 'astro';
import { adminCookieName, createSession, verifyPassword } from '../../utils/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const rawPassword = typeof (payload as { password?: string }).password === 'string' ? (payload as { password: string }).password : '';
  const password = rawPassword.trim();

  try {
    if (!verifyPassword(password)) {
      return new Response(JSON.stringify({ error: 'Nieprawidlowe haslo.' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const token = createSession();
  cookies.delete(adminCookieName, { path: '/admin' });
  cookies.set(adminCookieName, token, {
    path: '/',
    secure: import.meta.env.PROD,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 12,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
