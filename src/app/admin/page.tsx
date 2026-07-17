import { auth } from "@/auth";
import Link from "next/link";
import { CONTENT_DOMAINS } from "@/server/content/domains";
import { SignOutButton } from "./SignOutButton";

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="flex flex-col gap-10">
      <section className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">
            Admin
          </p>
          <h1 className="text-3xl font-medium text-primary">
            Foundation ready
          </h1>
          <p className="text-base text-secondary">
            Signed in as {session?.user?.email}. Future content CRUD will plug
            into the shared server content boundary below.
          </p>
        </div>
        <SignOutButton />
      </section>

      <section className="grid gap-4">
        {CONTENT_DOMAINS.map((domain) => (
          <article
            key={domain.key}
            className="rounded-md border border-primary/15 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-primary">
                  {domain.label}
                </h2>
                <p className="text-sm text-secondary">{domain.description}</p>
              </div>
              <span className="rounded-full border border-primary/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-secondary">
                {domain.kind}
              </span>
            </div>
            {domain.key === "thoughts" && (
              <Link href="/admin/thoughts" className="mt-4 inline-block underline">
                Manage Thoughts
              </Link>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
