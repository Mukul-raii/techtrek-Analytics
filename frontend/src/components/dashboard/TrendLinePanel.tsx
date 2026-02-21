import { ChartCard } from "@/components/common/ChartCard";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendPoint {
  date: string;
  repositories: number;
  stories: number;
}

interface TrendLinePanelProps {
  data: TrendPoint[];
}

const formatDateLabel = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function TrendLinePanel({ data }: TrendLinePanelProps) {
  return (
    <ChartCard
      title="Activity Trend"
      subtitle="Last 7 days activity across all sources"
      empty={!data.length}
      emptyLabel="No activity data available"
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickFormatter={formatDateLabel} tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} width={32} />
            <Tooltip labelFormatter={(value) => formatDateLabel(String(value))} />
            <Line
              type="monotone"
              dataKey="repositories"
              name="Repositories"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="stories"
              name="Stories"
              stroke="#93c5fd"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
