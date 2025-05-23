export type AboutDetails = {
  title: string;
  content: string | string[] | Record<string, string[]>[];
  type: string;
  links?: Record<string, string>[];
};

export type Project = {
  _id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  slug: string;
  featured: boolean;
  details: Record<string, string | string[]>;
  about: AboutDetails[];
};

export type ProjectSummary = Pick<
  Project,
  "title" | "year" | "slug" | "image" | "description"
>;
