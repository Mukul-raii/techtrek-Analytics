import { apiClient } from "@/api/client";
import type {
  TrendingRepository,
  HackerNewsStory,
  TrendingFilters,
} from "@/types/trending";

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
      sort: filters.sortBy === "trending" ? "popularity" : filters.sortBy,
      limit: 50,
    };

    // Handle source filter
    if (filters.source !== "all") {
      params.source = filters.source;
    }

    // Handle date range - use timeRange parameter for backend
    if (filters.dateRange) {
      params.timeRange = filters.dateRange;
    }

    // Handle language filter
    if (filters.language) {
      params.language = filters.language;
    }

    console.log("Fetching trending with params:", params);
    const response = await apiClient.get<TrendingResponse>("/api/trending", {
      params,
    });
    console.log("Trending response:", response);

    // Separate repositories and stories based on 'source' field
    const repositories: TrendingRepository[] = [];
    const stories: HackerNewsStory[] = [];

    response.data.forEach((item: any) => {
      if (item.source === "github") {
        repositories.push(item as TrendingRepository);
      } else if (item.source === "hackernews") {
        stories.push(item as HackerNewsStory);
      }
    });

    console.log("Separated:", {
      repositories: repositories.length,
      stories: stories.length,
    });

    return {
      repositories,
      stories,
      total: response.count,
    };
  }

  async getRepositories(
    language?: string,
    dateRange?: string
  ): Promise<TrendingRepository[]> {
    const params: Record<string, string> = { source: "github", limit: "50" };

    if (language) params.language = language;
    if (dateRange) params.timeRange = dateRange;

    const response = await apiClient.get<RepositoryResponse>("/api/trending", {
      params,
    });
    return response.data;
  }

  async getStories(dateRange?: string): Promise<HackerNewsStory[]> {
    const params: Record<string, string> = {
      source: "hackernews",
      limit: "50",
    };

    if (dateRange) params.timeRange = dateRange;

    const response = await apiClient.get<StoryResponse>("/api/trending", {
      params,
    });
    return response.data;
  }

  async getLanguages(): Promise<string[]> {
    try {
      // Use SQL-backed language stats endpoint
      const response = await apiClient.get<{
        status: string;
        source: string;
        data: {
          languages: Array<{ language: string; count: number }>;
        };
      }>("/api/analytics/languages/stats", {
        params: { source: "github" },
      });

      return response.data.languages.map((lang) => lang.language);
    } catch (error) {
      console.error("Error fetching languages:", error);
      // Fallback to common languages
      return [
        "JavaScript",
        "Python",
        "TypeScript",
        "Java",
        "Go",
        "Rust",
        "C++",
        "Ruby",
        "PHP",
      ];
    }
  }

  async getTrendingTopics(
    source: "github" | "hackernews" | "all" = "github",
    limit: number = 20
  ): Promise<
    Array<{
      topic: string;
      source: string;
      frequency: number;
      last_seen: string;
    }>
  > {
    try {
      const params: Record<string, string | number> = { limit };
      if (source !== "all") {
        params.source = source;
      }

      const response = await apiClient.get<{
        status: string;
        count: number;
        data: Array<{
          topic: string;
          source: string;
          frequency: number;
          last_seen: string;
        }>;
      }>("/api/trending/topics/trending", { params });

      return response.data;
    } catch (error) {
      console.error("Error fetching trending topics:", error);
      return [];
    }
  }
}

export const trendingService = new TrendingService();
