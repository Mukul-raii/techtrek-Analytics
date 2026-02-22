import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HackerNewsStory, TrendingRepository } from "@/types/trending";
import { formatNumber } from "@/utils/formatters";
import { ExternalLink, MessageCircle, Star, Trophy } from "lucide-react";

type TopTenMode = "repositories" | "stories";

interface TopTenPanelProps {
  mode: TopTenMode;
  items: TrendingRepository[] | HackerNewsStory[];
}

export function TopTenPanel({ mode, items }: TopTenPanelProps) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white shadow-sm xl:sticky xl:top-4">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <Trophy className="h-4 w-4 text-amber-500" />
          Top 10 {mode === "repositories" ? "Repositories" : "Stories"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
            No ranked items found for current filters.
          </p>
        ) : (
          items.map((item, index) => {
            const isRepository = mode === "repositories";
            const title = isRepository
              ? (item as TrendingRepository).repository
              : (item as HackerNewsStory).title;
            const url = item.url;
            const primaryValue = isRepository
              ? formatNumber((item as TrendingRepository).stars || 0)
              : formatNumber((item as HackerNewsStory).points || 0);

            return (
              <a
                key={item.id}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-slate-50"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="rounded-md bg-slate-100 text-slate-700"
                    >
                      #{index + 1}
                    </Badge>
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                      {title}
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    {isRepository ? (
                      <Star className="h-3.5 w-3.5" />
                    ) : (
                      <Trophy className="h-3.5 w-3.5" />
                    )}
                    {primaryValue}
                  </span>
                  {!isRepository ? (
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {formatNumber((item as HackerNewsStory).comments || 0)}
                    </span>
                  ) : null}
                </div>
              </a>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
