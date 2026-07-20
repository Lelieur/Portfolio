"use client";

import { useEffect, useRef } from "react";

const MESSAGE = "You have unsaved changes. Leave this editor?";

export function useUnsavedChangesWarning(enabled: boolean) {
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!enabledRef.current) return;
      event.preventDefault();
      event.returnValue = MESSAGE;
    };

    const handleClick = (event: MouseEvent) => {
      if (!enabledRef.current || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as Element | null)?.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const href = link.getAttribute("href");
      const target = link.getAttribute("target");
      if (!href || href.startsWith("#") || target === "_blank") return;

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      if (destination.href === current.href) return;

      if (!window.confirm(MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.history.pushState({ editorialGuard: true }, "", window.location.href);

    const handlePopState = () => {
      if (!enabledRef.current) return;
      if (window.confirm(MESSAGE)) {
        window.removeEventListener("popstate", handlePopState);
        window.history.back();
        return;
      }
      window.history.pushState({ editorialGuard: true }, "", window.location.href);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled]);
}
