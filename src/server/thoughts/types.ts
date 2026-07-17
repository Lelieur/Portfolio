export type Thought = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  publishedDate: string;
  body: string;
  order: number;
  featured: boolean;
  featuredOrder: number;
};

export const EMPTY_THOUGHT: Thought = {
  title: "",
  slug: "",
  excerpt: "",
  coverImageUrl: "",
  publishedDate: new Date().toISOString(),
  body: "",
  order: 0,
  featured: false,
  featuredOrder: 0,
};
