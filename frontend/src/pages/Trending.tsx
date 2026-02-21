import { MainLayout } from "@/components/layout/MainLayout";
import { FilterBar } from "@/components/trending/FilterBar";
import { RepositoryCard } from "@/components/trending/RepositoryCard";
import { StoryCard } from "@/components/trending/StoryCard";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useTrending } from "@/hooks/queries/useTrending";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Package, Search } from "lucide-react";
import { TrendingPageSkeleton } from "@/components/common/PageSkeletons";
import type {
  TrendingRepository,
  HackerNewsStory,
  TrendingFilters,
} from "@/types/trending";
import { useState } from "react";

export function Trending() {
  const [filters, setFilters] = useState<TrendingFilters>({
    source: "all",
    dateRange: "week",
    language: "",
    sortBy: "trending",
  });

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useTrending({
    limit: 50,
    enhanced: true,
    ...(filters.source !== "all" && {
      source: filters.source as "github" | "hackernews",
    }),
    ...(filters.language && { language: filters.language }),
    timeRange: filters.dateRange as "today" | "week" | "month",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (response as any)?.data || [];
  const repositories = data.filter(
    (item: { source: string }) => item.source === "github"
  );
  const stories = data.filter(
    (item: { source: string }) => item.source === "hackernews"
  );

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  if (error) {
    return (
      <MainLayout>
        <ErrorState message={error.message} onRetry={refetch} />
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <TrendingPageSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <article className="kpi-tile">
            <p className="text-sm text-slate-500">Trending Repositories</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {repositories.length}
            </p>
          </article>
          <article className="kpi-tile">
            <p className="text-sm text-slate-500">Top Stories</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {stories.length}
            </p>
          </article>
          <article className="kpi-tile">
            <p className="text-sm text-slate-500">Source</p>
            <p className="mt-1 text-3xl font-semibold capitalize text-slate-900">
              {filters.source}
            </p>
          </article>
        </section>

        <section className="panel-surface p-4">
          <FilterBar
            filters={filters}
            onFilterChange={updateFilters}
            languages={["JavaScript", "Python", "TypeScript", "Go", "Rust"]}
          />
        </section>

        <section className="panel-surface p-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-lg bg-slate-100 p-1 sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="repositories">
                Repos ({repositories.length})
              </TabsTrigger>
              <TabsTrigger value="stories">
                Stories ({stories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-8">
              <>
                {repositories.length > 0 && (
                  <div>
                    <h2 className="mb-3 text-lg font-semibold text-slate-900">
                      Trending Repositories
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {repositories
                        .slice(0, 6)
                        .map((repo: TrendingRepository) => (
                          <RepositoryCard key={repo.id} repository={repo} />
                        ))}
                    </div>
                  </div>
                )}

                {stories.length > 0 && (
                  <div>
                    <h2 className="mb-3 text-lg font-semibold text-slate-900">
                      Top Stories
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {stories.slice(0, 6).map((story: HackerNewsStory) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </div>
                )}

                {repositories.length === 0 && stories.length === 0 && (
                  <EmptyState
                    title="No trending items found"
                    description="Try adjusting your filters to see more results"
                    icon={<Search className="h-10 w-10" />}
                  />
                )}
              </>
            </TabsContent>

            <TabsContent value="repositories" className="mt-4">
              {repositories.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {repositories.map((repo: TrendingRepository) => (
                    <RepositoryCard key={repo.id} repository={repo} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No repositories found"
                  description="Try adjusting your filters"
                  icon={<Package className="h-10 w-10" />}
                />
              )}
            </TabsContent>

            <TabsContent value="stories" className="mt-4">
              {stories.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {stories.map((story: HackerNewsStory) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No stories found"
                  description="Try adjusting your filters"
                  icon={<Newspaper className="h-10 w-10" />}
                />
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </MainLayout>
  );
}
