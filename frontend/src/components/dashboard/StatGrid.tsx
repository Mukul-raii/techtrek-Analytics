import { MetricCard } from "@/components/common/MetricCard";

interface Stat {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon?: React.ReactNode;
  description?: string;
}

interface StatGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

export function StatGrid({ stats, columns = 4 }: StatGridProps) {
  const gridColsClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <div className={`grid ${gridColsClass[columns]} gap-4 sm:gap-5 lg:gap-6`}>
      {stats.map((stat) => (
        <MetricCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
