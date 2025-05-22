import ProjectCard from './ProjectCard';
import { ProjectSummary } from '@/types/project';

interface ProjectListProps {
  projects: ProjectSummary[];
}

export default async function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.slug} {...project} />
      ))}
    </div>
  );
}
