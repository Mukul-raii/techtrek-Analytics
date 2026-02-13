import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatGrid } from "@/components/dashboard/StatGrid";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ChartCard } from "@/components/common/ChartCard";
import { DataTable } from "@/components/common/DataTable";
import { GrowthIndicator } from "@/components/dashboard/GrowthIndicator";
import { TrendingTopics } from "@/components/trending/TrendingTopics";
import { useDashboard } from "@/hooks/useDashboard";
import { TrendingUp, Activity, Zap } from "lucide-react";

export function Dashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const [source, setSource] = useState("all");

  const {
    metrics,
    languageStats,
    trendingRepositories,
    trendingStories,
    topRepositories,
    activityData,
    isLoading,
    error,
  } = useDashboard(timeRange, source);

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
            <p className="text-red-600 mb-2">Failed to load dashboard</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      title: "Total Repositories",
      value: String(metrics?.totalRepositories.value || 0),
      change: metrics?.totalRepositories.change || 0,
      trend: metrics?.totalRepositories.trend || ("stable" as const),
      icon: <Zap className="w-5 h-5" />,
    },
    {
      title: "Active Stories",
      value: String(metrics?.activeStories.value || 0),
      change: metrics?.activeStories.change || 0,
      trend: metrics?.activeStories.trend || ("stable" as const),
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: "Top Languages",
      value: String(metrics?.topLanguages.value || 0),
      change: metrics?.topLanguages.change || 0,
      trend: metrics?.topLanguages.trend || ("stable" as const),
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: "Avg. Stars",
      value: metrics?.avgStars.value || "0",
      change: metrics?.avgStars.change || 0,
      trend: metrics?.avgStars.trend || ("stable" as const),
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  return (
    <MainLayout>
      <div className=" space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Overview of trending tech data, GitHub statistics, and HackerNews
            insights
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          source={source}
          onSourceChange={setSource}
        />

        {/* Growth Indicators - Real-time metrics with trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GrowthIndicator
            source="github"
            title="GitHub Stars Growth"
            days={7}
            formatValue={(val) => `${(val / 1000).toFixed(1)}K`}
          />
          <GrowthIndicator
            source="hackernews"
            title="HN Points Growth"
            days={7}
          />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stats[2].title}
              </CardTitle>
              {stats[2].icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats[2].value}</div>
              <p className="text-xs text-muted-foreground">
                {stats[2].change > 0 ? "+" : ""}
                {stats[2].change}% from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stats[3].title}
              </CardTitle>
              {stats[3].icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats[3].value}</div>
              <p className="text-xs text-muted-foreground">
                {stats[3].change > 0 ? "+" : ""}
                {stats[3].change}% from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <StatGrid stats={stats.slice(0, 2)} columns={2} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* Activity Over Time */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Activity Trend"
              subtitle="Last 7 days activity across all sources"
            >
              {activityData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <p>No activity data available</p>
                </div>
              ) : (
                <>
                  <div className="h-64 flex items-end gap-2 bg-gray-50 px-4 py-4 rounded-lg border border-gray-200">
                    {activityData.map((item, idx) => {
                      const maxValue = Math.max(
                        ...activityData.map((d) => d.repositories),
                        1
                      );
                      const heightPercentage =
                        (item.repositories / maxValue) * 100;

                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center gap-1 group"
                        >
                          <div
                            className="w-full bg-gray-900 rounded-t transition-all duration-200 hover:bg-gray-700 cursor-pointer shadow-sm"
                            style={{
                              height: `${Math.max(heightPercentage, 10)}%`,
                              minHeight: "12px",
                            }}
                            title={`Date: ${item.date}\n${item.repositories} repositories\n${item.stories} stories`}
                          />
                          <span className="text-xs text-gray-600 mt-1 font-medium">
                            {item.date.split("-")[2]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-900 rounded-sm" />
                      <span>Repositories ({activityData.length} days)</span>
                    </div>
                  </div>
                </>
              )}
            </ChartCard>
          </div>

          {/* Top Languages */}
          <ChartCard title="Top Languages" subtitle="By repository count">
            <div className="space-y-3">
              {languageStats.slice(0, 5).map((lang) => (
                <div key={lang.language} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {lang.language}
                    </span>
                    <span className="text-xs text-green-600">{lang.trend}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {lang.repositories} repos
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Trending Topics Section */}
        <TrendingTopics source="github" limit={15} />

        {/* Data Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {/* Trending Repositories */}
          <ChartCard
            title="Trending Repositories"
            subtitle="Top GitHub projects this week"
          >
            <DataTable
              columns={[
                {
                  header: "Repository",
                  key: "repository",
                  render: (value) => (
                    <div className="text-sm font-medium text-gray-900">
                      {value}
                    </div>
                  ),
                },
                {
                  header: "Stars",
                  key: "stars",
                  render: (value) => (
                    <div className="text-sm text-gray-700">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : value}
                    </div>
                  ),
                  className: "text-right",
                },
                {
                  header: "Trend",
                  key: "stars_today",
                  render: (value) => (
                    <div className="text-sm font-medium text-green-600">
                      +{value || 0}
                    </div>
                  ),
                  className: "text-right",
                },
              ]}
              data={trendingRepositories}
              rowKey="id"
            />
            <Link
              to="/trending"
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors mt-4"
            >
              View all repositories <span>→</span>
            </Link>
          </ChartCard>

          {/* Trending Stories */}
          <ChartCard
            title="Trending Stories"
            subtitle="Top HackerNews posts this week"
          >
            <DataTable
              columns={[
                {
                  header: "Title",
                  key: "title",
                  render: (value) => (
                    <div className="text-sm font-medium text-gray-900 line-clamp-2">
                      {value}
                    </div>
                  ),
                },
                {
                  header: "Points",
                  key: "points",
                  render: (value) => (
                    <div className="text-sm text-gray-700">{value}</div>
                  ),
                  className: "text-right",
                },
              ]}
              data={trendingStories}
              rowKey="id"
            />
            <Link
              to="/trending"
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors mt-4"
            >
              View all stories <span>→</span>
            </Link>
          </ChartCard>
        </div>

        {/* Language Statistics Table */}
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
                    {value}
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
                header: "Repos",
                key: "repositories",
                render: (value) => (
                  <div className="text-sm text-gray-700">{value}</div>
                ),
              },
              {
                header: "Stars",
                key: "stars",
                render: (value) => (
                  <div className="text-sm text-gray-700">{value}</div>
                ),
              },
              {
                header: "Percentage",
                key: "percentage",
                render: (value) => (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-700">{value}%</span>
                  </div>
                ),
              },
              {
                header: "Trend",
                key: "trend",
                render: (value) => (
                  <div className="text-sm font-medium text-green-600">
                    {value}
                  </div>
                ),
                className: "text-right",
              },
            ]}
            data={languageStats}
            rowKey="rank"
          />
        </ChartCard>

        {/* Top Repositories */}
        <ChartCard
          title="Top Repositories"
          subtitle="Most starred repositories overall"
        >
          <DataTable
            columns={[
              {
                header: "#",
                key: "id",
                render: (value) => {
                  const idx = topRepositories.findIndex((r) => r.id === value);
                  return (
                    <div className="text-sm font-semibold text-gray-600">
                      {idx + 1}
                    </div>
                  );
                },
                className: "w-8",
              },
              {
                header: "Repository",
                key: "repository",
                render: (value, row) => (
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {row.author || "Unknown"}
                    </div>
                  </div>
                ),
              },
              {
                header: "Stars",
                key: "stars",
                render: (value) => (
                  <div className="text-sm font-medium text-gray-900">
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </div>
                ),
              },
              {
                header: "Forks",
                key: "forks",
                render: (value) => (
                  <div className="text-sm text-gray-700">
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </div>
                ),
              },
              {
                header: "Language",
                key: "language",
                render: (value) => (
                  <div className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {value}
                  </div>
                ),
              },
            ]}
            data={topRepositories}
            rowKey="id"
          />
        </ChartCard>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">
                Explore Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Dive deeper into language trends and detailed statistics
              </p>
              <Link
                to="/analytics"
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors"
              >
                View analytics <span>→</span>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">
                Search Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Search across all repositories and stories
              </p>
              <Link
                to="/search"
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors"
              >
                Start searching <span>→</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
