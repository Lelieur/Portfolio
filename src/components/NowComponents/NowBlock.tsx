type NowBlockProps = {
  title: string;
  lines: string[];
};

export default function NowBlock({ title, lines }: NowBlockProps) {
  return (
    <div className="flex flex-col first:pt-0 last:pb-0 gap-8 py-8">
      <p className="text-base leading-normal font-medium text-primary">
        {title}
      </p>
      <div className="space-y-4 md:space-y-8">
        {lines.map((line, idx) => (
          <p key={idx} className="text-base leading-normal text-primary">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
