import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChartCard } from "@/components/common/ChartCard";
import { DataTable } from "@/components/common/DataTable";
import { AnalyticsPageSkeleton } from "@/components/common/PageSkeletons";
import { useAnalytics } from "@/hooks/queries/useAnalytics";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (response as any)?.data;

  // Transform API data to component format - must be before early returns
  const transformedData = useMemo(() => {
    if (!data) return null;

    const topLanguage = data.languageStats?.[0];
    const totalRepos = data.githubStats?.totalRepositories || 0;
    const totalStories = data.hackerNewsStats?.totalStories || 0;
    const avgStars = data.githubStats?.avgStars || 0;

    // Static month labels to avoid Date.now() impurity
    const monthLabels = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

    // Create mock activity data (in real scenario, would come from daily metrics API)
    const activityData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split("T")[0],
        repositories: Math.floor(totalRepos / 7) + i * 5,
        stories: Math.floor(totalStories / 7) + i * 3,
      };
    });

    // Create mock monthly growth data
    const monthlyGrowth = monthLabels.map((month, i) => ({
      month,
      repos: Math.floor(totalRepos * (0.7 + i * 0.05)),
    }));

    return {
      ...data,
      activityData,
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
  }, [data]);

  if (isLoading) {
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
              subtitle="Repository and story activity over time"
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
                    <Line
                      type="monotone"
                      dataKey="stories"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={false}
                    />
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
