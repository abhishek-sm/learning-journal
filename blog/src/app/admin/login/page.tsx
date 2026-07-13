"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginPage() {
  const [state, setState] = useState<{ error?: string } | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await loginAction(undefined, formData);
      setState(result);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        <h1 className="mb-1 text-xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          This area is private — only the site owner can log in.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground/30"
            />
          </div>
          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          <SubmitButton pending={isPending} />
        </form>
      </div>
    </div>
  );
}
