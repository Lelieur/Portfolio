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
            <p className="ui-content-card-title">
              {title}
            </p>
            <div className="ui-content-card-divider" />
            <p className="ui-content-card-meta">{year}</p>
          </div>
          <p className="ui-content-card-summary">{description}</p>
        </div>
      </div>
    </Link>
  );
}
