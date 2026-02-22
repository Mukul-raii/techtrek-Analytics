import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DataPageFilters, type SortOption } from "@/components/data/DataPageFilters";
import { PaginationControls } from "@/components/data/PaginationControls";
import { TopTenPanel } from "@/components/data/TopTenPanel";
import { RepositoryCard } from "@/components/trending/RepositoryCard";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { DataListingPageSkeleton } from "@/components/common/PageSkeletons";
import { useTrendingBySource } from "@/hooks/queries/useTrending";
import type { TrendingRepository } from "@/types/trending";
import { Package } from "lucide-react";

const PAGE_SIZE = 50;
const repoSortOptions: SortOption[] = [
  { value: "popularity", label: "Trending" },
  { value: "stars", label: "Stars: High to Low" },
  { value: "stars_asc", label: "Stars: Low to High" },
  { value: "recent", label: "Most Recent" },
];

export function Repositories() {
  const [query, setQuery] = useState("");
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("week");
  const [sort, setSort] = useState<SortOption["value"]>("popularity");
  const [page, setPage] = useState(1);

  const {
    data: listResponse,
    isLoading: isListLoading,
    error: listError,
    refetch: refetchList,
  } = useTrendingBySource<TrendingRepository>("github", {
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
  } = useTrendingBySource<TrendingRepository>("github", {
    enhanced: true,
    timeRange,
    sort,
    page: 1,
    pageSize: 10,
  });

  const filteredRepositories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const repositories = listResponse?.data || [];
    if (!normalized) return repositories;

    return repositories.filter((repo) =>
      [repo.repository, repo.description, repo.language]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [query, listResponse?.data]);

  const filteredTopRepositories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const topRepositories = topResponse?.data || [];
    if (!normalized) return topRepositories;

    return topRepositories.filter((repo) =>
      [repo.repository, repo.description, repo.language]
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
          sortOptions={repoSortOptions}
          onSortChange={(value) => onFilterChange(() => setSort(value))}
        />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-8">
            {filteredRepositories.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredRepositories.map((repo) => (
                  <RepositoryCard key={repo.id} repository={repo} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No repositories found"
                description="Try changing your search, time range, or sort."
                icon={<Package className="h-10 w-10" />}
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
            <TopTenPanel mode="repositories" items={filteredTopRepositories} />
          </aside>
        </section>
      </div>
    </MainLayout>
  );
}
