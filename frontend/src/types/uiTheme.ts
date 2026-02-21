import type { ReactNode } from "react";
export interface SurfaceTokens {
  app: string;
  canvas: string;
  panel: string;
  panelMuted: string;
  elevated: string;
}

export interface BorderTokens {
  subtle: string;
  default: string;
  strong: string;
}

export interface TextTokens {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
}

export interface AccentTokens {
  primary: string;
  primarySoft: string;
  success: string;
  warning: string;
  danger: string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ShadowTokens {
  soft: string;
  medium: string;
  float: string;
}

export interface UITheme {
  surface: SurfaceTokens;
  border: BorderTokens;
  text: TextTokens;
  accent: AccentTokens;
  chartPalette: string[];
  radius: RadiusTokens;
  shadow: ShadowTokens;
}

export interface ShellHeaderUser {
  name: string;
  email: string;
  initials: string;
}

export interface ShellHeaderProps {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  user: ShellHeaderUser;
  actions?: ReactNode;
}

export interface ShellSidebarItem {
  label: string;
  route: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface ShellSidebarSection {
  label: string;
  items: ShellSidebarItem[];
}

export interface KpiCardProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: "up" | "down" | "stable";
  tone?: "neutral" | "accent" | "success";
}

export interface ChartPanelProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyLabel?: string;
  error?: string | null;
  children?: ReactNode;
}
