import { Clock, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FreshnessIndicatorProps {
  timestamp?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function FreshnessIndicator({
  timestamp,
  showRefresh = false,
  onRefresh,
  isRefreshing = false,
  className = "",
}: FreshnessIndicatorProps) {
  if (!timestamp) return null;

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getFreshnessStatus = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffHours = (now.getTime() - past.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1)
      return {
        status: "fresh",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    if (diffHours < 6)
      return {
        status: "recent",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    if (diffHours < 24)
      return {
        status: "moderate",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    return {
      status: "stale",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    };
  };

  const timeAgo = getTimeAgo(timestamp);
  const { color } = getFreshnessStatus(timestamp);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge
        variant="outline"
        className={`flex items-center gap-1.5 px-2.5 py-1 ${color} border`}
      >
        <Clock className="w-3 h-3" />
        <span className="text-xs font-medium">Updated {timeAgo}</span>
      </Badge>

      {showRefresh && onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh data"
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-600 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
}
