import { useSession } from '@tanstack/react-start/server';

import { airaFetch, isAiraApiConfigured } from './aira-api.server';
import type { SessionUser } from './ceo-types';

interface SessionData {
  user?: SessionUser;
}

function sessionConfig() {
  const password = process.env['AIRA_SESSION_SECRET'];
  if (!password) throw new Error('AIRA_SESSION_SECRET is not configured');
  return {
    password,
    name: 'aira-session',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function readSessionUser(): Promise<SessionUser | null> {
  const session = await useSession<SessionData>(sessionConfig());
  return session.data.user ?? null;
}

export async function writeSessionUser(user: SessionUser): Promise<void> {
  const session = await useSession<SessionData>(sessionConfig());
  await session.update({ user });
}

export async function destroySession(): Promise<void> {
  const session = await useSession<SessionData>(sessionConfig());
  await session.clear();
}

/**
 * Verifies credentials against the external Prisma-backed API.
 * Returns null when the API rejects the credentials or is unreachable.
 */
export async function authenticateWithApi(
  email: string,
  password: string,
): Promise<{ user: SessionUser | null; configured: boolean; error?: string }> {
  const result = await airaFetch<{ user: SessionUser }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (!result.configured) {
    return { user: null, configured: false, ...(result.error ? { error: result.error } : {}) };
  }

  if (!result.ok || !result.data?.user) {
    return { user: null, configured: true, error: 'Invalid email or password' };
  }
  return { user: result.data.user, configured: true };
}

/**
 * Preview-only access, allowed ONLY while no auth API is configured.
 * The moment AIRA_API_URL is set, this path is permanently disabled.
 */
export async function previewSessionUser(): Promise<SessionUser | null> {
  if (isAiraApiConfigured()) return null;
  return { id: 'preview-ceo', email: 'ceo@softwarevala.local', role: 'ceo' };
}
