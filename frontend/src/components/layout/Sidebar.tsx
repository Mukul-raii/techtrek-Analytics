import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { icon: "📊", label: "Dashboard", href: "/dashboard" },
    { icon: "🔥", label: "Trending", href: "/trending" },
    { icon: "📈", label: "Analytics", href: "/analytics" },
    { icon: "🔍", label: "Search", href: "/search" },
  ];

  const isActive = (path: string) =>
    location.pathname === path ||
    (path === "/dashboard" && location.pathname === "/");

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 sm:top-16 left-0 bottom-0 w-64 bg-white border-r z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:top-0 lg:min-h-screen
        `}
        style={{ borderColor: "hsl(0 0% 90%)" }}
      >
        <nav className="p-3 sm:p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => onClose()}
              className={`
                flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg 
                text-sm font-medium transition-all duration-200
                ${
                  isActive(item.href)
                    ? "bg-gray-100 text-gray-900 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <span className="text-lg sm:text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t"
          style={{ borderColor: "hsl(0 0% 90%)" }}
        >
          <div className="text-xs text-gray-500 text-center">
            <p className="font-medium">TechPulse v1.0</p>
            <p className="mt-1">© 2024 Analytics</p>
          </div>
        </div>
      </aside>
    </>
  );
}
