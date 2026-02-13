import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTrendingTopics } from "@/hooks/useTrendingTopics";
import { Loader2, TrendingUp } from "lucide-react";

interface TrendingTopicsProps {
  source?: "github" | "hackernews" | "all";
  limit?: number;
}

export function TrendingTopics({
  source = "github",
  limit = 10,
}: TrendingTopicsProps) {
  const { topics, isLoading, error } = useTrendingTopics(source, limit);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
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
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge
              key={`${topic.topic}-${topic.source}`}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
            >
              <span className="font-medium">{topic.topic}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({topic.frequency})
              </span>
            </Badge>
          ))}
        </div>
        {topics.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No trending topics found
          </p>
        )}
      </CardContent>
    </Card>
  );
}
