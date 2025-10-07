import crypto from 'node:crypto';

export const adminCookieName = 'admin_session';
const sessionTtlMs = 1000 * 60 * 60 * 12;

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

function signSessionPayload(payload: string): Buffer {
  const hmac = crypto.createHmac('sha256', requireAdminPassword());
  hmac.update(payload);
  return hmac.digest();
}

export function createSession(): string {
  const issuedAt = Date.now();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${issuedAt}:${nonce}`;
  const signature = signSessionPayload(payload).toString('hex');
  return `${payload}.${signature}`;
}

export function isSessionValid(token: string | undefined | null): boolean {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    return false;
  }

  let expectedSignature: Buffer;
  let providedSignature: Buffer;
  try {
    expectedSignature = signSessionPayload(payload);
    providedSignature = Buffer.from(signature, 'hex');
  } catch {
    return false;
  }

  if (expectedSignature.length !== providedSignature.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(expectedSignature, providedSignature)) {
    return false;
  }

  const [issuedAtRaw] = payload.split(':');
  const issuedAt = Number.parseInt(issuedAtRaw, 10);
  if (!Number.isFinite(issuedAt)) {
    return false;
  }

  if (Date.now() - issuedAt > sessionTtlMs) {
    return false;
  }

  return true;
}

export function destroySession(_: string | undefined | null): void {
  // Stateless sessions rely on cookie removal to invalidate tokens.
}
