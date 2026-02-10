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
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Source Filter */}
        <div className="w-full">
          <label className="text-xs font-semibold text-gray-700 mb-2 block">
            Source
          </label>
          <Tabs
            value={filters.source}
            onValueChange={(value) =>
              onFilterChange({ source: value as TrendingFilters["source"] })
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All
              </TabsTrigger>
              <TabsTrigger value="github" className="text-xs sm:text-sm">
                GitHub
              </TabsTrigger>
              <TabsTrigger value="hackernews" className="text-xs sm:text-sm">
                HackerNews
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Secondary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Date Range Filter */}
          <div className="w-full">
            <label className="text-xs font-semibold text-gray-700 mb-2 block">
              Time Range
            </label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) =>
                onFilterChange({
                  dateRange: value as TrendingFilters["dateRange"],
                })
              }
            >
              <SelectTrigger className="text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today" className="text-xs sm:text-sm">
                  Today
                </SelectItem>
                <SelectItem value="week" className="text-xs sm:text-sm">
                  This Week
                </SelectItem>
                <SelectItem value="month" className="text-xs sm:text-sm">
                  This Month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          {languages.length > 0 && (
            <div className="w-full">
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
                Language
              </label>
              <Select
                value={filters.language || "all"}
                onValueChange={(value) =>
                  onFilterChange({
                    language: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs sm:text-sm">
                    All Languages
                  </SelectItem>
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang}
                      value={lang}
                      className="text-xs sm:text-sm"
                    >
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sort By Filter */}
          <div className="w-full">
            <label className="text-xs font-semibold text-gray-700 mb-2 block">
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                onFilterChange({ sortBy: value as TrendingFilters["sortBy"] })
              }
            >
              <SelectTrigger className="text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending" className="text-xs sm:text-sm">
                  Trending
                </SelectItem>
                <SelectItem value="stars" className="text-xs sm:text-sm">
                  Most Stars
                </SelectItem>
                <SelectItem value="score" className="text-xs sm:text-sm">
                  Top Score
                </SelectItem>
                <SelectItem value="recent" className="text-xs sm:text-sm">
                  Most Recent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
