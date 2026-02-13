import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGrowthMetrics } from "@/hooks/useGrowthMetrics";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrowthIndicatorProps {
  source: "github" | "hackernews";
  title: string;
  days?: number;
  formatValue?: (value: number) => string;
}

export function GrowthIndicator({
  source,
  title,
  days = 7,
  formatValue = (val) => val.toLocaleString(),
}: GrowthIndicatorProps) {
  const { data, isLoading, error } = useGrowthMetrics(source, days);

  const getTrendIcon = () => {
    if (!data) return <Minus className="h-4 w-4" />;
    if (data.trend === "up") return <TrendingUp className="h-4 w-4" />;
    if (data.trend === "down") return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (!data) return "text-muted-foreground";
    if (data.trend === "up") return "text-green-600";
    if (data.trend === "down") return "text-red-600";
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">—</div>
          <p className="text-xs text-muted-foreground mt-1">Data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("flex items-center gap-1", getTrendColor())}>
          {getTrendIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(data.currentValue)}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p
            className={cn(
              "text-xs font-medium",
              data.trend === "up" && "text-green-600",
              data.trend === "down" && "text-red-600",
              data.trend === "stable" && "text-muted-foreground"
            )}
          >
            {data.changePercent > 0 ? "+" : ""}
            {data.changePercent.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">vs yesterday</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {data.itemsToday} items today ({data.itemChange > 0 ? "+" : ""}
          {data.itemChange} from yesterday)
        </p>
      </CardContent>
    </Card>
  );
}
