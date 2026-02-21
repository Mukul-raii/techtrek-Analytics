import { cn } from "@/lib/utils";
import type { MomentumBadge as MomentumBadgeType } from "@/types/enhancedAnalytics";

interface MomentumBadgeProps {
  badge: MomentumBadgeType;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MomentumBadge({
  badge,
  showLabel = true,
  size = "md",
  className,
}: MomentumBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const typeStyles = {
    explosive: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
    rising: "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900",
    steady: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    solid: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    cooling: "bg-gray-500 text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizeClasses[size],
        typeStyles[badge.type],
        className
      )}
      title={`Momentum: ${badge.label}`}
    >
      <span>{badge.emoji}</span>
      {showLabel && <span>{badge.label}</span>}
    </span>
  );
}

export function MomentumIndicator({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-blue-500";
    if (score >= 20) return "bg-purple-500";
    return "bg-gray-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-24 overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn("h-full transition-all duration-500", getColor())}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700">
        {score.toFixed(1)}
      </span>
    </div>
  );
}
