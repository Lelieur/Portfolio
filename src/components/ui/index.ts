import { createElement, type ComponentProps } from "react";
import { Drawer, useOverlayState } from "@heroui/react";
import { Button } from "./Button";
import { Card } from "./Card";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return createElement("input", { className: `ui-input ${className}`.trim(), ...props });
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return createElement("textarea", { className: `ui-input ${className}`.trim(), ...props });
}

export function Checkbox({ className = "", ...props }: ComponentProps<"input">) {
  return createElement("input", { type: "checkbox", className, ...props });
}

export { ListFilter } from "./ListFilter";
export { default as ThemePreference } from "../ThemePreference";

export { Button, Drawer, useOverlayState };

export { Card };
