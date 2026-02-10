// Search Types
export interface SearchFilters {
  query: string;
  source: 'github' | 'hackernews' | 'all';
  language?: string;
  minStars?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResult {
  id: string;
  type: 'repository' | 'story';
  title: string;
  description: string;
  url: string;
  metadata: {
    stars?: number;
    score?: number;
    language?: string;
    author: string;
    date: string;
  };
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  suggestions: string[];
  isSearching: boolean;
  error: string | null;
}
