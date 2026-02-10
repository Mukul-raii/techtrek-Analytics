import { apiClient } from '@/api/client';
import type { TrendingRepository, HackerNewsStory, TrendingFilters } from '@/types/trending';

interface TrendingResponse {
  status: string;
  count: number;
  data: Array<TrendingRepository | HackerNewsStory>;
}

interface RepositoryResponse {
  status: string;
  count: number;
  data: TrendingRepository[];
}

interface StoryResponse {
  status: string;
  count: number;
  data: HackerNewsStory[];
}

class TrendingService {
  async getTrending(filters: TrendingFilters) {
    const params: Record<string, string | number> = {
      sort: filters.sortBy === 'trending' ? 'popularity' : filters.sortBy,
      limit: 50,
    };

    // Handle source filter
    if (filters.source !== 'all') {
      params.source = filters.source;
    }

    // Handle date range (map to backend format if needed)
    if (filters.dateRange) {
      params.date = filters.dateRange;
    }

    // Handle language filter
    if (filters.language) {
      params.language = filters.language;
    }

    console.log('Fetching trending with params:', params);
    const response = await apiClient.get<TrendingResponse>('/api/trending', { params });
    console.log('Trending response:', response);
    
    // Separate repositories and stories based on 'source' field
    const repositories: TrendingRepository[] = [];
    const stories: HackerNewsStory[] = [];

    response.data.forEach((item: any) => {
      if (item.source === 'github') {
        repositories.push(item as TrendingRepository);
      } else if (item.source === 'hackernews') {
        stories.push(item as HackerNewsStory);
      }
    });

    console.log('Separated:', { repositories: repositories.length, stories: stories.length });

    return {
      repositories,
      stories,
      total: response.count,
    };
  }

  async getRepositories(language?: string, dateRange?: string): Promise<TrendingRepository[]> {
    const params: Record<string, string> = { source: 'github', limit: '50' };
    
    if (language) params.language = language;
    if (dateRange) params.date = dateRange;

    const response = await apiClient.get<RepositoryResponse>('/api/trending', { params });
    return response.data;
  }

  async getStories(dateRange?: string): Promise<HackerNewsStory[]> {
    const params: Record<string, string> = { source: 'hackernews', limit: '50' };
    
    if (dateRange) params.date = dateRange;

    const response = await apiClient.get<StoryResponse>('/api/trending', { params });
    return response.data;
  }

  async getLanguages(): Promise<string[]> {
    // This would need a backend endpoint, for now return common languages
    return ['JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'Ruby', 'PHP'];
  }
}

export const trendingService = new TrendingService();
