import Link from "next/link";

type AdminContentListItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  meta: string;
  status: string;
  selected?: boolean;
};

type AdminContentListProps = {
  title: string;
  description: string;
  createHref: string;
  items: AdminContentListItem[];
};

const statusTone: Record<string, string> = {
  draft: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  published: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "draft+published": "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

export function AdminContentList({
  title,
  description,
  createHref,
  items,
}: AdminContentListProps) {
  return (
    <aside className="flex flex-col gap-4">
      <header className="flex flex-col gap-3 rounded-md border border-primary/15 p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium text-primary">{title}</h2>
          <p className="text-sm text-secondary">{description}</p>
        </div>
        <Link
          href={createHref}
          className="inline-flex w-fit rounded-md border border-primary/15 px-3 py-2 text-sm text-primary transition hover:border-primary/30 hover:bg-primary/5"
        >
          New document
        </Link>
      </header>

      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-current={item.selected ? "page" : undefined}
            className={`grid gap-3 rounded-md border p-4 transition ${
              item.selected
                ? "border-primary/30 bg-primary/5"
                : "border-primary/15 hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium text-primary">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-secondary">
                  {item.description}
                </p>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${
                  statusTone[item.status] ?? statusTone.draft
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-xs text-secondary">{item.meta}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
