import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TrendingState, TrendingFilters } from '@/types/trending';
import type { AnalyticsState } from '@/types/analytics';
import type { SearchState, SearchFilters } from '@/types/search';

interface AppState {
  // Trending State
  trending: TrendingState;
  setTrendingFilters: (filters: Partial<TrendingFilters>) => void;
  setTrendingData: (data: Partial<TrendingState>) => void;
  
  // Analytics State
  analytics: AnalyticsState;
  setAnalyticsData: (data: Partial<AnalyticsState>) => void;
  
  // Search State
  search: SearchState;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  setSearchResults: (data: Partial<SearchState>) => void;
  
  // UI State
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
  };
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial Trending State
      trending: {
        repositories: [],
        stories: [],
        filters: {
          source: 'all',
          dateRange: 'today',
          sortBy: 'trending',
        },
        isLoading: false,
        error: null,
      },
      
      setTrendingFilters: (filters) =>
        set((state) => ({
          trending: {
            ...state.trending,
            filters: { ...state.trending.filters, ...filters },
          },
        })),
      
      setTrendingData: (data) =>
        set((state) => ({
          trending: { ...state.trending, ...data },
        })),
      
      // Initial Analytics State
      analytics: {
        languageStats: [],
        trendData: [],
        metrics: [],
        isLoading: false,
        error: null,
      },
      
      setAnalyticsData: (data) =>
        set((state) => ({
          analytics: { ...state.analytics, ...data },
        })),
      
      // Initial Search State
      search: {
        query: '',
        filters: {
          query: '',
          source: 'all',
        },
        results: [],
        suggestions: [],
        isSearching: false,
        error: null,
      },
      
      setSearchQuery: (query) =>
        set((state) => ({
          search: {
            ...state.search,
            query,
            filters: { ...state.search.filters, query },
          },
        })),
      
      setSearchFilters: (filters) =>
        set((state) => ({
          search: {
            ...state.search,
            filters: { ...state.search.filters, ...filters },
          },
        })),
      
      setSearchResults: (data) =>
        set((state) => ({
          search: { ...state.search, ...data },
        })),
      
      // Initial UI State
      ui: {
        sidebarOpen: true,
        theme: 'light',
      },
      
      toggleSidebar: () =>
        set((state) => ({
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
        })),
      
      setTheme: (theme) =>
        set((state) => ({
          ui: { ...state.ui, theme },
        })),
    }),
    { name: 'AppStore' }
  )
);
