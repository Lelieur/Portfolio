import Link from 'next/link';
import Image from 'next/image';
import { ProjectSummary } from '@/types/project';

export default function ProjectCard({ image, title, year, description, slug }: ProjectSummary) {
  return (
    <Link href={`projects/${slug}`}>
      <div className="ui-content-card">
        <div className="ui-content-card-media">
          <Image
            width="1200"
            height="600"
            src={image}
            alt={title}
            priority
            className="ui-content-card-image"
          />
        </div>
        <div className="ui-content-card-body">
          <div className="ui-content-card-header">
            <p className="text-base leading-normal relative flex flex-col gap-0.5 font-medium text-primary underline decoration-secondary decoration-dotted underline-offset-8">
              {title}
            </p>
            <div className="ui-content-card-divider" />
            <p className="text-sm leading-normal relative text-primary">{year}</p>
          </div>
          <p className="ui-content-card-summary">{description}</p>
        </div>
      </div>
    </Link>
  );
}
