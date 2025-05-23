import Link from "next/link";
import "./BreadCrump.css";

type BreadcrumpProps = {
  items: string[];
};

export default function Breadcrump({ items }: BreadcrumpProps) {
  return (
    <nav className="flex-grow overflow-hidden">
      <ul className="flex flex-row flex-wrap items-center gap-2 md:gap-3">
        <span className="text-sm leading-normal text-secondary">/</span>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return !isLast ? (
            <li
              key={item}
              className="flex flex-row gap-2 overflow-hidden text-ellipsis animate-[fade-in-right_0.5s_ease-out_forwards]"
            >
              <Link
                href={`/${item}`}
                className="text-sm leading-normal text-secondary group-hover:text-primary"
              >
                {item}
              </Link>
              <span className="text-sm leading-normal text-secondary">/</span>
            </li>
          ) : (
            <li
              key={item}
              className="overflow-hidden text-ellipsis animate-[fade-in-right_0.5s_ease-out_forwards]"
            >
              <p
                className={`text-sm leading-normal break-words ${
                  item !== "" ? "text-primary" : "text-secondary"
                }`}
              >
                {item !== "" ? item : "Web Developer"}
              </p>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
