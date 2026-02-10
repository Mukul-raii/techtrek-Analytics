import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  type?: "card" | "list" | "table" | "chart";
  count?: number;
}

export function LoadingState({ type = "card", count = 3 }: LoadingStateProps) {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3"
          >
            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
            <Skeleton className="h-6 sm:h-8 w-28 sm:w-32" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-4 sm:p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 sm:h-4 w-40 sm:w-48" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4">
        <Skeleton className="h-5 sm:h-6 w-28 sm:w-32" />
        <Skeleton className="h-56 sm:h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-3">
      <Skeleton className="h-3 sm:h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}
