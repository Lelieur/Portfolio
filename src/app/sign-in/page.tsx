import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignInForm } from "./SignInForm";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-[50vh] flex-col justify-center gap-8">
      <section className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          Admin access
        </p>
        <h1 className="text-3xl font-medium text-primary">Sign in</h1>
        <p className="text-base text-secondary">
          Use the single owner account stored in your database.
        </p>
      </section>
      <SignInForm />
    </main>
  );
}
