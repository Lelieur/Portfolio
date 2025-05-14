type PageTitleProps = {
  title: string;
  description: string;
};

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <section className="flex flex-col gap-0.5">
      <div className="flex w-fit flex-row items-center justify-between">
        <h1 className="text-lg font-medium leading-relaxed text-primary">
          {title}
        </h1>
      </div>
      <p className="text-sm leading-normal text-secondary">{description}</p>
    </section>
  );
}
