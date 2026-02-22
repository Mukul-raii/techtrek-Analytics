import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAnalytics, useDailyAnalytics } from "@/hooks/queries/useAnalytics";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { TrendLinePanel } from "@/components/dashboard/TrendLinePanel";
import { EfficiencyBarPanel } from "@/components/dashboard/EfficiencyBarPanel";
import { CategoryDistributionPanel } from "@/components/dashboard/CategoryDistributionPanel";
import { QuickInsightsPanel } from "@/components/dashboard/QuickInsightsPanel";
import { ProductivityDonutPanel } from "@/components/dashboard/ProductivityDonutPanel";
import { DashboardPageSkeleton } from "@/components/common/PageSkeletons";

export function Dashboard() {
  const [timeRange] = useState<"week" | "month" | "year">("month");

  const { data: analyticsResponse, isLoading: analyticsLoading } = useAnalytics(
    { range: timeRange }
  );
  const { data: dailyResponse, isLoading: dailyLoading } = useDailyAnalytics({
    range: "week",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analyticsData = (analyticsResponse as any)?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dailyMetrics = ((dailyResponse as any)?.data ?? []) as DailyMetric[];

  const isLoading = analyticsLoading || dailyLoading;

  // Transform analytics data to match dashboard format
  const metrics = useMemo(() => {
    if (!analyticsData) return null;

    return {
      totalRepositories: {
        value: analyticsData.githubStats?.totalRepositories ?? 0,
        change: 5.2, // Mock change percentage
        trend: "up" as const,
      },
      activeStories: {
        value: analyticsData.hackerNewsStats?.totalStories ?? 0,
        change: 3.1,
        trend: "up" as const,
      },
      topLanguages: {
        value: analyticsData.githubStats?.topLanguages?.length ?? 0,
        change: 0,
        trend: "stable" as const,
      },
      avgStars: {
        value: analyticsData.githubStats?.avgStars?.toLocaleString() ?? "0",
        change: 2.8,
        trend: "up" as const,
      },
    };
  }, [analyticsData]);

  const languageStats = useMemo(() => {
    if (!analyticsData?.languageStats) return [];

    return analyticsData.languageStats.map(
      (
        stat: {
          language: string;
          count: number;
          stars: number;
          percentage: number;
        },
        index: number
      ) => ({
        rank: index + 1,
        language: stat.language,
        repositories: stat.count,
        stars: stat.stars.toLocaleString(),
        percentage: stat.percentage,
        trend: "stable",
      })
    );
  }, [analyticsData]);

  const activity = useMemo(() => {
    return transformDailyMetrics(dailyMetrics);
  }, [dailyMetrics]);

  const kpis = useMemo(() => {
    const totalRepos = metrics?.totalRepositories.value ?? 0;
    const activeStories = metrics?.activeStories.value ?? 0;
    const languageCount = metrics?.topLanguages.value ?? 0;
    const avgStars = metrics?.avgStars.value ?? "0";

    const completionRate = Math.min(
      99.9,
      72 + (metrics?.totalRepositories.change ?? 0)
    );
    return {
      completionRate,
      values: [
        {
          label: "Total Repositories",
          value: String(totalRepos),
          sublabel: `${
            metrics?.totalRepositories.change ?? 0
          }% from last period`,
          trend: metrics?.totalRepositories.trend,
        },
        {
          label: "Active Stories",
          value: String(activeStories),
          sublabel: `${metrics?.activeStories.change ?? 0}% from last period`,
          trend: metrics?.activeStories.trend,
        },
        {
          label: "Top Languages",
          value: String(languageCount),
          sublabel: `${metrics?.topLanguages.change ?? 0}% from last period`,
          trend: metrics?.topLanguages.trend,
        },
        {
          label: "Avg. Stars",
          value: String(avgStars),
          sublabel: `${metrics?.avgStars.change ?? 0}% from last period`,
          trend: metrics?.avgStars.trend,
        },
      ],
      totalRepos,
      activeStories,
      avgStars,
    };
  }, [metrics]);

  return (
    <MainLayout>
      {isLoading ? (
        <DashboardPageSkeleton />
      ) : (
        <div className="space-y-4">
          {/*      <FilterBar
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            source={source}
            onSourceChange={setSource}
          />
  */}
          {!metrics ? (
            <div className="panel-surface p-8 text-center text-rose-600">
              Failed to load dashboard data
            </div>
          ) : (
            <>
              <KpiStrip items={kpis.values} />

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                <div className="xl:col-span-3">
                  <TrendLinePanel
                    data={activity.points}
                    sourceBreakdownAvailable={activity.hasSourceBreakdown}
                  />
                </div>
                <div className="xl:col-span-2">
                  <EfficiencyBarPanel
                    data={activity.points.map((item) => ({
                      date: item.date,
                      repositories: item.repositories,
                    }))}
                  />
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-4">
                  <CategoryDistributionPanel categories={languageStats} />
                </div>
                <div className="xl:col-span-4">
                  <QuickInsightsPanel
                    completionRate={kpis.completionRate}
                    averageStars={kpis.avgStars}
                    repositoryCount={kpis.totalRepos}
                    storyCount={kpis.activeStories}
                  />
                </div>
                <div className="xl:col-span-4">
                  <ProductivityDonutPanel items={languageStats} />
                </div>
              </section>
            </>
          )}
        </div>
      )}
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
      // Aggregate-only rows can't be split by source; keep only repository activity chart meaningful.
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
