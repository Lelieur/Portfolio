import { Card as HeroCard } from "@heroui/react";
import type { ComponentProps } from "react";

type CardProps = Omit<ComponentProps<typeof HeroCard>, "variant"> & {
  variant?: "default" | "transparent";
};

function SharedCard({ variant = "default", ...props }: CardProps) {
  return <HeroCard {...props} variant={variant} />;
}

export const Card = Object.assign(SharedCard, {
  Header: HeroCard.Header,
  Title: HeroCard.Title,
  Description: HeroCard.Description,
  Content: HeroCard.Content,
  Footer: HeroCard.Footer,
});
