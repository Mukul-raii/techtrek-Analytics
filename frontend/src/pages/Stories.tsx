import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataPageFilters, type SortOption } from "@/components/data/DataPageFilters";
import { PaginationControls } from "@/components/data/PaginationControls";
import { TopTenPanel } from "@/components/data/TopTenPanel";
import { StoryCard } from "@/components/trending/StoryCard";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { DataListingPageSkeleton } from "@/components/common/PageSkeletons";
import { useTrendingBySource } from "@/hooks/queries/useTrending";
import type { HackerNewsStory } from "@/types/trending";
import { Newspaper } from "lucide-react";

const PAGE_SIZE = 50;
const storySortOptions: SortOption[] = [
  { value: "popularity", label: "Trending" },
  { value: "score", label: "Score: High to Low" },
  { value: "score_asc", label: "Score: Low to High" },
  { value: "recent", label: "Most Recent" },
];

export function Stories() {
  const [query, setQuery] = useState("");
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week");
  const [sort, setSort] = useState<SortOption["value"]>("popularity");
  const [page, setPage] = useState(1);

  const {
    data: listResponse,
    isLoading: isListLoading,
    error: listError,
    refetch: refetchList,
  } = useTrendingBySource<HackerNewsStory>("hackernews", {
    enhanced: true,
    timeRange,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const {
    data: topResponse,
    isLoading: isTopLoading,
    error: topError,
    refetch: refetchTop,
  } = useTrendingBySource<HackerNewsStory>("hackernews", {
    enhanced: true,
    timeRange,
    sort,
    page: 1,
    pageSize: 10,
  });

  const filteredStories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const stories = listResponse?.data || [];
    if (!normalized) return stories;

    return stories.filter((story) =>
      [story.title, story.author]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [query, listResponse?.data]);

  const filteredTopStories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const topStories = topResponse?.data || [];
    if (!normalized) return topStories;

    return topStories.filter((story) =>
      [story.title, story.author]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [query, topResponse?.data]);

  const error = listError || topError;
  const isLoading = isListLoading || isTopLoading;
  const totalPages = listResponse?.totalPages || 1;
  const totalItems = listResponse?.total || 0;

  const onFilterChange = (
    updater: () => void
  ) => {
    updater();
    setPage(1);
  };

  if (error) {
    return (
      <MainLayout>
        <ErrorState
          message={error.message}
          onRetry={() => {
            refetchList();
            refetchTop();
          }}
        />
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <DataListingPageSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <DataPageFilters
          query={query}
          onQueryChange={setQuery}
          timeRange={timeRange}
          onTimeRangeChange={(value) =>
            onFilterChange(() => setTimeRange(value))
          }
          sort={sort}
          sortOptions={storySortOptions}
          onSortChange={(value) => onFilterChange(() => setSort(value))}
        />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            {filteredStories.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No stories found"
                description="Try changing your search, time range, or sort."
                icon={<Newspaper className="h-10 w-10" />}
              />
            )}

            <PaginationControls
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>

          <aside className="xl:col-span-4">
            <TopTenPanel mode="stories" items={filteredTopStories} />
          </aside>
        </section>
      </div>
    </MainLayout>
  );
}
