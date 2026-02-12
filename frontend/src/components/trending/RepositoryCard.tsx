import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrendingRepository } from "@/types/trending";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";

interface RepositoryCardProps {
  repository: TrendingRepository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg h-full flex flex-col bg-white hover:bg-gray-50">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate hover:text-gray-700 transition-colors">
              {repository.repository}
            </h3>
            {repository.author && (
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {repository.author}
              </p>
            )}
          </div>
          {repository.avatar_url && (
            <img
              src={repository.avatar_url}
              alt={repository.author || "User"}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 shrink-0 hover:border-gray-300 transition-colors"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-4">
        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2 grow">
          {repository.description || "No description available"}
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          {repository.language && (
            <Badge variant="secondary" className="text-xs font-medium">
              {repository.language}
            </Badge>
          )}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 font-medium">
            <span>⭐</span>
            <span>{formatNumber(repository.stars)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-700 font-medium">
            <span>🔀</span>
            <span>{formatNumber(repository.forks)}</span>
          </div>
        </div>

        {repository.stars_today && repository.stars_today > 0 && (
          <div className="text-xs font-semibold text-green-600 mb-4 px-2 py-1 bg-green-50 rounded-md inline-flex w-fit">
            🔥 +{formatNumber(repository.stars_today)} today
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 truncate">
            {formatRelativeTime(repository.timestamp)}
          </span>
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-gray-900 hover:text-gray-700 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors whitespace-nowrap"
          >
            View →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
