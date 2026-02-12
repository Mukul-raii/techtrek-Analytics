import { MainLayout } from "@/components/layout/MainLayout";
import { FilterBar } from "@/components/trending/FilterBar";
import { RepositoryCard } from "@/components/trending/RepositoryCard";
import { StoryCard } from "@/components/trending/StoryCard";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { useTrending } from "@/hooks/useTrending";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Trending() {
  const {
    repositories,
    stories,
    filters,
    isLoading,
    error,
    updateFilters,
    refetch,
  } = useTrending();

  if (error) {
    return (
      <MainLayout>
        <ErrorState message={error} onRetry={refetch} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Trending
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover the most popular repositories and stories right now
          </p>
        </div>

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={updateFilters}
          languages={["JavaScript", "Python", "TypeScript", "Go", "Rust"]}
        />

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="repositories" className="text-xs sm:text-sm">
              Repos ({repositories.length})
            </TabsTrigger>
            <TabsTrigger value="stories" className="text-xs sm:text-sm">
              Stories ({stories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-8">
            {isLoading ? (
              <LoadingState type="card" count={6} />
            ) : (
              <>
                {/* Repositories Section */}
                {repositories.length > 0 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                      🔥 Trending Repositories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                      {repositories.slice(0, 6).map((repo) => (
                        <RepositoryCard key={repo.id} repository={repo} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Stories Section */}
                {stories.length > 0 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                      📰 Top Stories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                      {stories.slice(0, 6).map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </div>
                )}

                {repositories.length === 0 && stories.length === 0 && (
                  <EmptyState
                    title="No trending items found"
                    description="Try adjusting your filters to see more results"
                    icon="🔍"
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="repositories" className="mt-6">
            {isLoading ? (
              <LoadingState type="card" count={6} />
            ) : repositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {repositories.map((repo) => (
                  <RepositoryCard key={repo.id} repository={repo} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No repositories found"
                description="Try adjusting your filters"
                icon="📦"
              />
            )}
          </TabsContent>

          <TabsContent value="stories" className="mt-6">
            {isLoading ? (
              <LoadingState type="list" count={6} />
            ) : stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No stories found"
                description="Try adjusting your filters"
                icon="📰"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
