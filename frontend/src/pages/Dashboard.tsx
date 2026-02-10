import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { MetricCard } from '@/components/common/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Dashboard() {
  const metrics = [
    {
      title: 'Total Repositories',
      value: '1,234',
      change: 12.5,
      trend: 'up' as const,
      icon: <span className="text-2xl">📦</span>,
    },
    {
      title: 'Active Stories',
      value: '456',
      change: 8.2,
      trend: 'up' as const,
      icon: <span className="text-2xl">📰</span>,
    },
    {
      title: 'Top Languages',
      value: '25',
      change: -2.1,
      trend: 'down' as const,
      icon: <span className="text-2xl">💻</span>,
    },
    {
      title: 'Avg. Stars',
      value: '3.2K',
      change: 5.7,
      trend: 'up' as const,
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
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🔥</span>
                <CardTitle className="text-base sm:text-lg">Trending Repositories</CardTitle>
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
                <CardTitle className="text-base sm:text-lg">Analytics Insights</CardTitle>
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
