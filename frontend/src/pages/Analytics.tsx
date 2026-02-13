import { MainLayout } from "@/components/layout/MainLayout";
import { MetricCard } from "@/components/common/MetricCard";
import { ChartCard } from "@/components/common/ChartCard";
import { DataTable } from "@/components/common/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { LanguageGrowth } from "@/components/analytics/LanguageGrowth";

export function Analytics() {
  const { data, isLoading, error } = useAnalytics("month");

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <p className="text-red-600 mb-2">Failed to load analytics</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const metrics = [
    {
      title: "Total Growth",
      value: data?.totalGrowth.value || "+0%",
      change: data?.totalGrowth.change || 0,
      trend: data?.totalGrowth.trend || ("stable" as const),
      description: "Compared to last month",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Most Popular Language",
      value: data?.topLanguage.name || "N/A",
      trend: "stable" as const,
      description: `${data?.topLanguage.percentage || 0}% of all repositories`,
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Avg. Daily Stars",
      value: data?.avgDailyStars.value || "0",
      change: data?.avgDailyStars.change || 0,
      trend:
        (data?.avgDailyStars.change || 0) > 0
          ? ("up" as const)
          : ("stable" as const),
      description: "Across all repositories",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: "Active Communities",
      value: String(data?.activeCommunities.count || 0),
      change: data?.activeCommunities.change || 0,
      trend:
        (data?.activeCommunities.change || 0) > 0
          ? ("up" as const)
          : ("stable" as const),
      description: "With 100+ members",
      icon: <PieChart className="w-5 h-5" />,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Analytics
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            In-depth analysis of tech trends, language adoption, and community
            insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* Activity Trend */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Activity Trend"
              subtitle="Repository creation and updates over last 7 days"
            >
              <div className="h-64 flex items-end gap-1">
                {(data?.activityData || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <div
                      className="w-full bg-gray-900 rounded-t-sm transition-all duration-200 hover:bg-gray-700 cursor-pointer"
                      style={{
                        height: `${(item.repositories / 400) * 100}%`,
                      }}
                      title={`${item.repositories} repos, ${item.stories} stories`}
                    />
                    <span className="text-xs text-gray-500 font-medium">
                      {item.date.split("-")[2]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-900 rounded-sm" />
                  <span>Repositories</span>
                </div>
                <p className="text-gray-500">Last 7 days</p>
              </div>
            </ChartCard>
          </div>

          {/* Language Distribution Pie */}
          <ChartCard
            title="Language Distribution"
            subtitle="Market share by adoption"
          >
            <div className="space-y-4">
              {(data?.languageDistribution || []).map((lang) => (
                <div key={lang.language} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {lang.language}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {lang.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: lang.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Growth Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <ChartCard title="Repository Growth" subtitle="Monthly trend">
            <div className="space-y-3">
              {(data?.monthlyGrowth || []).map((item) => (
                <div
                  key={item.month}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {item.month}
                  </span>
                  <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-600 rounded-full"
                      style={{ width: `${(item.repos / 250) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-green-600 w-16 text-right">
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Stars Distribution" subtitle="Average by language">
            <div className="space-y-3">
              {(data?.topLanguages || []).slice(0, 3).map((item, idx) => (
                <div
                  key={item.language}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-900 flex-1">
                    {item.language}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-yellow-500 rounded-full"
                        style={{ width: `${((3 - idx) / 3) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                      {item.stars}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Top Contributors" subtitle="By activity">
            <div className="space-y-3">
              {[
                {
                  name: "Contributors",
                  count: data?.activeCommunities.count || 0,
                  trend: `+${data?.activeCommunities.change || 0}%`,
                },
                {
                  name: "Repositories",
                  count: data?.quickStats.totalRepositories || "0",
                  trend: "+15%",
                },
                {
                  name: "Languages",
                  count: data?.quickStats.trackedLanguages || 0,
                  trend: "+12%",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-xs text-gray-600">{item.name}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {typeof item.count === "number"
                        ? item.count.toLocaleString()
                        : item.count}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-green-600">
                    {item.trend}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Detailed Languages Table */}
        <ChartCard
          title="Language Statistics"
          subtitle="Comprehensive programming language metrics"
        >
          <DataTable
            columns={[
              {
                header: "Rank",
                key: "rank",
                render: (value) => (
                  <div className="text-sm font-semibold text-gray-900">
                    #{value}
                  </div>
                ),
                className: "w-12",
              },
              {
                header: "Language",
                key: "language",
                render: (value) => (
                  <div className="text-sm font-medium text-gray-900">
                    {value}
                  </div>
                ),
              },
              {
                header: "Repositories",
                key: "repositories",
                render: (value) => (
                  <div className="text-sm text-gray-700 font-medium">
                    {value}
                  </div>
                ),
              },
              {
                header: "Total Stars",
                key: "stars",
                render: (value) => (
                  <div className="text-sm text-gray-700 font-medium">
                    {value}
                  </div>
                ),
              },
              {
                header: "Percentage",
                key: "percentage",
                render: (value) => (
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-10 text-right">
                      {value}%
                    </span>
                  </div>
                ),
              },
              {
                header: "Trend",
                key: "trend",
                render: (value) => (
                  <div className="text-sm font-semibold text-green-600">
                    {value}
                  </div>
                ),
                className: "text-right",
              },
            ]}
            data={data?.languageStats || []}
            rowKey="rank"
          />
        </ChartCard>

        {/* Language Growth Trends */}
        <LanguageGrowth days={7} limit={15} />

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold mt-1">•</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {data?.topLanguage.name || "Top Language"} Dominance
                    </p>
                    <p className="text-xs text-gray-600">
                      Leading with {data?.topLanguage.percentage || 0}% market
                      share
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Repository Growth
                    </p>
                    <p className="text-xs text-gray-600">
                      Consistent growth at {data?.totalGrowth.value || "0%"}{" "}
                      across all communities
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold mt-1">•</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Community Engagement
                    </p>
                    <p className="text-xs text-gray-600">
                      {data?.activeCommunities.count || 0} active communities
                      with high engagement
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Tracked Languages
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {data?.quickStats.trackedLanguages || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Total Repositories
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {data?.quickStats.totalRepositories || "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Avg. Repository Age
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {data?.quickStats.avgRepoAge || "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
