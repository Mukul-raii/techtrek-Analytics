import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "@/components/common/ChartCard";

interface ProductivityItem {
  language: string;
  percentage: number;
}

interface ProductivityDonutPanelProps {
  items: ProductivityItem[];
}

const colors = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe", "#1d4ed8", "#dbeafe"];

export function ProductivityDonutPanel({ items }: ProductivityDonutPanelProps) {
  const dataset = items.slice(0, 6).map((item) => ({
    name: item.language,
    value: item.percentage,
  }));

  return (
    <ChartCard
      title="Language Distribution"
      subtitle="Market share by adoption"
      empty={!dataset.length}
      emptyLabel="No language distribution available"
    >
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataset}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={2}
            >
              {dataset.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {dataset.map((item, idx) => (
          <div key={item.name} className="flex items-center gap-2 text-slate-600">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colors[idx % colors.length] }}
            />
            <span>
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
