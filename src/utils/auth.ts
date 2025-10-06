import crypto from 'node:crypto';

export const adminCookieName = 'admin_session';
const sessionTtlMs = 1000 * 60 * 60 * 12;
const sessions = new Map<string, number>();

const envPassword = (() => {
  const envSource =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env as Record<string, string | undefined>)
      : undefined;
  return envSource?.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
})();

export function requireAdminPassword(): string {
  if (!envPassword) {
    throw new Error('Missing ADMIN_PASSWORD environment variable.');
  }
  return envPassword;
}

export function verifyPassword(candidate: string): boolean {
  return candidate === requireAdminPassword();
}

export function createSession(): string {
  purgeExpiredSessions();
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, Date.now());
  return token;
}

export function isSessionValid(token: string | undefined | null): boolean {
  if (!token) {
    return false;
  }
  const created = sessions.get(token);
  if (!created) {
    return false;
  }
  if (Date.now() - created > sessionTtlMs) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token: string | undefined | null): void {
  if (!token) {
    return;
  }
  sessions.delete(token);
}

function purgeExpiredSessions(): void {
  const now = Date.now();
  for (const [token, created] of sessions.entries()) {
    if (now - created > sessionTtlMs) {
      sessions.delete(token);
    }
  }
}
