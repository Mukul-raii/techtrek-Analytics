import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
}

export function FilterBar({
  timeRange,
  onTimeRangeChange,
  source,
  onSourceChange,
}: FilterBarProps) {
  return (
    <section className="panel-surface p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Time Range
          </label>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="h-10 w-full border-slate-200 bg-slate-50 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px] flex-1">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Data Source
          </label>
          <Select value={source} onValueChange={onSourceChange}>
            <SelectTrigger className="h-10 w-full border-slate-200 bg-slate-50 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="hackernews">HackerNews</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="h-10 rounded-lg bg-blue-700 px-5 font-semibold text-white hover:bg-blue-600">
          Export
        </Button>
      </div>
    </section>
  );
}
