import { AboutDetails } from '@/types/project';

interface ProjectSectionProps {
  about: AboutDetails;
}

export default function ProjectSection({ about }: ProjectSectionProps) {
  return <div>{about.title}</div>;
}
