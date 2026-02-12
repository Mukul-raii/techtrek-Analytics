import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatGrid } from '@/components/dashboard/StatGrid';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ChartCard } from '@/components/common/ChartCard';
import { DataTable } from '@/components/common/DataTable';
import {
  mockDashboardMetrics,
  mockLanguageStats,
  mockTrendingRepositories,
  mockTrendingStories,
  mockTopRepositories,
  mockActivityData,
} from '@/utils/mockData';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

export function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [source, setSource] = useState('all');

  const stats = [
    {
      title: 'Total Repositories',
      value: mockDashboardMetrics.totalRepositories.value,
      change: mockDashboardMetrics.totalRepositories.change,
      trend: mockDashboardMetrics.totalRepositories.trend,
      icon: <Zap className="w-5 h-5" />,
    },
    {
      title: 'Active Stories',
      value: mockDashboardMetrics.activeStories.value,
      change: mockDashboardMetrics.activeStories.change,
      trend: mockDashboardMetrics.activeStories.trend,
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: 'Top Languages',
      value: mockDashboardMetrics.topLanguages.value,
      change: mockDashboardMetrics.topLanguages.change,
      trend: mockDashboardMetrics.topLanguages.trend,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      title: 'Avg. Stars',
      value: mockDashboardMetrics.avgStars.value,
      change: mockDashboardMetrics.avgStars.change,
      trend: mockDashboardMetrics.avgStars.trend,
      icon: <TrendingUp className="w-5 h-5" />,
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
            Overview of trending tech data, GitHub statistics, and HackerNews insights
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          source={source}
          onSourceChange={setSource}
        />

        {/* Key Metrics */}
        <StatGrid stats={stats} columns={4} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* Activity Over Time */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Activity Trend"
              subtitle="Last 7 days activity across all sources"
            >
              <div className="h-64 flex items-end gap-1">
                {mockActivityData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div
                      className="w-full bg-gray-900 rounded-sm transition-all duration-200 hover:bg-gray-700 cursor-pointer"
                      style={{
                        height: `${(item.repositories / 400) * 100}%`,
                      }}
                      title={`${item.repositories} repos, ${item.stories} stories`}
                    />
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.date.split('-')[2]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-900 rounded-sm" />
                  <span>Repositories</span>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* Top Languages */}
          <ChartCard title="Top Languages" subtitle="By repository count">
            <div className="space-y-3">
              {mockLanguageStats.slice(0, 5).map((lang) => (
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
                  <span className="text-xs text-gray-500">{lang.repositories} repos</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Data Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {/* Trending Repositories */}
          <ChartCard title="Trending Repositories" subtitle="Top GitHub projects this week">
            <DataTable
              columns={[
                {
                  header: 'Repository',
                  key: 'repository',
                  render: (value) => (
                    <div className="text-sm font-medium text-gray-900">{value}</div>
                  ),
                },
                {
                  header: 'Stars',
                  key: 'stars',
                  render: (value) => (
                    <div className="text-sm text-gray-700">{value}</div>
                  ),
                  className: 'text-right',
                },
                {
                  header: 'Trend',
                  key: 'trend',
                  render: (value) => (
                    <div className="text-sm font-medium text-green-600">{value}</div>
                  ),
                  className: 'text-right',
                },
              ]}
              data={mockTrendingRepositories.slice(0, 5)}
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
          <ChartCard title="Trending Stories" subtitle="Top HackerNews posts this week">
            <DataTable
              columns={[
                {
                  header: 'Title',
                  key: 'title',
                  render: (value) => (
                    <div className="text-sm font-medium text-gray-900 line-clamp-2">{value}</div>
                  ),
                },
                {
                  header: 'Points',
                  key: 'points',
                  render: (value) => (
                    <div className="text-sm text-gray-700">{value}</div>
                  ),
                  className: 'text-right',
                },
              ]}
              data={mockTrendingStories.slice(0, 5)}
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
        <ChartCard title="Language Statistics" subtitle="Comprehensive programming language metrics">
          <DataTable
            columns={[
              {
                header: 'Rank',
                key: 'rank',
                render: (value) => (
                  <div className="text-sm font-semibold text-gray-900">{value}</div>
                ),
                className: 'w-12',
              },
              {
                header: 'Language',
                key: 'language',
                render: (value) => (
                  <div className="text-sm font-medium text-gray-900">{value}</div>
                ),
              },
              {
                header: 'Repos',
                key: 'repositories',
                render: (value) => (
                  <div className="text-sm text-gray-700">{value}</div>
                ),
              },
              {
                header: 'Stars',
                key: 'stars',
                render: (value) => (
                  <div className="text-sm text-gray-700">{value}</div>
                ),
              },
              {
                header: 'Percentage',
                key: 'percentage',
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
                header: 'Trend',
                key: 'trend',
                render: (value) => (
                  <div className="text-sm font-medium text-green-600">{value}</div>
                ),
                className: 'text-right',
              },
            ]}
            data={mockLanguageStats}
            rowKey="rank"
          />
        </ChartCard>

        {/* Top Repositories */}
        <ChartCard title="Top Repositories" subtitle="Most starred repositories overall">
          <DataTable
            columns={[
              {
                header: '#',
                key: 'rank',
                render: (value) => (
                  <div className="text-sm font-semibold text-gray-600">{value}</div>
                ),
                className: 'w-8',
              },
              {
                header: 'Repository',
                key: 'name',
                render: (value, row: any) => (
                  <div>
                    <div className="text-sm font-medium text-gray-900">{value}</div>
                    <div className="text-xs text-gray-500">{row.owner}</div>
                  </div>
                ),
              },
              {
                header: 'Stars',
                key: 'stars',
                render: (value) => (
                  <div className="text-sm font-medium text-gray-900">{value}</div>
                ),
              },
              {
                header: 'Forks',
                key: 'forks',
                render: (value) => (
                  <div className="text-sm text-gray-700">{value}</div>
                ),
              },
              {
                header: 'Language',
                key: 'language',
                render: (value) => (
                  <div className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {value}
                  </div>
                ),
              },
            ]}
            data={mockTopRepositories}
            rowKey="rank"
          />
        </ChartCard>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Explore Analytics</CardTitle>
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
              <CardTitle className="text-base sm:text-lg">Search Data</CardTitle>
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
