import { Card, CardContent } from "@/components/ui/card";
import type { HackerNewsStory } from "@/types/trending";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";

interface StoryCardProps {
  story: HackerNewsStory;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg h-full flex flex-col bg-white hover:bg-gray-50">
      <CardContent className="pt-5 sm:pt-6 px-5 sm:px-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-4 leading-snug hover:text-gray-700 transition-colors">
          {story.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded text-orange-700 font-medium">
            <span>⬆️</span>
            <span>{formatNumber(story.points)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded text-blue-700 font-medium">
            <span>💬</span>
            <span>{formatNumber(story.comments)}</span>
          </div>

          <div className="text-gray-500 truncate">
            by <span className="font-medium text-gray-700">{story.author}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
          <span className="text-xs text-gray-500 truncate">
            {formatRelativeTime(story.timestamp)}
          </span>
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-gray-900 hover:text-gray-700 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors whitespace-nowrap"
          >
            Read →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
