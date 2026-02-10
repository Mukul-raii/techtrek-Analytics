import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { searchService } from '@/services/searchService';
import { useDebounce } from './useDebounce';

export function useSearch() {
  const { search, setSearchQuery, setSearchFilters, setSearchResults } = useAppStore();
  const debouncedQuery = useDebounce(search.query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch();
    }
  }, [debouncedQuery, search.filters]);

  const performSearch = async () => {
    if (!search.query) return;

    try {
      setSearchResults({ isSearching: true, error: null });
      const data = await searchService.search(search.filters);
      setSearchResults({
        results: data.results,
        isSearching: false,
      });
    } catch (error) {
      setSearchResults({
        isSearching: false,
        error: error instanceof Error ? error.message : 'Search failed',
      });
    }
  };

  const updateQuery = (query: string) => {
    setSearchQuery(query);
  };

  const updateFilters = (filters: Partial<typeof search.filters>) => {
    setSearchFilters(filters);
  };

  return {
    ...search,
    updateQuery,
    updateFilters,
    refetch: performSearch,
  };
}
