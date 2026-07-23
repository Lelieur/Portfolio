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
    <section className="ui-detail-grid">
      {Object.entries(details).map(([key, value]) => (
        <ProjectDetailsCard key={key} detail={{ [key]: value.toString() }}>
          {!Array.isArray(value) && value.includes("http") ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-inline-link ui-detail-link"
            >
              <span className="ui-detail-link-content">
                <span>{value}</span>
                <span className="ui-external-link-icon">
                  <ArrowUpRightIcon />
                </span>
              </span>
            </a>
          ) : !Array.isArray(value) ? (
            <p className="ui-detail-value ui-detail-value--capitalize">
              {value}
            </p>
          ) : (
            <ul className="ui-detail-tags">
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
