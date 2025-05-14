type ProjectCardProps = {
  image: string;
  title: string;
  year: number;
  description: string;
};

export default function ProjectCard({
  image,
  year,
  description,
}: ProjectCardProps) {
  return <div>Esto es una card de proyecto</div>;
}
