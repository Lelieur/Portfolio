"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
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
    <form action={formAction} className="ui-form">
      <label className="ui-form-field">
        Email
        <input
          required
          type="email"
          name="email"
          className="ui-input placeholder:text-secondary/70"
          placeholder="owner@example.com"
        />
      </label>
      <label className="ui-form-field">
        Password
        <input
          required
          minLength={8}
          type="password"
          name="password"
          className="ui-input placeholder:text-secondary/70"
          placeholder="Your owner password"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <Button
        type="submit"
        isDisabled={isPending}
        className="ui-control ui-control--primary"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
