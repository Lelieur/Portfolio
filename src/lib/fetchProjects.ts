import { Project } from '@/types/project';

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  return res.json();
}
