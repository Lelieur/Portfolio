type NowBlockProps = {
  title: string;
  lines: string[];
};

export default function NowBlock({ title, lines }: NowBlockProps) {
  return (
    <div className="ui-content-block">
      <p className="ui-content-block-title">
        {title}
      </p>
      <div className="ui-content-lines">
        {lines.map((line, idx) => (
          <p key={idx} className="ui-now-copy">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
