import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/useSearch";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { Search as SearchIcon, GitCompare } from "lucide-react";

export function Search() {
  const { query, results, isSearching, updateQuery } = useSearch();

  const popularSearches = [
    "React",
    "AI & Machine Learning",
    "TypeScript",
    "Web3",
    "DevOps",
  ];

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6 sm:pb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
            Search
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Discover repositories, stories, and trends across GitHub and
            HackerNews
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <Card className="border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-5">
              {/* Search Input */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search repositories, languages, topics..."
                    value={query}
                    onChange={(e) => updateQuery(e.target.value)}
                    className="pl-10 text-sm sm:text-base w-full h-11 border-gray-300"
                  />
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto h-11 px-8 transition-colors font-medium shadow-sm hover:shadow-md">
                  Search
                </Button>
              </div>

              {/* Popular Searches */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                  Trending topics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => updateQuery(term)}
                      className="px-3 py-2 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium transition-all duration-200 hover:border-gray-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {isSearching ? (
          <LoadingState type="list" count={5} />
        ) : results.length > 0 ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {results.length} Result{results.length !== 1 ? "s" : ""} found
              </h2>
              <p className="text-xs text-gray-500">
                Showing all matches for "{query}"
              </p>
            </div>

            <div className="space-y-4">
              {results.map((result) => (
                <Card
                  key={result.id}
                  className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="space-y-4">
                      {/* Top row with badges */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs font-medium bg-gray-50"
                          >
                            {result.type}
                          </Badge>
                          {result.metadata.language && (
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium"
                            >
                              {result.metadata.language}
                            </Badge>
                          )}
                        </div>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 whitespace-nowrap transition-colors px-3 py-1 hover:bg-gray-50 rounded"
                        >
                          View →
                        </a>
                      </div>

                      {/* Title and Description */}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 leading-snug hover:text-gray-700 transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {result.description}
                        </p>
                      </div>

                      {/* Metadata row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1 truncate">
                          <span className="font-medium">By</span>
                          {result.metadata.author}
                        </span>
                        {result.metadata.stars && (
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            ⭐ {result.metadata.stars}
                          </span>
                        )}
                        {result.metadata.score && (
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            ⬆️ {result.metadata.score} points
                          </span>
                        )}
                        <span className="whitespace-nowrap">
                          {result.metadata.date}
                        </span>
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
            description={`Try adjusting your keywords or filters to find what you're looking for.`}
            icon="🔍"
          />
        ) : (
          <div className="space-y-6">
            <EmptyState
              title="Start searching"
              description="Enter keywords to discover repositories and trending stories"
              icon="🔍"
            />
            <Card className="border border-gray-200 bg-gray-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <GitCompare className="w-5 h-5" />
                      GitHub Search
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Search across open-source repositories with millions of
                      projects
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>✓ Filter by language or topic</li>
                      <li>✓ View stars and forks</li>
                      <li>✓ See recent activity</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>📰</span>
                      HackerNews Search
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Discover trending stories from the tech community
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>✓ Real-time trending stories</li>
                      <li>✓ Community discussions</li>
                      <li>✓ Curated tech news</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
