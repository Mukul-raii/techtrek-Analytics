import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="panel-surface flex flex-col items-center justify-center px-4 py-12 text-center">
      <AlertTriangle className="mb-3 h-10 w-10 text-rose-500" />
      <h3 className="mb-1 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mb-5 max-w-md text-sm text-slate-500">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
