import Link from "next/link";
import "./BreadCrump.css";

type BreadcrumpProps = {
  items: string[];
};

export default function Breadcrump({ items }: BreadcrumpProps) {
  return (
    <nav className="ui-breadcrumb flex-grow overflow-hidden">
      <ul className="ui-breadcrumb-list">
        <span className="text-sm leading-normal text-secondary">/</span>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return !isLast ? (
            <li
              key={item}
              className="ui-breadcrumb-item animate-[fade-in-right_0.5s_ease-out_forwards]"
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
