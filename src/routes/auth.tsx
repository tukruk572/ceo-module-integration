import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Bot, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { getCurrentUser, signIn, signInPreview } from "@/lib/auth.functions";
import { isRoleAllowed } from "@/components/auth/RequireRole";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Software Vala AI CEO" },
      {
        name: "description",
        content: "Sign in to the Software Vala AI CEO command center. Boss and CEO roles only.",
      },
      { property: "og:title", content: "Sign In — Software Vala AI CEO" },
      {
        property: "og:description",
        content: "Restricted access to the Software Vala AI CEO command center.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search['redirect'] === "string" ? (search['redirect'] as string) : "/ai-ceo",
  }),
  loader: async () => {
    const { user, authApiConfigured } = await getCurrentUser();
    if (isRoleAllowed(user)) throw redirect({ to: "/ai-ceo" });
    return { authApiConfigured };
  },
  component: AuthPage,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a10] p-6 text-red-300" role="alert">
      {error.message}
    </div>
  ),
});

function AuthPage() {
  const { authApiConfigured } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const doSignIn = useServerFn(signIn);
  const doPreview = useServerFn(signInPreview);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const goToApp = () => navigate({ to: search.redirect || "/ai-ceo" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await doSignIn({ data: { email, password } });
      if (!result.user) {
        toast.error(result.error ?? "Sign in failed");
        return;
      }
      toast.success(`Signed in as ${result.user.role.replace("_", " ")}`);
      goToApp();
    } finally {
      setBusy(false);
    }
  };

  const handlePreview = async () => {
    setBusy(true);
    try {
      const result = await doPreview();
      if (!result.user) {
        toast.error(result.error ?? "Preview access unavailable");
        return;
      }
      goToApp();
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0a10] via-[#0d0d14] to-[#0a0a10] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-8 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI CEO Command Center</h1>
            <p className="text-sm text-cyan-400/80">Boss & CEO access only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs text-slate-400">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-500/60"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs text-slate-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-sm outline-none focus:border-cyan-500/60"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500/90 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Sign in
          </button>
        </form>

        {!authApiConfigured && (
          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-300/90">
            <p>
              The Prisma authentication API isn't connected yet, so credentials can't be verified.
              Preview access is available until <code>AIRA_API_URL</code> is configured.
            </p>
            <button
              type="button"
              onClick={handlePreview}
              disabled={busy}
              className="mt-3 w-full rounded-lg border border-amber-500/40 px-4 py-2 font-semibold text-amber-200 transition-colors hover:bg-amber-500/10 disabled:opacity-60"
            >
              Continue as CEO (preview)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
