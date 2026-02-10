import { apiClient } from '@/api/client';
import type { SearchFilters, SearchResult } from '@/types/search';

interface BackendSearchResponse {
  status: string;
  count: number;
  data: any[];
}

class SearchService {
  async search(filters: SearchFilters) {
    const params: Record<string, string | number> = {
      q: filters.query,
      limit: 50,
    };

    if (filters.source && filters.source !== 'all') {
      params.source = filters.source;
    }
    if (filters.language) params.language = filters.language;
    if (filters.minStars) params.minStars = filters.minStars;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;

    const response = await apiClient.get<BackendSearchResponse>('/api/search', { params });
    
    // Transform backend data to SearchResult format
    const results: SearchResult[] = response.data.map((item: any) => ({
      id: item.id || item._id,
      type: item.source === 'github' ? 'repository' : 'story',
      title: item.title || item.name || item.full_name,
      description: item.description || '',
      url: item.url || item.html_url,
      metadata: {
        stars: item.stars || item.stargazers_count,
        score: item.score,
        language: item.language,
        author: item.author || item.owner?.login || 'Unknown',
        date: item.created_at || item.time || new Date().toISOString(),
      },
    }));

    return {
      results,
      total: response.count,
      query: filters.query,
    };
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];
    
    try {
      const response = await apiClient.get<{ suggestions: string[] }>('/api/search/suggest', {
        params: { q: query },
      });
      return response.suggestions || [];
    } catch (error) {
      // Return empty array if suggestions endpoint doesn't exist yet
      return [];
    }
  }

  async getPopularSearches(): Promise<string[]> {
    // Return common popular searches
    return ['React', 'AI', 'Machine Learning', 'Web3', 'TypeScript', 'Python', 'Docker', 'Kubernetes'];
  }
}

export const searchService = new SearchService();
