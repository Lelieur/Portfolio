"use client";

import { useQueryState } from "nuqs";
import { getUniqueWithCount } from "@/utils/getUniqueWithCount";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useState } from "react";

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
    <div className="flex flex-row items-center gap-3 overflow-auto md:gap-6">
      <button
        className={`${
          category === null
            ? "text-primary underline underline-offset-4"
            : "text-secondary"
        } flex flex-row items-center gap-1.5 p-1.5 cursor-pointer`}
        onClick={() => setCategory(null)}
      >
        <span className="text-sm leading-normal">All</span>
        <sup className="text-xs leading-normal">{totalProjects.length}</sup>
      </button>
      {categoriesFilter.map((categoryFilter, index) => {
        return (
          <button
            key={`${categoryFilter.value}-${index}`}
            className={`${
              category === categoryFilter.value
                ? "text-primary underline underline-offset-4"
                : "text-secondary"
            } flex flex-row items-center gap-1.5 p-1.5 cursor-pointer`}
            onClick={() => setCategory(categoryFilter.value)}
          >
            <span className="text-sm leading-normal">
              {capitalizeFirstLetter(categoryFilter.value)}
            </span>
            <sup className="text-xs leading-normal">
              {String(categoryFilter.count)}
            </sup>
          </button>
        );
      })}
    </div>
  );
}
