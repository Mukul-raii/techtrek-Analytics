import { MainLayout } from "@/components/layout/MainLayout";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";

export function Analytics() {
  const { data, isLoading, error } = useAnalytics("month");

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
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
        <div className="flex items-center justify-center min-h-[400px]">
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
    },
    {
      title: "Most Popular Language",
      value: data?.topLanguage.name || "N/A",
      trend: "stable" as const,
      description: `${data?.topLanguage.percentage || 0}% of all repositories`,
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
            In-depth analysis of tech trends and statistics
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Language Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📊</span>
                  <p className="text-sm text-gray-500">
                    Chart visualization here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Trend Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <span className="text-4xl mb-2 block">📈</span>
                  <p className="text-sm text-gray-500">
                    Chart visualization here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Languages Table */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Top Programming Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-2 sm:px-0">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr className="text-left">
                      <th className="pb-3 pr-4 font-semibold text-gray-900">
                        Language
                      </th>
                      <th className="pb-3 px-2 sm:px-4 font-semibold text-gray-900">
                        Repositories
                      </th>
                      <th className="pb-3 px-2 sm:px-4 font-semibold text-gray-900">
                        Stars
                      </th>
                      <th className="pb-3 pl-2 sm:pl-4 font-semibold text-gray-900">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(data?.topLanguages || []).map((item) => (
                      <tr
                        key={item.language}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 pr-4 font-medium text-gray-900">
                          {item.language}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-gray-600">
                          {item.repositories}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-gray-600">
                          {item.stars}
                        </td>
                        <td className="py-3 pl-2 sm:pl-4 text-green-600 font-medium">
                          {item.trend}
                        </td>
                      </tr>
                    ))}
                    {(!data?.topLanguages ||
                      data.topLanguages.length === 0) && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-gray-500"
                        >
                          No language data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
