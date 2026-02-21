import { cn } from "@/lib/utils";
import type { HealthScore } from "@/types/enhancedAnalytics";

interface HealthGaugeProps {
  healthScore: HealthScore;
  size?: "sm" | "md" | "lg";
  showBreakdown?: boolean;
}

export function HealthGauge({
  healthScore,
  size = "md",
  showBreakdown = false,
}: HealthGaugeProps) {
  const { score, components } = healthScore;

  const sizeClasses = {
    sm: { container: "w-20 h-20", text: "text-lg" },
    md: { container: "w-32 h-32", text: "text-2xl" },
    lg: { container: "w-40 h-40", text: "text-3xl" },
  };

  const getColor = (value: number) => {
    if (value >= 71) return "text-green-600";
    if (value >= 41) return "text-yellow-600";
    return "text-red-600";
  };

  const getStrokeColor = (value: number) => {
    if (value >= 71) return "#16a34a"; // green-600
    if (value >= 41) return "#ca8a04"; // yellow-600
    return "#dc2626"; // red-600
  };

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("relative", sizeClasses[size].container)}>
        {/* Background Circle */}
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={getStrokeColor(score)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn("font-bold", getColor(score), sizeClasses[size].text)}
          >
            {score.toFixed(0)}
          </span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>

      {/* Health Status Label */}
      <div className="text-center">
        <span className={cn("text-sm font-medium", getColor(score))}>
          {score >= 71 ? "Excellent" : score >= 41 ? "Good" : "Needs Attention"}
        </span>
      </div>

      {/* Component Breakdown */}
      {showBreakdown && (
        <div className="mt-2 w-full space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Activity Rate</span>
            <span className="font-medium">
              {components.activityRate.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Engagement</span>
            <span className="font-medium">
              {components.engagement.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Discussion Quality</span>
            <span className="font-medium">
              {components.discussionQuality.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Freshness</span>
            <span className="font-medium">
              {components.freshness.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function HealthScoreCard({ healthScore }: { healthScore: HealthScore }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Ecosystem Health</h3>
      <HealthGauge healthScore={healthScore} size="lg" showBreakdown />
    </div>
  );
}
