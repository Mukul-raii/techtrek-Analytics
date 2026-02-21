import { MainLayout } from "@/components/layout/MainLayout";
import { ChartCard } from "@/components/common/ChartCard";
import { DataTable } from "@/components/common/DataTable";
import { AnalyticsPageSkeleton } from "@/components/common/PageSkeletons";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const pieColors = ["#2563eb", "#60a5fa", "#93c5fd", "#bfdbfe", "#1d4ed8"];

export function Analytics() {
  const { data, isLoading, error } = useAnalytics("month");

  if (isLoading) {
    return (
      <MainLayout>
        <AnalyticsPageSkeleton />
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <div className="panel-surface p-8 text-center text-rose-600">{error ?? "Failed to load analytics"}</div>
      </MainLayout>
    );
  }

  const kpis = [
    { label: "Total Growth", value: data.totalGrowth.value, caption: "Compared to last month" },
    { label: "Top Language", value: data.topLanguage.name, caption: `${data.topLanguage.percentage}% share` },
    { label: "Avg Daily Stars", value: data.avgDailyStars.value, caption: "Across active repositories" },
    { label: "Active Communities", value: String(data.activeCommunities.count), caption: "High-engagement stories" },
  ];

  return (
    <MainLayout>
      <div className="space-y-4">
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="kpi-tile">
              <p className="text-sm text-slate-500">{kpi.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{kpi.value}</p>
              <p className="mt-1 text-xs text-slate-500">{kpi.caption}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard title="Activity Trend" subtitle="Repository and story activity over time">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} width={34} />
                    <Tooltip />
                    <Line type="monotone" dataKey="repositories" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="stories" stroke="#60a5fa" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Language Distribution" subtitle="Share by repository volume">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.languageDistribution}
                    dataKey="percentage"
                    nameKey="language"
                    innerRadius={50}
                    outerRadius={85}
                  >
                    {data.languageDistribution.map((entry, idx) => (
                      <Cell key={entry.language} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard title="Monthly Growth" subtitle="Repository growth trajectory">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} width={34} />
                  <Tooltip />
                  <Bar dataKey="repos" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Top Languages" subtitle="Current leaders by repository count">
            <div className="space-y-3">
              {data.topLanguages.slice(0, 5).map((language) => (
                <div key={language.language}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{language.language}</span>
                    <span className="text-slate-900">{language.repositories}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-blue-700"
                      style={{ width: `${Math.min(100, language.repositories)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </section>

        <ChartCard title="Language Statistics" subtitle="Detailed breakdown of language performance">
          <DataTable
            columns={[
              { header: "Rank", key: "rank" },
              { header: "Language", key: "language" },
              { header: "Repositories", key: "repositories" },
              { header: "Stars", key: "stars" },
              { header: "Percentage", key: "percentage", render: (value) => `${value}%` },
              { header: "Trend", key: "trend" },
            ]}
            data={data.languageStats}
            rowKey="rank"
          />
        </ChartCard>
      </div>
    </MainLayout>
  );
}
