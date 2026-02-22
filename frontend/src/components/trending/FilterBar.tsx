import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TrendingFilters } from "@/types/trending";

interface FilterBarProps {
  filters: TrendingFilters;
  onFilterChange: (filters: Partial<TrendingFilters>) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const sortOptions =
    filters.source === "hackernews"
      ? [
          { value: "trending", label: "Trending" },
          { value: "score", label: "Top Score" },
          { value: "recent", label: "Most Recent" },
        ]
      : filters.source === "github"
        ? [
            { value: "trending", label: "Trending" },
            { value: "stars", label: "Most Stars" },
            { value: "recent", label: "Most Recent" },
          ]
        : [
            { value: "trending", label: "Trending" },
            { value: "recent", label: "Most Recent" },
          ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
