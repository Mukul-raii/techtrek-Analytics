import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/store/useAppStore';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { ui, toggleSidebar } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex w-full">
        <Sidebar isOpen={ui.sidebarOpen} onClose={toggleSidebar} />
        
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="container mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
