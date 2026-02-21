import { Card, CardContent } from "@/components/ui/card";
import type { HackerNewsStory } from "@/types/trending";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";
import { MessageCircle, TrendingUp } from "lucide-react";

interface StoryCardProps {
  story: HackerNewsStory;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Card className="h-full rounded-xl border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <CardContent className="flex h-full flex-col pt-5">
        <h3 className="mb-4 text-base font-semibold leading-snug text-slate-900">{story.title}</h3>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-orange-700">
            <TrendingUp className="h-4 w-4" />
            {formatNumber(story.points)}
          </div>
          <div className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-blue-700">
            <MessageCircle className="h-4 w-4" />
            {formatNumber(story.comments)}
          </div>
          <div className="truncate text-xs text-slate-500">
            by <span className="font-medium text-slate-700">{story.author}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <span className="truncate text-xs text-slate-500">{formatRelativeTime(story.timestamp)}</span>
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Read
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
