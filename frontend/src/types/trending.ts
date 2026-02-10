// Trending Data Types
export interface TrendingRepository {
  id: string;
  source: 'github';
  repository: string; // Backend uses 'repository' not 'name'
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  timestamp: string;
  author?: string;
  avatar_url?: string;
  stars_today?: number;
}

export interface HackerNewsStory {
  id: string;
  source: 'hackernews';
  title: string;
  url: string;
  points: number; // Backend uses 'points' not 'score'
  comments: number; // Backend uses 'comments' not 'descendants'
  author: string;
  timestamp: string;
  type?: 'story' | 'job' | 'poll';
}

export interface TrendingFilters {
  source: 'github' | 'hackernews' | 'all';
  language?: string;
  dateRange: 'today' | 'week' | 'month';
  sortBy: 'stars' | 'score' | 'trending' | 'recent';
}

export interface TrendingState {
  repositories: TrendingRepository[];
  stories: HackerNewsStory[];
  filters: TrendingFilters;
  isLoading: boolean;
  error: string | null;
}
