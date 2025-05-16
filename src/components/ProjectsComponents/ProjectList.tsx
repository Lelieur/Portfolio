import ProjectCard from './ProjectCard';
import { Project } from '@/types/project';

interface ProjectListProps {
  projects: Project[];
}

export default async function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-6">
      {projects.map((project) => (
        <ProjectCard key={project._id} {...project} />
      ))}
    </div>
  );
}
