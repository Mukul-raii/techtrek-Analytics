import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import type { ShellHeaderProps } from "@/types/uiTheme";

interface HeaderProps {
  onMenuClick?: () => void;
}

const pageConfig: Record<string, Omit<ShellHeaderProps, "user">> = {
  "/": {
    title: "Dashboard",
    subtitle:
      "Overview of trending tech data, GitHub statistics, and HackerNews insights",
    searchPlaceholder: "Search here...",
  },
  "/dashboard": {
    title: "Dashboard",
    subtitle:
      "Overview of trending tech data, GitHub statistics, and HackerNews insights",
    searchPlaceholder: "Search here...",
  },
  "/trending": {
    title: "Trending",
    subtitle: "Discover the most popular repositories and stories right now",
    searchPlaceholder: "Search topics or repositories...",
  },
  "/analytics": {
    title: "Analytics",
    subtitle:
      "In-depth analysis of tech trends, language adoption, and community insights",
    searchPlaceholder: "Search analytics...",
  },
  "/search": {
    title: "Search",
    subtitle:
      "Discover repositories, stories, and trends across GitHub and HackerNews",
    searchPlaceholder: "Search anything...",
  },
};

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const page = pageConfig[location.pathname] ?? pageConfig["/dashboard"];

  return (
    <header className="panel-surface mb-3 shrink-0 px-3 py-3 md:px-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/dashboard" className="min-w-0">
            <h1 className="shell-title truncate">{page.title}</h1>
            <p className="subtle-text truncate">{page.subtitle}</p>
          </Link>
        </div>
      </div>
    </header>
  );
}
