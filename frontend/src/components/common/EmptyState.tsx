import type { ReactNode } from "react";
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      {icon ? <div className="mb-4 text-slate-400">{icon}</div> : null}
      <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mb-5 max-w-md text-sm text-slate-500">{description}</p> : null}
      {action ? (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
