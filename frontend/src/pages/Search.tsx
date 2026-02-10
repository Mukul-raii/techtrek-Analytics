import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/useSearch";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";

export function Search() {
  const { query, results, isSearching, updateQuery } = useSearch();

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 sm:pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Search
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Find repositories and stories across all sources
          </p>
        </div>

        {/* Search Bar */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for repositories, stories, or topics..."
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  className="text-sm sm:text-base w-full h-11"
                />
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto h-11 px-6 transition-colors font-medium">
                Search
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 sm:mt-5">
              <p className="text-xs font-semibold text-gray-700 mb-2.5">
                Popular searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {["React", "AI", "Machine Learning", "Web3", "TypeScript"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => updateQuery(term)}
                      className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full text-gray-700 font-medium transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isSearching ? (
          <LoadingState type="list" count={5} />
        ) : results.length > 0 ? (
          <div className="space-y-4 sm:space-y-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {results.length} Results
            </h2>
            <div className="space-y-4">
              {results.map((result) => (
                <Card
                  key={result.id}
                  className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          {result.metadata.language && (
                            <Badge variant="secondary" className="text-xs">
                              {result.metadata.language}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 leading-snug">
                          {result.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                          {result.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="truncate">
                            by {result.metadata.author}
                          </span>
                          {result.metadata.stars && (
                            <span className="whitespace-nowrap">
                              ⭐ {result.metadata.stars}
                            </span>
                          )}
                          {result.metadata.score && (
                            <span className="whitespace-nowrap">
                              ⬆️ {result.metadata.score} points
                            </span>
                          )}
                          <span className="whitespace-nowrap">
                            {result.metadata.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 hover:underline whitespace-nowrap transition-colors"
                        >
                          View →
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : query ? (
          <EmptyState
            title="No results found"
            description={`No results found for "${query}". Try different keywords.`}
            icon="🔍"
          />
        ) : (
          <EmptyState
            title="Start searching"
            description="Enter keywords to find repositories and stories"
            icon="🔍"
          />
        )}
      </div>
    </MainLayout>
  );
}
