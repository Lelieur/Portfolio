"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/Button";

type ThemePreference = "system" | "light" | "dark";
type Theme = "light" | "dark";
const storageKey = "portfolio-theme";

function resolveTheme(preference: ThemePreference | null): Theme {
  if (preference === "light" || preference === "dark") return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function initialPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const preference = localStorage.getItem(storageKey);
  return preference === "light" || preference === "dark" ? preference : "system";
}

export default function ThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);
  const theme = resolveTheme(preference);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    applyTheme(theme);

    const onChange = () => {
      if (preference === "system") applyTheme(resolveTheme("system"));
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference, theme]);

  function toggleTheme() {
    const next = preference === "system" ? "light" : preference === "light" ? "dark" : "system";
    localStorage.setItem(storageKey, next);
    setPreference(next);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="ui-theme-toggle"
      data-theme={theme}
      data-theme-preference={preference}
      aria-label={`Theme: ${preference}. Switch to ${preference === "system" ? "light" : preference === "light" ? "dark" : "system"}`}
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
