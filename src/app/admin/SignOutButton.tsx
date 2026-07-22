"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      onPress={() => {
        startTransition(async () => {
          await signOut({ callbackUrl: "/sign-in" });
        });
      }}
      isDisabled={isPending}
      className="ui-control"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
