import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDashboard } from "@/hooks/useDashboard";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { TrendLinePanel } from "@/components/dashboard/TrendLinePanel";
import { EfficiencyBarPanel } from "@/components/dashboard/EfficiencyBarPanel";
import { CategoryDistributionPanel } from "@/components/dashboard/CategoryDistributionPanel";
import { QuickInsightsPanel } from "@/components/dashboard/QuickInsightsPanel";
import { ProductivityDonutPanel } from "@/components/dashboard/ProductivityDonutPanel";
import { DashboardPageSkeleton } from "@/components/common/PageSkeletons";

export function Dashboard() {
  const [timeRange] = useState("month");
  const [source] = useState("all");

  const { metrics, languageStats, activityData, isLoading, error } =
    useDashboard(timeRange, source);

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
          {error ? (
            <div className="panel-surface p-8 text-center text-rose-600">
              {error}
            </div>
          ) : (
            <>
              <KpiStrip items={kpis.values} />

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                <div className="xl:col-span-3">
                  <TrendLinePanel data={activityData} />
                </div>
                <div className="xl:col-span-2">
                  <EfficiencyBarPanel
                    data={activityData.map((item) => ({
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
