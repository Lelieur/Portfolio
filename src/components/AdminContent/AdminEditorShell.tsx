type AdminEditorShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  sidebar: React.ReactNode;
  editor: React.ReactNode;
};

export function AdminEditorShell({
  eyebrow,
  title,
  description,
  sidebar,
  editor,
}: AdminEditorShellProps) {
  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-medium text-primary">{title}</h1>
        <p className="max-w-3xl text-base text-secondary">{description}</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        {sidebar}
        {editor}
      </section>
    </main>
  );
}
