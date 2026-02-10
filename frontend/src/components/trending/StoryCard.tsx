import { Card, CardContent } from "@/components/ui/card";
import type { HackerNewsStory } from "@/types/trending";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";

interface StoryCardProps {
  story: HackerNewsStory;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md h-full flex flex-col">
      <CardContent className="pt-4 sm:pt-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 leading-snug">
          {story.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <span>⬆️</span>
            <span className="font-medium">{formatNumber(story.points)}</span>
            <span className="hidden xs:inline">points</span>
          </div>

          <div className="flex items-center gap-1">
            <span>💬</span>
            <span className="font-medium">{formatNumber(story.comments)}</span>
            <span className="hidden xs:inline">comments</span>
          </div>

          <div className="text-gray-500 truncate">
            by <span className="font-medium text-gray-700">{story.author}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
          <span className="text-xs text-gray-500 truncate">
            {formatRelativeTime(story.timestamp)}
          </span>
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-gray-900 hover:text-gray-700 hover:underline whitespace-nowrap transition-colors"
          >
            Read more →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
