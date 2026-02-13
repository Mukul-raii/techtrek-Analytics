import { useEffect, useState, useCallback } from "react";
import { trendingService } from "@/services/trendingService";

interface TrendingTopic {
  topic: string;
  source: string;
  frequency: number;
  last_seen: string;
}

interface UseTrendingTopicsReturn {
  topics: TrendingTopic[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTrendingTopics(
  source: "github" | "hackernews" | "all" = "github",
  limit: number = 20
): UseTrendingTopicsReturn {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await trendingService.getTrendingTopics(source, limit);
      setTopics(data);
    } catch (err) {
      console.error("Error fetching trending topics:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch trending topics"
      );
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  }, [source, limit]);

  useEffect(() => {
    fetchTrendingTopics();
  }, [fetchTrendingTopics]);

  return {
    topics,
    isLoading,
    error,
    refetch: fetchTrendingTopics,
  };
}
