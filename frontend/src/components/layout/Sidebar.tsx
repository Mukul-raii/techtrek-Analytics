import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  LayoutGrid,
  Search,
  CheckCircle2,
  Flame,
} from "lucide-react";
import type { ShellSidebarSection } from "@/types/uiTheme";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections: ShellSidebarSection[] = [
  {
    label: "Menu",
    items: [
      {
        label: "Dashboard",
        route: "/dashboard",
        icon: <LayoutGrid className="h-4 w-4" />,
      },
      {
        label: "Trending",
        route: "/trending",
        icon: <Flame className="h-4 w-4" />,
      },
      {
        label: "Analytics",
        route: "/analytics",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        label: "Search",
        route: "/search",
        icon: <Search className="h-4 w-4" />,
      },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (route: string) => {
    if (route === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === route;
  };

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[290px] bg-white p-3 transition-transform duration-300 ease-out lg:static lg:h-full lg:shrink-0 lg:translate-x-0 lg:w-[250px] lg:bg-transparent lg:p-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="panel-surface flex h-full flex-col gap-3 overflow-hidden p-3">
          <div className="panel-muted flex items-center gap-3 px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-900">TechPulse</p>
              <p className="text-xs text-slate-500">Analytics</p>
            </div>
          </div>

          <div className="flex-1 px-1">
            {sections.map((section) => (
              <div key={section.label} className="mb-4">
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = isActive(item.route);
                    return (
                      <Link
                        key={`${section.label}-${item.label}`}
                        to={item.route}
                        onClick={onClose}
                        className={`
                          flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors
                          ${
                            active
                              ? "bg-blue-100 text-blue-800"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }
                        `}
                      >
                        <span className="flex items-center gap-2.5">
                          {item.icon}
                          <span>{item.label}</span>
                        </span>
                        {item.badge ? (
                          <span className="rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
