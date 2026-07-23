"use client";

import { useQueryState } from "nuqs";
import { getUniqueWithCount } from "@/utils/getUniqueWithCount";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useState } from "react";
import { ListFilter } from "@/components/ui/ListFilter";

type FilterBarProps = {
  projectCategories: string[];
};

export default function ProjectsFilterBar({
  projectCategories,
}: FilterBarProps) {
  const [category, setCategory] = useQueryState("category", {
    shallow: false,
    history: "push",
  });

  const [totalProjects] = useState(() => projectCategories);
  const [categoriesFilter] = useState(() =>
    getUniqueWithCount(projectCategories)
  );

  return (
    <ListFilter
      ariaLabel="Filtrar proyectos"
      value={category}
      onChange={setCategory}
      options={[
        { value: null, label: "All", count: totalProjects.length },
        ...categoriesFilter.map((categoryFilter) => ({
          value: categoryFilter.value,
          label: capitalizeFirstLetter(categoryFilter.value),
          count: Number(categoryFilter.count),
        })),
      ]}
    />
  );
}
