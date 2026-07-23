type PageTitleProps = {
  title: string;
  description: string;
};

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <header className="ui-page-title">
      <h1 className="ui-heading-md">
        {title}
      </h1>
      <p className="ui-text-sm">{description}</p>
    </header>
  );
}
