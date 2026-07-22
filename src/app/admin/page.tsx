import { auth } from "@/auth";
import Link from "next/link";
import { CONTENT_DOMAINS } from "@/server/content/domains";
import { SignOutButton } from "./SignOutButton";

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="ui-page">
      <section className="ui-admin-header">
        <div className="ui-admin-header-content">
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

      <section className="ui-domain-grid">
        {CONTENT_DOMAINS.map((domain) => (
          <article
            key={domain.key}
            className="ui-domain-card"
          >
            <div className="ui-domain-card-header">
              <div className="ui-admin-domain-content">
                <h2 className="text-lg font-medium text-primary">
                  {domain.label}
                </h2>
                <p className="text-sm text-secondary">{domain.description}</p>
              </div>
              <span className="ui-badge">
                {domain.kind}
              </span>
            </div>
            {domain.key === "thoughts" && (
              <Link href="/admin/thoughts" className="ui-domain-link">
                Manage Thoughts
              </Link>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
