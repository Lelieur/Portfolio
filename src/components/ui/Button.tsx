import { Button as HeroButton } from "@heroui/react";
import type { ComponentProps } from "react";

type ButtonProps = Omit<ComponentProps<typeof HeroButton>, "size" | "variant"> & {
  size?: "sm" | "md" | "icon";
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ size = "md", variant = "primary", isIconOnly, ...props }: ButtonProps) {
  return (
    <HeroButton
      {...props}
      size={size === "icon" ? "sm" : size}
      variant={variant}
      isIconOnly={isIconOnly || size === "icon"}
    />
  );
}
