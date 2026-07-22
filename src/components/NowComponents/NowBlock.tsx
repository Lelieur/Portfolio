type NowBlockProps = {
  title: string;
  lines: string[];
};

export default function NowBlock({ title, lines }: NowBlockProps) {
  return (
    <div className="ui-content-block">
      <p className="text-base leading-normal font-medium text-primary">
        {title}
      </p>
      <div className="ui-content-lines">
        {lines.map((line, idx) => (
          <p key={idx} className="text-base leading-normal text-primary">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
