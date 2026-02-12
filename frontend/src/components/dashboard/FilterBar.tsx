import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <Card className="border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Time Range
          </label>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 w-full sm:w-auto">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Source
          </label>
          <Select value={source} onValueChange={onSourceChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="github">GitHub Only</SelectItem>
              <SelectItem value="hackernews">HackerNews Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full sm:w-auto mt-4 sm:mt-6 bg-gray-900 text-white hover:bg-gray-800">
          Export
        </Button>
      </div>
    </Card>
  );
}
