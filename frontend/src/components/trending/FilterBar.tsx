import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TrendingFilters } from "@/types/trending";

interface FilterBarProps {
  filters: TrendingFilters;
  onFilterChange: (filters: Partial<TrendingFilters>) => void;
  languages?: string[];
}

export function FilterBar({
  filters,
  onFilterChange,
  languages = [],
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Content Source
        </label>
        <Tabs
          value={filters.source}
          onValueChange={(value) =>
            onFilterChange({ source: value as TrendingFilters["source"] })
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 rounded-lg bg-slate-100 p-1">
            <TabsTrigger value="all">All Sources</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="hackernews">HackerNews</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Time Range
          </label>
          <Select
            value={filters.dateRange}
            onValueChange={(value) =>
              onFilterChange({ dateRange: value as TrendingFilters["dateRange"] })
            }
          >
            <SelectTrigger className="h-10 border-slate-200 bg-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {languages.length > 0 ? (
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Language
            </label>
            <Select
              value={filters.language || "all"}
              onValueChange={(value) =>
                onFilterChange({ language: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="h-10 border-slate-200 bg-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onFilterChange({ sortBy: value as TrendingFilters["sortBy"] })
            }
          >
            <SelectTrigger className="h-10 border-slate-200 bg-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="stars">Most Stars</SelectItem>
              <SelectItem value="score">Top Score</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
