export const CONTENT_DOMAINS = [
  {
    key: "thoughts",
    label: "Thoughts",
    kind: "collection",
    description: "First-party long-form posts with draft, publish, and homepage featuring.",
  },
  {
    key: "experiments",
    label: "Experiments",
    kind: "collection",
    description: "Collection content with status, ordering, and homepage featuring.",
  },
  {
    key: "projects",
    label: "Projects",
    kind: "collection",
    description: "The richest content type with ordered detail fields and typed Project sections.",
  },
  {
    key: "about",
    label: "About",
    kind: "singleton",
    description: "CV-shaped singleton content with fixed resume sections.",
  },
  {
    key: "now",
    label: "Now",
    kind: "singleton",
    description: "Ordered singleton blocks with explicit publish behavior.",
  },
] as const;
