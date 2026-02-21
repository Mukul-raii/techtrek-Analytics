import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import type { EnhancedTrendingItem } from "@/types/enhancedAnalytics";

interface UseEnhancedTrendingOptions {
  limit?: number;
  source?: string;
  timeRange?: string;
  sort?: string;
}

export function useEnhancedTrending(options: UseEnhancedTrendingOptions = {}) {
  const {
    limit = 50,
    source,
    timeRange = "week",
    sort = "popularity",
  } = options;

  const [items, setItems] = useState<EnhancedTrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTrendingItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get("/api/trending", {
          params: {
            limit,
            source,
            timeRange,
            sort,
            enhanced: "true",
          },
        });

        if (!isMounted) return;

        const data = (
          response as {
            data: { data: EnhancedTrendingItem[] };
          }
        ).data.data;
        setItems(data);
      } catch (err) {
        if (!isMounted) return;

        console.error("Error fetching enhanced trending:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch trending"
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTrendingItems();

    return () => {
      isMounted = false;
    };
  }, [limit, source, timeRange, sort]);

  return { items, isLoading, error };
}
