type PageTitleProps = {
  title: string;
  description: string;
};

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <header className="ui-page-title">
      <h1 className="text-lg font-medium leading-relaxed text-primary">
        {title}
      </h1>
      <p className="text-sm leading-normal text-secondary">{description}</p>
    </header>
  );
}
