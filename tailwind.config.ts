import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        emerald: "var(--emerald)",
        gray: "var(--gray)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        border: "var(--border)",
        focus: "var(--focus)",
        action: "var(--action-background)",
      },
      borderRadius: {
        control: "var(--radius-control)",
        card: "var(--radius-card)",
      },
      fontFamily: {
        sans: "var(--font-geist-sans)",
        mono: "var(--font-geist-mono)",
        inter: "var(--font-inter)",
      },
    },
  },
  plugins: [typography],
};

export default config;
