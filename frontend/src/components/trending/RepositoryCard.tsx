import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrendingRepository } from "@/types/trending";
import { formatNumber, formatRelativeTime } from "@/utils/formatters";
import { GitFork, Star, TrendingUp } from "lucide-react";

interface RepositoryCardProps {
  repository: TrendingRepository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card className="h-full rounded-xl border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <CardHeader className="gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900">{repository.repository}</h3>
            {repository.author ? <p className="truncate text-sm text-slate-500">{repository.author}</p> : null}
          </div>
          {repository.avatar_url ? (
            <img
              src={repository.avatar_url}
              alt={repository.author || "User"}
              className="h-10 w-10 rounded-full border border-slate-200"
            />
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-4">
        <p className="mb-4 line-clamp-2 text-sm text-slate-500">
          {repository.description || "No description available"}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          {repository.language ? <Badge variant="secondary">{repository.language}</Badge> : null}
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Star className="h-4 w-4" />
            {formatNumber(repository.stars)}
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <GitFork className="h-4 w-4" />
            {formatNumber(repository.forks)}
          </div>
        </div>

        {repository.stars_today && repository.stars_today > 0 ? (
          <div className="mb-4 inline-flex w-fit items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5" />
            +{formatNumber(repository.stars_today)} today
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <span className="truncate text-xs text-slate-500">{formatRelativeTime(repository.timestamp)}</span>
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            View
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
