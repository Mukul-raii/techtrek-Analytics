import { cn } from "@/lib/utils";

interface PercentileBadgeProps {
  percentile: number;
  metric: "stars" | "engagement" | "growth";
  size?: "sm" | "md";
  className?: string;
}

export function PercentileBadge({
  percentile,
  metric,
  size = "sm",
  className,
}: PercentileBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
  };

  const getColor = () => {
    if (percentile >= 90) return "bg-green-100 text-green-800 border-green-200";
    if (percentile >= 75) return "bg-blue-100 text-blue-800 border-blue-200";
    if (percentile >= 50)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getLabel = () => {
    const topPercent = 100 - percentile;
    if (percentile >= 90) return `Top ${topPercent}%`;
    if (percentile >= 75) return `Top ${topPercent}%`;
    return `${percentile}th percentile`;
  };

  const metricLabels = {
    stars: "⭐",
    engagement: "💬",
    growth: "📈",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border font-medium",
        sizeClasses[size],
        getColor(),
        className
      )}
      title={`${getLabel()} in ${metric}`}
    >
      <span>{metricLabels[metric]}</span>
      <span>{getLabel()}</span>
    </span>
  );
}

interface PercentileDisplayProps {
  stars?: number;
  engagement?: number;
  growth?: number;
  className?: string;
}

export function PercentileDisplay({
  stars,
  engagement,
  growth,
  className,
}: PercentileDisplayProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {stars !== undefined && stars > 0 && (
        <PercentileBadge percentile={stars} metric="stars" />
      )}
      {engagement !== undefined && engagement > 0 && (
        <PercentileBadge percentile={engagement} metric="engagement" />
      )}
      {growth !== undefined && growth > 0 && (
        <PercentileBadge percentile={growth} metric="growth" />
      )}
    </div>
  );
}
