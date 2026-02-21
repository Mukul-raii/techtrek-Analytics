import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import type { ChartPanelProps } from "@/types/uiTheme";

interface LegacyChartCardProps extends ChartPanelProps {
  action?: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  actions,
  action,
  loading,
  empty,
  emptyLabel = "No data available",
  error,
  children,
}: LegacyChartCardProps) {
  const headerAction = actions ?? action;

  return (
    <section className="panel-surface h-full">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="text-slate-400">
          {headerAction ?? (
            <button className="rounded-lg p-1 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Panel options">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>
      <div className="px-4 py-4">
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {!loading && !error && empty ? <p className="text-sm text-slate-500">{emptyLabel}</p> : null}
        {!loading && !error && !empty ? children : null}
      </div>
    </section>
  );
}
