import { Project } from '@/types/project';

export async function fetchOneProject(slug: string): Promise<Project | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${slug}`, {
    cache: 'no-store', // cambiar a revalidate en producción
  });

  if (!res.ok) return null;

  return res.json();
}
