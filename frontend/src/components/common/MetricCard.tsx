import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon?: React.ReactNode;
  description?: string;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  description,
}: MetricCardProps) {
  const getTrendColor = () => {
    if (!trend || trend === "stable") return "text-gray-600";
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = () => {
    if (!trend || trend === "stable") return "→";
    return trend === "up" ? "↑" : "↓";
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center text-xs sm:text-sm ${getTrendColor()}`}
          >
            <span className="mr-1">{getTrendIcon()}</span>
            <span className="font-medium">{Math.abs(change)}%</span>
            <span className="text-gray-500 ml-1 hidden sm:inline">
              from last period
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
