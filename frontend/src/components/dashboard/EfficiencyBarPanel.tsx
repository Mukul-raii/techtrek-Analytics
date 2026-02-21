import { ChartCard } from "@/components/common/ChartCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EfficiencyPoint {
  date: string;
  repositories: number;
}

interface EfficiencyBarPanelProps {
  data: EfficiencyPoint[];
}

const toShortDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function EfficiencyBarPanel({ data }: EfficiencyBarPanelProps) {
  return (
    <ChartCard
      title="Repository Activity"
      subtitle="Daily repository count over time"
      empty={!data.length}
      emptyLabel="No repository activity available"
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickFormatter={toShortDate} tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} width={28} />
            <Tooltip labelFormatter={(value) => toShortDate(String(value))} />
            <Bar dataKey="repositories" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
