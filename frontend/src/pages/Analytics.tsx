import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChartCard } from "@/components/common/ChartCard";
import { DataTable } from "@/components/common/DataTable";
import { AnalyticsPageSkeleton } from "@/components/common/PageSkeletons";
import { useAnalytics, useDailyAnalytics } from "@/hooks/queries/useAnalytics";
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
  const { data: response, isLoading, error } = useAnalytics({ range: "month" });
  const { data: monthlyDailyResponse, isLoading: monthlyDailyLoading } =
    useDailyAnalytics({ range: "month" });
  const { data: yearlyDailyResponse, isLoading: yearlyDailyLoading } =
    useDailyAnalytics({ range: "year" });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (response as any)?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monthlyDailyMetrics = ((monthlyDailyResponse as any)?.data ?? []) as DailyMetric[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yearlyDailyMetrics = ((yearlyDailyResponse as any)?.data ?? []) as DailyMetric[];

  // Transform API data to component format - must be before early returns
  const transformedData = useMemo(() => {
    if (!data) return null;

    const topLanguage = data.languageStats?.[0];
    const totalRepos = data.githubStats?.totalRepositories || 0;
    const totalStories = data.hackerNewsStats?.totalStories || 0;
    const avgStars = data.githubStats?.avgStars || 0;

    const activity = transformDailyMetrics(monthlyDailyMetrics);
    const monthlyGrowth = aggregateMonthlyGrowth(yearlyDailyMetrics, 6);

    return {
      ...data,
      activityData: activity.points,
      hasSourceBreakdown: activity.hasSourceBreakdown,
      monthlyGrowth,
      languageDistribution: data.languageStats || [],
      topLanguages: (data.languageStats || []).map(
        (lang: { language: string; count: number }) => ({
          language: lang.language,
          repositories: lang.count,
        })
      ),
      topLanguage,
      totalRepos,
      totalStories,
      avgStars,
    };
  }, [data, monthlyDailyMetrics, yearlyDailyMetrics]);

  if (isLoading || monthlyDailyLoading || yearlyDailyLoading) {
    return (
      <MainLayout>
        <AnalyticsPageSkeleton />
      </MainLayout>
    );
  }

  if (error || !transformedData) {
    return (
      <MainLayout>
        <div className="panel-surface p-8 text-center text-rose-600">
          {error?.message ?? "Failed to load analytics"}
        </div>
      </MainLayout>
    );
  }

  const kpis = [
    {
      label: "Total Items",
      value: String(transformedData.totalItems || 0),
      caption: `${transformedData.totalRepos} repos, ${transformedData.totalStories} stories`,
    },
    {
      label: "Top Language",
      value: transformedData.topLanguage?.language || "N/A",
      caption: transformedData.topLanguage
        ? `${transformedData.topLanguage.percentage}% share`
        : "No data",
    },
    {
      label: "Avg Stars",
      value: transformedData.avgStars.toLocaleString(),
      caption: "Per repository",
    },
    {
      label: "Active Communities",
      value: String(transformedData.totalStories),
      caption: "HackerNews discussions",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-4">
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="kpi-tile">
              <p className="text-sm text-slate-500">{kpi.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {kpi.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{kpi.caption}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ChartCard
              title="Activity Trend"
              subtitle={
                transformedData.hasSourceBreakdown
                  ? "Repository and story activity over time"
                  : "Repository activity over time (story split unavailable)"
              }
              empty={!transformedData.activityData.length}
              emptyLabel="No activity data available"
            >
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transformedData.activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      width={34}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="repositories"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    {transformedData.hasSourceBreakdown ? (
                      <Line
                        type="monotone"
                        dataKey="stories"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={false}
                      />
                    ) : null}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <ChartCard
            title="Language Distribution"
            subtitle="Share by repository volume"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transformedData.languageDistribution}
                    dataKey="percentage"
                    nameKey="language"
                    innerRadius={50}
                    outerRadius={85}
                  >
                    {transformedData.languageDistribution.map(
                      (
                        entry: { language: string; percentage: number },
                        idx: number
                      ) => (
                        <Cell
                          key={entry.language}
                          fill={pieColors[idx % pieColors.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard
            title="Monthly Growth"
            subtitle="Repository growth trajectory"
            empty={!transformedData.monthlyGrowth.length}
            emptyLabel="No monthly growth data available"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transformedData.monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} width={34} />
                  <Tooltip />
                  <Bar dataKey="repos" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Top Languages"
            subtitle="Current leaders by repository count"
          >
            <div className="space-y-3">
              {transformedData.topLanguages
                .slice(0, 5)
                .map((language: { language: string; repositories: number }) => (
                  <div key={language.language}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {language.language}
                      </span>
                      <span className="text-slate-900">
                        {language.repositories}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-blue-700"
                        style={{
                          width: `${Math.min(100, language.repositories)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </ChartCard>
        </section>

        <ChartCard
          title="Language Statistics"
          subtitle="Detailed breakdown of language performance"
        >
          <DataTable
            columns={[
              { header: "Rank", key: "rank" },
              { header: "Language", key: "language" },
              { header: "Repositories", key: "count" },
              { header: "Stars", key: "stars" },
              {
                header: "Percentage",
                key: "percentage",
                render: (value) => `${value}%`,
              },
              { header: "Trend", key: "trend" },
            ]}
            data={transformedData.languageStats.map(
              (
                lang: {
                  language: string;
                  count: number;
                  stars: number;
                  percentage: number;
                },
                idx: number
              ) => ({
                rank: idx + 1,
                language: lang.language,
                count: lang.count,
                stars: lang.stars.toLocaleString(),
                percentage: lang.percentage,
                trend: "stable",
              })
            )}
            rowKey="rank"
          />
        </ChartCard>
      </div>
    </MainLayout>
  );
}

interface DailyMetric {
  date: string;
  source?: string;
  item_count?: number;
}

function transformDailyMetrics(metrics: DailyMetric[]) {
  if (!metrics.length) {
    return {
      points: [],
      hasSourceBreakdown: false,
    };
  }

  const byDate = new Map<string, { repositories: number; stories: number }>();
  let hasSourceBreakdown = false;

  metrics.forEach((metric) => {
    const date = String(metric.date).split("T")[0];
    const count = metric.item_count ?? 0;
    const existing = byDate.get(date) ?? { repositories: 0, stories: 0 };

    if (metric.source === "github") {
      existing.repositories += count;
      hasSourceBreakdown = true;
    } else if (metric.source === "hackernews") {
      existing.stories += count;
      hasSourceBreakdown = true;
    } else {
      existing.repositories += count;
    }

    byDate.set(date, existing);
  });

  const points = Array.from(byDate.entries())
    .map(([date, values]) => ({
      date,
      repositories: values.repositories,
      stories: values.stories,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    points,
    hasSourceBreakdown,
  };
}

function aggregateMonthlyGrowth(metrics: DailyMetric[], monthsToShow = 6) {
  if (!metrics.length) return [];

  const byMonth = new Map<string, number>();

  metrics.forEach((metric) => {
    const date = new Date(metric.date);
    if (Number.isNaN(date.getTime())) return;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const count = metric.item_count ?? 0;

    byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + count);
  });

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-monthsToShow)
    .map(([monthKey, repos]) => {
      const [year, month] = monthKey.split("-").map(Number);
      const monthDate = new Date(year, month - 1, 1);

      return {
        month: monthDate.toLocaleDateString("en-US", { month: "short" }),
        repos,
      };
    });
}
