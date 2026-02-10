import { Link, useLocation } from 'react-router-dom';
import { DESIGN } from '@/constants/design';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm"
      style={{
        borderColor: 'hsl(0 0% 90%)',
        boxShadow: DESIGN.shadow.paper,
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-md">
                <span className="text-white font-bold text-base sm:text-lg">TP</span>
              </div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-tight">
                  TechPulse
                </h1>
                <p className="text-xs text-gray-600 leading-none">Analytics</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors py-1 ${
                isActive('/dashboard') || isActive('/')
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/trending"
              className={`text-sm font-medium transition-colors py-1 ${
                isActive('/trending')
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trending
            </Link>
            <Link
              to="/analytics"
              className={`text-sm font-medium transition-colors py-1 ${
                isActive('/analytics')
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </Link>
            <Link
              to="/search"
              className={`text-sm font-medium transition-colors py-1 ${
                isActive('/search')
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Search
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
