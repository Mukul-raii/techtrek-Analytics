import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsService } from "@/services/analyticsService";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LanguageStats } from "@/types/analytics";

interface LanguageGrowthProps {
  days?: number;
  limit?: number;
}

export function LanguageGrowth({ days = 7, limit = 10 }: LanguageGrowthProps) {
  const [languages, setLanguages] = useState<LanguageStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLanguageGrowth() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await analyticsService.getLanguageGrowth(days);
        setLanguages(data.slice(0, limit));
      } catch (err) {
        console.error("Error fetching language growth:", err);
        setError("Failed to load language growth data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLanguageGrowth();
  }, [days, limit]);

  const getTrendIcon = (trend: string) => {
    if (trend === "up")
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down")
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-500";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Language Growth Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Language Growth Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Growth Trends</CardTitle>
        <p className="text-sm text-muted-foreground">
          Last {days} days comparison
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {languages.map((lang, index) => (
            <div
              key={lang.language}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {lang.language}
                    </span>
                    {getTrendIcon(lang.trend)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {lang.count} repositories
                    </span>
                    {lang.change !== undefined && lang.change !== 0 && (
                      <span className="text-xs text-gray-400">
                        ({lang.change > 0 ? "+" : ""}
                        {lang.change} from previous)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                {lang.changePercent !== undefined && (
                  <>
                    <span
                      className={cn(
                        "text-lg font-bold",
                        getTrendColor(lang.changePercent)
                      )}
                    >
                      {lang.changePercent > 0 ? "+" : ""}
                      {lang.changePercent.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500">growth</span>
                  </>
                )}
              </div>
            </div>
          ))}

          {languages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No language growth data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
