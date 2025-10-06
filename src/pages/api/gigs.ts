import type { APIRoute, AstroCookies } from 'astro';
import { adminCookieName, isSessionValid } from '../../utils/auth';
import { generateGigId, readGigs, writeGigs, type Gig } from '../../utils/gigs';

export const prerender = false;

const jsonHeaders = { 'content-type': 'application/json' } as const;

function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Brak autoryzacji.' }), {
    status: 401,
    headers: jsonHeaders,
  });
}

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch (error) {
    throw new Error('Niepoprawny JSON.');
  }
}

function ensureAuthenticated(cookies: AstroCookies): void {
  const token = cookies.get(adminCookieName)?.value;
  if (!isSessionValid(token)) {
    throw new Error('UNAUTHORIZED');
  }
}

function sanitizeGigInput(payload: Record<string, unknown>, existing?: Gig): Gig {
  const date = typeof payload.date === 'string' ? payload.date : existing?.date;
  const city = typeof payload.city === 'string' ? payload.city : existing?.city;
  const venue = typeof payload.venue === 'string' ? payload.venue : existing?.venue;
  const description = typeof payload.description === 'string' ? payload.description : existing?.description;
  const logo = typeof payload.logo === 'string' ? payload.logo : existing?.logo;
  const ticketsUrl = typeof payload.ticketsUrl === 'string' ? payload.ticketsUrl : existing?.ticketsUrl;
  const ticketsEnabledRaw = payload.ticketsEnabled;
  const ticketsEnabled = typeof ticketsEnabledRaw === 'boolean'
    ? ticketsEnabledRaw
    : typeof ticketsEnabledRaw === 'string'
      ? ticketsEnabledRaw === 'true'
      : existing?.ticketsEnabled ?? false;
  const ticketsSoldOutRaw = payload.ticketsSoldOut;
  const ticketsSoldOut = typeof ticketsSoldOutRaw === 'boolean'
    ? ticketsSoldOutRaw
    : typeof ticketsSoldOutRaw === 'string'
      ? ticketsSoldOutRaw === 'true'
      : existing?.ticketsSoldOut ?? false;

  if (!date || !city || !venue) {
    throw new Error('Brakuje wymaganych pol: date, city, venue.');
  }

  const normalizedTicketsEnabled = ticketsSoldOut ? false : ticketsEnabled;

  return {
    id: existing?.id ?? (typeof payload.id === 'string' ? payload.id : generateGigId({ date, city, venue })),
    date,
    city,
    venue,
    description,
    logo,
    ticketsEnabled: normalizedTicketsEnabled,
    ticketsUrl,
    ticketsSoldOut,
  };
}

export const GET: APIRoute = async ({ cookies }) => {
  try {
    ensureAuthenticated(cookies);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorizedResponse();
    }
    throw error;
  }

  const gigs = await readGigs();
  return new Response(JSON.stringify({ gigs }), {
    status: 200,
    headers: jsonHeaders,
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    ensureAuthenticated(cookies);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorizedResponse();
    }
    throw error;
  }

  let payload: Record<string, unknown>;
  try {
    payload = await parseBody(request);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  try {
    const gigs = await readGigs();
    const gig = sanitizeGigInput(payload);
    if (gigs.some((item) => item.id === gig.id)) {
      return new Response(JSON.stringify({ error: 'Wpis o takim ID juz istnieje.' }), {
        status: 409,
        headers: jsonHeaders,
      });
    }
    await writeGigs([...gigs, gig]);
    return new Response(JSON.stringify({ gig }), {
      status: 201,
      headers: jsonHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    ensureAuthenticated(cookies);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorizedResponse();
    }
    throw error;
  }

  let payload: Record<string, unknown>;
  try {
    payload = await parseBody(request);
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const id = typeof payload.id === 'string' ? payload.id : undefined;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Brakuje pola id.' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const gigs = await readGigs();
  const index = gigs.findIndex((item) => item.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: 'Nie znaleziono wpisu.' }), {
      status: 404,
      headers: jsonHeaders,
    });
  }

  try {
    const updated = sanitizeGigInput(payload, gigs[index]);
    gigs[index] = updated;
    await writeGigs(gigs);
    return new Response(JSON.stringify({ gig: updated }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: jsonHeaders,
    });
  }
};

export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    ensureAuthenticated(cookies);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorizedResponse();
    }
    throw error;
  }

  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'Brakuje parametru id.' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const gigs = await readGigs();
  const next = gigs.filter((g) => g.id !== id);
  if (next.length === gigs.length) {
    return new Response(JSON.stringify({ error: 'Nie znaleziono wpisu.' }), {
      status: 404,
      headers: jsonHeaders,
    });
  }

  await writeGigs(next);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: jsonHeaders,
  });
};
