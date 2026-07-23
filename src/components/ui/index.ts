import { createElement, type ComponentProps } from "react";

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

export {
  Button,
  Card,
  Drawer,
  useOverlayState,
} from "@heroui/react";
