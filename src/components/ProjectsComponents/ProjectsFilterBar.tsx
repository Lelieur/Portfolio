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
    <div className="ui-filter-bar">
      <button
        className="ui-filter-option"
        data-active={category === null}
        onClick={() => setCategory(null)}
      >
        <span className="text-sm leading-normal">All</span>
        <sup className="text-xs leading-normal">{totalProjects.length}</sup>
      </button>
      {categoriesFilter.map((categoryFilter, index) => {
        return (
          <button
            key={`${categoryFilter.value}-${index}`}
            className="ui-filter-option"
            data-active={category === categoryFilter.value}
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
