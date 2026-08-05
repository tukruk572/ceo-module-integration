import { createServerFn } from '@tanstack/react-start';

import type { SessionUser } from './ceo-types';

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ user: SessionUser | null; authApiConfigured: boolean }> => {
    const { readSessionUser } = await import('./auth.server');
    const { isAiraApiConfigured } = await import('./aira-api.server');
    return { user: await readSessionUser(), authApiConfigured: isAiraApiConfigured() };
  },
);

export const signIn = createServerFn({ method: 'POST' })
  .inputValidator((input: { email: string; password: string }) => {
    const email = String(input?.email ?? '').trim();
    const password = String(input?.password ?? '');
    if (!email || !password) throw new Error('Email and password are required');
    return { email, password };
  })
  .handler(async ({ data }): Promise<{ user: SessionUser | null; error?: string }> => {
    const { authenticateWithApi, writeSessionUser } = await import('./auth.server');
    const result = await authenticateWithApi(data.email, data.password);
    if (!result.user) {
      return {
        user: null,
        error: result.configured
          ? (result.error ?? 'Sign in failed')
          : 'Authentication API is not connected yet',
      };
    }
    await writeSessionUser(result.user);
    return { user: result.user };
  });

/** Preview access, only available while no auth API is configured. */
export const signInPreview = createServerFn({ method: 'POST' }).handler(
  async (): Promise<{ user: SessionUser | null; error?: string }> => {
    const { previewSessionUser, writeSessionUser } = await import('./auth.server');
    const user = await previewSessionUser();
    if (!user) return { user: null, error: 'Preview access is disabled' };
    await writeSessionUser(user);
    return { user };
  },
);

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const { destroySession } = await import('./auth.server');
  await destroySession();
  return { ok: true };
});
