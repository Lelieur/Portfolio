import { ArrowUpRightIcon } from "@heroicons/react/16/solid";

type SocialLinkProps = {
  href: string;
  label: string;
};

export default function SocialLink({ href, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-dotted underline-offset-4 "
    >
      <span className="group inline text-base">
        <span className="inline">{label}</span>
        <span className="inline-flex whitespace-nowrap">
          <ArrowUpRightIcon className="ml-1 inline-flex aspect-square size-4 align-text-bottom duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </span>
    </a>
  );
}
