import { ProjectSummary } from "@/types/project";

export async function fetchProjects(filters?: {
  category?: string;
}): Promise<ProjectSummary[]> {
  const params = new URLSearchParams();

  if (filters?.category) params.set("category", filters.category);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects?${params}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}
