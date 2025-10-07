import type { APIRoute } from 'astro';
import { adminCookieName } from '../../utils/auth';

export const prerender = false;

const cookieDeletionValue = 'deleted';
const cookieDeletionTimestamp = new Date(0).toUTCString();
const isSecureEnv = import.meta.env.PROD === true || import.meta.env.PROD === 'true';

function buildDeletionHeader(path: '/' | '/admin'): string {
  const attributes = [
    `${adminCookieName}=${cookieDeletionValue}`,
    `Path=${path}`,
    `Expires=${cookieDeletionTimestamp}`,
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Strict',
  ];
  if (isSecureEnv) {
    attributes.push('Secure');
  }
  return attributes.join('; ');
}

function resolveRedirect(url: URL): string | undefined {
  const redirectParam = url.searchParams.get('redirect');
  if (!redirectParam) {
    return undefined;
  }
  try {
    const target = new URL(redirectParam, url.origin);
    if (target.origin !== url.origin) {
      return undefined;
    }
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    if (redirectParam.startsWith('/')) {
      return redirectParam;
    }
    return undefined;
  }
}

function buildLogoutResponse(url: URL, request: Request, cookieHeaders: string[]): Response {
  const headers = new Headers();
  for (const header of cookieHeaders) {
    headers.append('set-cookie', header);
  }

  const explicitRedirect = resolveRedirect(url);
  if (explicitRedirect) {
    headers.set('Location', explicitRedirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  }

  const prefersHtml = request.headers.get('accept')?.includes('text/html');
  if (prefersHtml) {
    const fallback = new URL('/admin', url.origin);
    fallback.searchParams.set('loggedOut', '1');
    headers.set('Location', `${fallback.pathname}${fallback.search}${fallback.hash}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  }

  headers.set('content-type', 'application/json');
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers,
  });
}

async function handleLogout(context: Parameters<APIRoute>[0]): Promise<Response> {
  const cookieHeaders = [buildDeletionHeader('/'), buildDeletionHeader('/admin')];
  return buildLogoutResponse(context.url, context.request, cookieHeaders);
}

export const POST: APIRoute = async (context) => {
  return handleLogout(context);
};

export const GET: APIRoute = async (context) => {
  return handleLogout(context);
};
