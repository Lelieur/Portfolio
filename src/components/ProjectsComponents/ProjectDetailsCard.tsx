import { ReactNode } from 'react';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

interface ProjectDetailsCardProps {
  detail: Record<string, string | string[]>;
  children: ReactNode;
}

export default function ProjectDetailsCard({ detail, children }: ProjectDetailsCardProps) {
  const detailTitle = capitalizeFirstLetter(Object.keys(detail)[0]);

  return (
    <div className="ui-detail-card">
      <p className="text-xs leading-normal text-secondary">{detailTitle}</p>
      {children}
    </div>
  );
}
