import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

export function Dashboard() {
  const { metrics, isLoading, error } = useDashboard();

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

  const metricCards = [
    {
      title: "Total Repositories",
      value: String(metrics?.totalRepositories.value || 0),
      change: metrics?.totalRepositories.change || 0,
      trend: metrics?.totalRepositories.trend || ("stable" as const),
      icon: <span className="text-2xl">📦</span>,
    },
    {
      title: "Active Stories",
      value: String(metrics?.activeStories.value || 0),
      change: metrics?.activeStories.change || 0,
      trend: metrics?.activeStories.trend || ("stable" as const),
      icon: <span className="text-2xl">📰</span>,
    },
    {
      title: "Top Languages",
      value: String(metrics?.topLanguages.value || 0),
      change: metrics?.topLanguages.change || 0,
      trend: metrics?.topLanguages.trend || ("stable" as const),
      icon: <span className="text-2xl">💻</span>,
    },
    {
      title: "Avg. Stars",
      value: metrics?.avgStars.value || "0",
      change: metrics?.avgStars.change || 0,
      trend: metrics?.avgStars.trend || ("stable" as const),
      icon: <span className="text-2xl">⭐</span>,
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Overview of trending tech data and analytics
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {metricCards.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🔥</span>
                <CardTitle className="text-base sm:text-lg">
                  Trending Repositories
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                View the latest trending repositories from GitHub
              </p>
              <Link
                to="/trending"
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors"
              >
                View all trending <span>→</span>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📈</span>
                <CardTitle className="text-base sm:text-lg">
                  Analytics Insights
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Explore detailed analytics and language statistics
              </p>
              <Link
                to="/analytics"
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline transition-colors"
              >
                View analytics <span>→</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
