import type { UITheme } from "@/types/uiTheme";

export const DASHBOARD_THEME: UITheme = {
  surface: {
    app: "hsl(215 31% 91%)",
    canvas: "hsl(210 24% 96%)",
    panel: "hsl(0 0% 100%)",
    panelMuted: "hsl(210 20% 98%)",
    elevated: "hsl(0 0% 100%)",
  },
  border: {
    subtle: "hsl(210 20% 90%)",
    default: "hsl(210 16% 84%)",
    strong: "hsl(213 18% 72%)",
  },
  text: {
    primary: "hsl(224 20% 16%)",
    secondary: "hsl(218 16% 33%)",
    muted: "hsl(215 11% 52%)",
    inverse: "hsl(0 0% 100%)",
  },
  accent: {
    primary: "hsl(214 76% 39%)",
    primarySoft: "hsl(214 73% 93%)",
    success: "hsl(158 64% 36%)",
    warning: "hsl(35 86% 48%)",
    danger: "hsl(0 77% 56%)",
  },
  chartPalette: [
    "hsl(214 76% 39%)",
    "hsl(209 61% 65%)",
    "hsl(215 33% 78%)",
    "hsl(202 56% 76%)",
    "hsl(222 24% 69%)",
  ],
  radius: {
    sm: "0.6rem",
    md: "0.9rem",
    lg: "1.1rem",
    xl: "1.4rem",
  },
  shadow: {
    soft: "0 2px 5px rgb(15 23 42 / 0.05)",
    medium: "0 10px 24px rgb(15 23 42 / 0.08)",
    float: "0 24px 48px rgb(37 99 235 / 0.10)",
  },
};
