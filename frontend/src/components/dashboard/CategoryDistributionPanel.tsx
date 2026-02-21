import { ChartCard } from "@/components/common/ChartCard";

interface CategoryItem {
  language: string;
  percentage: number;
}

interface CategoryDistributionPanelProps {
  categories: CategoryItem[];
}

export function CategoryDistributionPanel({ categories }: CategoryDistributionPanelProps) {
  const top = categories.slice(0, 6);

  return (
    <ChartCard
      title="Top Languages"
      subtitle="By repository count"
      empty={!top.length}
      emptyLabel="No language data available"
    >
      <div className="space-y-3">
        {top.map((item) => (
          <div key={item.language}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-600">{item.language}</span>
              <span className="font-semibold text-slate-900">{item.percentage}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100">
              <div
                className="h-2.5 rounded-full bg-blue-700"
                style={{ width: `${Math.max(item.percentage, 4)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
