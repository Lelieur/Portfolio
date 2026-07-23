"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/Button";

type Theme = "light" | "dark";
const storageKey = "portfolio-theme";

function resolveTheme(preference: string | null): Theme {
  if (preference === "light" || preference === "dark") return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function initialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return resolveTheme(localStorage.getItem(storageKey));
}

export default function ThemePreference() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem(storageKey, next);
    setTheme(next);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="ui-theme-toggle"
      data-theme={theme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onPress={toggleTheme}
    >
      <span className="ui-theme-toggle-icon" aria-hidden="true">
        <SunIcon className="size-4" />
      </span>
      <span className="ui-theme-toggle-icon" aria-hidden="true">
        <MoonIcon className="size-4" />
      </span>
      <span
        className="ui-theme-toggle-thumb"
        data-theme={theme}
        aria-hidden="true"
      />
    </Button>
  );
}
