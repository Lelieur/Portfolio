import ProjectCard from './ProjectCard';
import { projects } from '@/data/projects';

export default function ProjectList() {
  return (
    <div className="flex flex-col gap-6">
      {projects.map((project, id) => (
        <ProjectCard key={id} {...project} />
      ))}
    </div>
  );
}
