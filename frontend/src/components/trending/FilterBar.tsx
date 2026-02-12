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
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-4 sm:gap-5">
        {/* Source Filter with better styling */}
        <div className="w-full">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 block">
            Content Source
          </label>
          <Tabs
            value={filters.source}
            onValueChange={(value) =>
              onFilterChange({ source: value as TrendingFilters["source"] })
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="all" className="text-xs sm:text-sm font-medium">
                All Sources
              </TabsTrigger>
              <TabsTrigger value="github" className="text-xs sm:text-sm font-medium">
                GitHub
              </TabsTrigger>
              <TabsTrigger value="hackernews" className="text-xs sm:text-sm font-medium">
                HackerNews
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Secondary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range Filter */}
          <div className="w-full">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5 block">
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
              <SelectTrigger className="text-xs sm:text-sm h-10 border-gray-300 bg-gray-50 hover:bg-white transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today" className="text-xs sm:text-sm">
                  Last 24 Hours
                </SelectItem>
                <SelectItem value="week" className="text-xs sm:text-sm">
                  Last 7 Days
                </SelectItem>
                <SelectItem value="month" className="text-xs sm:text-sm">
                  Last 30 Days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          {languages.length > 0 && (
            <div className="w-full">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5 block">
                Programming Language
              </label>
              <Select
                value={filters.language || "all"}
                onValueChange={(value) =>
                  onFilterChange({
                    language: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="text-xs sm:text-sm h-10 border-gray-300 bg-gray-50 hover:bg-white transition-colors">
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
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5 block">
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                onFilterChange({ sortBy: value as TrendingFilters["sortBy"] })
              }
            >
              <SelectTrigger className="text-xs sm:text-sm h-10 border-gray-300 bg-gray-50 hover:bg-white transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending" className="text-xs sm:text-sm">
                  🔥 Trending
                </SelectItem>
                <SelectItem value="stars" className="text-xs sm:text-sm">
                  ⭐ Most Stars
                </SelectItem>
                <SelectItem value="score" className="text-xs sm:text-sm">
                  📈 Top Score
                </SelectItem>
                <SelectItem value="recent" className="text-xs sm:text-sm">
                  ✨ Most Recent
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
