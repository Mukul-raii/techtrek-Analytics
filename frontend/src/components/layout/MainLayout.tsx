import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAppStore } from "@/store/useAppStore";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { ui, toggleSidebar } = useAppStore();

  return (
    <div className="h-screen w-full overflow-hidden ">
      <div className="app-shell">
        <div className="flex h-full min-h-0 gap-3">
          <Sidebar isOpen={ui.sidebarOpen} onClose={toggleSidebar} />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <Header onMenuClick={toggleSidebar} />
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/65 p-3 md:p-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
