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
    <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50 hover:border-gray-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 border-b border-gray-100">
        <CardTitle className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 bg-gray-100 rounded-lg text-gray-700 flex items-center justify-center">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {value}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center text-xs sm:text-sm font-semibold gap-1.5 mb-2 ${getTrendColor()}`}
          >
            <span className="text-base">{getTrendIcon()}</span>
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-500 font-normal hidden sm:inline">
              from last period
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-600">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
