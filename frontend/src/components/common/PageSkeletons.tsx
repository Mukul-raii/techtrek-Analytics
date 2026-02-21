import { Skeleton } from "@/components/ui/skeleton";

function PanelSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`rounded-2xl border border-slate-200/60 bg-slate-100 ${className ?? ""}`} />;
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-4">
      <PanelSkeleton className="h-24" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <PanelSkeleton key={idx} className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <PanelSkeleton className="h-72 xl:col-span-3" />
        <PanelSkeleton className="h-72 xl:col-span-2" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <PanelSkeleton className="h-72 xl:col-span-4" />
        <PanelSkeleton className="h-72 xl:col-span-4" />
        <PanelSkeleton className="h-72 xl:col-span-4" />
      </div>
    </div>
  );
}

export function TrendingPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <PanelSkeleton key={idx} className="h-24" />
        ))}
      </div>
      <PanelSkeleton className="h-36" />
      <PanelSkeleton className="h-14" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <PanelSkeleton key={idx} className="h-56" />
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <PanelSkeleton key={idx} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelSkeleton className="h-72 xl:col-span-2" />
        <PanelSkeleton className="h-72 xl:col-span-1" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PanelSkeleton className="h-64" />
        <PanelSkeleton className="h-64" />
      </div>
      <PanelSkeleton className="h-80" />
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <div className="space-y-4">
      <PanelSkeleton className="h-28" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, idx) => (
          <PanelSkeleton key={idx} className="h-36" />
        ))}
      </div>
    </div>
  );
}
