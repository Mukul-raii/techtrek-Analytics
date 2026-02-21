import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { KpiCardProps } from "@/types/uiTheme";

interface KpiStripProps {
  items: KpiCardProps[];
}

function trendClass(trend: KpiCardProps["trend"]) {
  if (trend === "up") return "text-emerald-600";
  if (trend === "down") return "text-rose-600";
  return "text-slate-500";
}

function TrendIcon({ trend }: { trend?: KpiCardProps["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="h-4 w-4" />;
  if (trend === "down") return <ArrowDownRight className="h-4 w-4" />;
  return <Minus className="h-4 w-4" />;
}

export function KpiStrip({ items }: KpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="kpi-tile">
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">{item.value}</p>
          <p className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${trendClass(item.trend)}`}>
            <TrendIcon trend={item.trend} />
            {item.sublabel ?? "Current period"}
          </p>
        </article>
      ))}
    </div>
  );
}
