import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/useSearch";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { Search as SearchIcon, Sparkles } from "lucide-react";

export function Search() {
  const { query, results, isSearching, updateQuery } = useSearch();

  const quickSuggestions = [
    "React",
    "AI & Machine Learning",
    "TypeScript",
    "Web3",
    "DevOps",
  ];

  return (
    <MainLayout>
      <div className="space-y-4">
        <section className="panel-surface p-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search repositories, languages, or stories..."
                  value={query}
                  onChange={(e) => updateQuery(e.target.value)}
                  className="h-11 border-slate-200 bg-slate-50 pl-9"
                />
              </div>
              <Button className="h-11 rounded-lg bg-blue-700 px-6 text-white hover:bg-blue-600">Search</Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Sparkles className="h-3.5 w-3.5" />
                Trending topics
              </span>
              {quickSuggestions.map((term) => (
                <button
                  key={term}
                  onClick={() => updateQuery(term)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isSearching ? (
          <LoadingState type="list" count={5} />
        ) : results.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              {results.length} Result{results.length !== 1 ? "s" : ""} found
            </h2>

            {results.map((result) => (
              <Card
                key={result.id}
                className="rounded-xl border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                          {result.type}
                        </Badge>
                        {result.metadata.language ? (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            {result.metadata.language}
                          </Badge>
                        ) : null}
                      </div>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-blue-700 hover:text-blue-600"
                      >
                        View →
                      </a>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{result.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{result.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <span>Author: {result.metadata.author}</span>
                      {result.metadata.stars ? <span>Stars: {result.metadata.stars}</span> : null}
                      {result.metadata.score ? <span>Score: {result.metadata.score}</span> : null}
                      <span>{result.metadata.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        ) : query ? (
          <EmptyState
            title="No results found"
            description="Try different keywords or broader terms."
            icon={<SearchIcon className="h-10 w-10" />}
          />
        ) : (
          <section className="panel-surface p-6">
            <EmptyState
              title="Start searching"
              description="Enter a keyword to discover repositories and stories."
              icon={<SearchIcon className="h-10 w-10" />}
            />
          </section>
        )}
      </div>
    </MainLayout>
  );
}
