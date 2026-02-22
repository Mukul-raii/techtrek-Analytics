import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

export type TimeRange = "today" | "week" | "month";

export interface SortOption {
  value: "popularity" | "recent" | "stars" | "stars_asc" | "score" | "score_asc";
  label: string;
}

interface DataPageFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  sort: SortOption["value"];
  sortOptions: SortOption[];
  onSortChange: (value: SortOption["value"]) => void;
}

export function DataPageFilters({
  query,
  onQueryChange,
  timeRange,
  onTimeRangeChange,
  sort,
  sortOptions,
  onSortChange,
}: DataPageFiltersProps) {
  return (
    <section className="panel-surface p-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Filter items by name, title, or description..."
            className="h-10 border-slate-200 bg-slate-50 pl-9"
          />
        </div>

        <div className="lg:col-span-3">
          <Select
            value={timeRange}
            onValueChange={(value) => onTimeRangeChange(value as TimeRange)}
          >
            <SelectTrigger className="h-10 border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="lg:col-span-3">
          <Select
            value={sort}
            onValueChange={(value) =>
              onSortChange(value as SortOption["value"])
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
    </section>
  );
}
