"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await signOut({ callbackUrl: "/sign-in" });
        });
      }}
      disabled={isPending}
      className="rounded-md border border-primary/15 px-3 py-2 text-sm text-primary disabled:opacity-60"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
