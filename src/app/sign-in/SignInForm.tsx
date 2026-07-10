"use client";

import { useActionState } from "react";
import { signInWithCredentials } from "./actions";

const initialState = {
  error: null as string | null,
};

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInWithCredentials,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm text-primary">
        Email
        <input
          required
          type="email"
          name="email"
          className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base text-primary outline-none placeholder:text-secondary/70"
          placeholder="owner@example.com"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm text-primary">
        Password
        <input
          required
          minLength={8}
          type="password"
          name="password"
          className="rounded-md border border-primary/15 bg-transparent px-3 py-2 text-base text-primary outline-none placeholder:text-secondary/70"
          placeholder="Your owner password"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
