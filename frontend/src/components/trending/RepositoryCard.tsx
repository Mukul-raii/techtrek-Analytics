import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrendingRepository } from "@/types/trending";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";

interface RepositoryCardProps {
  repository: TrendingRepository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 truncate">
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
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 shrink-0"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-xs sm:text-sm text-gray-700 mb-4 line-clamp-2 grow">
          {repository.description || "No description available"}
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
          {repository.language && (
            <Badge variant="secondary" className="text-xs">
              {repository.language}
            </Badge>
          )}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
            <span>⭐</span>
            <span className="font-medium">
              {formatNumber(repository.stars)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
            <span>🔀</span>
            <span className="font-medium">
              {formatNumber(repository.forks)}
            </span>
          </div>
        </div>

        {repository.stars_today && repository.stars_today > 0 && (
          <div className="text-xs font-medium text-green-600 mb-3">
            +{formatNumber(repository.stars_today)} stars today
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 truncate">
            {formatRelativeTime(repository.timestamp)}
          </span>
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-gray-900 hover:text-gray-700 hover:underline whitespace-nowrap transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
