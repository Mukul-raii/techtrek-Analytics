import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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
    <Card className="border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-5">
        {/* Time Range Filter */}
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">
            Time Range
          </label>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-full sm:w-52 h-10 border-gray-300 bg-gray-50 hover:bg-white transition-colors text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day" className="text-sm">
                Last 24 Hours
              </SelectItem>
              <SelectItem value="week" className="text-sm">
                Last 7 Days
              </SelectItem>
              <SelectItem value="month" className="text-sm">
                Last 30 Days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Source Filter */}
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2.5">
            Data Source
          </label>
          <Select value={source} onValueChange={onSourceChange}>
            <SelectTrigger className="w-full sm:w-52 h-10 border-gray-300 bg-gray-50 hover:bg-white transition-colors text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">
                All Sources
              </SelectItem>
              <SelectItem value="github" className="text-sm">
                GitHub
              </SelectItem>
              <SelectItem value="hackernews" className="text-sm">
                HackerNews
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <Button className="w-full sm:w-auto h-10 bg-gray-900 text-white hover:bg-gray-800 font-semibold shadow-sm hover:shadow-md transition-all duration-200">
          📊 Export
        </Button>
      </div>
    </Card>
  );
}
