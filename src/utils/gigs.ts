import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Gig = {
  id: string;
  date: string;
  city: string;
  venue: string;
  description?: string;
  logo?: string;
  ticketsEnabled: boolean;
  ticketsUrl?: string;
  ticketsSoldOut: boolean;
};

const gigFileCandidates = [
  process.env.GIGS_FILE_PATH ? resolve(process.cwd(), process.env.GIGS_FILE_PATH) : undefined,
  fileURLToPath(new URL('../../src/data/gigs.json', import.meta.url)),
  fileURLToPath(new URL('../data/gigs.json', import.meta.url)),
].filter(Boolean) as string[];

const preferredGigFilePath = gigFileCandidates[0];

function resolveGigFileForRead(): string {
  for (const candidate of gigFileCandidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return preferredGigFilePath;
}

async function ensureGigDirectory(filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
}

export async function readGigs(): Promise<Gig[]> {
  try {
    const data = await readFile(resolveGigFileForRead(), 'utf-8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(normalizeGig).filter(Boolean) as Gig[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function writeGigs(gigs: Gig[]): Promise<void> {
  const sanitized = gigs.map(normalizeGig).filter(Boolean) as Gig[];
  const sorted = [...sanitized].sort((a, b) => a.date.localeCompare(b.date));
  const payload = JSON.stringify(sorted, null, 2);
  await ensureGigDirectory(preferredGigFilePath);
  await writeFile(preferredGigFilePath, payload, 'utf-8');
}

function normalizeGig(value: unknown): Gig | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const raw = value as Partial<Gig>;
  if (!raw.id || !raw.date || !raw.city || !raw.venue) {
    return null;
  }
  const ticketsSoldOut = Boolean(raw.ticketsSoldOut);
  const ticketsEnabled = ticketsSoldOut ? false : Boolean(raw.ticketsEnabled);
  return {
    id: String(raw.id),
    date: String(raw.date),
    city: String(raw.city),
    venue: String(raw.venue),
    description: raw.description ? String(raw.description) : undefined,
    logo: raw.logo ? String(raw.logo) : undefined,
    ticketsEnabled,
    ticketsUrl: raw.ticketsUrl ? String(raw.ticketsUrl) : undefined,
    ticketsSoldOut,
  };
}

export function generateGigId(input: { date: string; city: string; venue: string }): string {
  const safe = `${input.date}-${input.city}-${input.venue}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return safe || `${Date.now()}`;
}
