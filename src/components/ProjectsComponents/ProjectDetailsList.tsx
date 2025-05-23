import ProjectDetailsCard from "./ProjectDetailsCard";
import { Project } from "@/types/project";
import { ArrowUpRightIcon } from "@heroicons/react/16/solid";

interface ProjectDetailsListProps {
  details: Project["details"];
}

export default function ProjectDetailsList({
  details,
}: ProjectDetailsListProps) {
  return (
    <section className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
      {Object.entries(details).map(([key, value]) => (
        <ProjectDetailsCard key={key} detail={{ [key]: value.toString() }}>
          {!Array.isArray(value) && value.includes("http") ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-secondary decoration-dotted underline-offset-4 block w-fit text-primary hover:text-secondary"
            >
              <span className="group inline text-base">
                <span className="inline">{value}</span>
                <span className="inline-flex whitespace-nowrap">
                  <ArrowUpRightIcon className="ml-1 inline-flex aspect-square size-4 align-text-bottom duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </span>
            </a>
          ) : !Array.isArray(value) ? (
            <p className="text-base leading-normal capitalize text-primary">
              {value}
            </p>
          ) : (
            <ul className="flex flex-row justify-between">
              {value.map((elm) => (
                <li key={elm} className="mr-1 last:mr-0">
                  {elm}
                </li>
              ))}
            </ul>
          )}
        </ProjectDetailsCard>
      ))}
    </section>
  );
}
