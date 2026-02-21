import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { ChartCard } from "@/components/common/ChartCard";

interface QuickInsightsPanelProps {
  completionRate: number;
  averageStars: string;
  repositoryCount: number;
  storyCount: number;
}

export function QuickInsightsPanel({
  completionRate,
  averageStars,
  repositoryCount,
  storyCount,
}: QuickInsightsPanelProps) {
  const insights = [
    {
      icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
      title: `Total Repositories: ${repositoryCount}`,
      body: `${completionRate.toFixed(1)}% completion rate across the selected range.`,
    },
    {
      icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
      title: `Active Stories: ${storyCount}`,
      body: "Story activity reflects current community discussion volume.",
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
      title: `Avg. Stars: ${averageStars}`,
      body: "Average repository popularity for the selected source and period.",
    },
  ];

  return (
    <ChartCard title="Quick Insights" subtitle="Overview based on current dashboard data">
      <ul className="space-y-3">
        {insights.map((item) => (
          <li key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              {item.icon}
              {item.title}
            </p>
            <p className="mt-1 text-xs text-slate-500">{item.body}</p>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
