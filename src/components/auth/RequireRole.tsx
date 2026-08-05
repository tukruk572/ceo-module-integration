import type { ReactNode } from 'react';

import { AI_CEO_ALLOWED_ROLES, type AppRole, type SessionUser } from '@/lib/ceo-types';

interface RequireRoleProps {
  user: SessionUser | null;
  allowed?: readonly AppRole[];
  children: ReactNode;
}

export function isRoleAllowed(
  user: SessionUser | null,
  allowed: readonly AppRole[] = AI_CEO_ALLOWED_ROLES,
): boolean {
  return !!user && allowed.includes(user.role);
}

/**
 * Renders children only for permitted roles. Route access itself is enforced in
 * `beforeLoad` on the /ai-ceo layout; this is the in-render safety net.
 */
export function RequireRole({ user, allowed = AI_CEO_ALLOWED_ROLES, children }: RequireRoleProps) {
  if (!isRoleAllowed(user, allowed)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-center">
          <h1 className="text-lg font-semibold text-white">Access restricted</h1>
          <p className="mt-2 text-sm text-red-300/80">
            The AI CEO module is limited to {allowed.join(' and ')} roles.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
