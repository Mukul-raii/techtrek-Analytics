import { RefreshCw, Database, Clock, TrendingUp, Server } from "lucide-react";
import { useAdminStats } from "@/hooks/queries/useAdmin";

interface AdminStats {
  overview: {
    totalItems: number;
    githubCount: number;
    hackerNewsCount: number;
    totalStars: number;
    totalPoints: number;
  };
  github: {
    source: string;
    count: number;
    totalStars: number;
    totalForks: number;
    lastUpdated: string;
  };
  hackerNews: {
    source: string;
    count: number;
    totalPoints: number;
    totalComments: number;
    lastUpdated: string;
  };
  sql: {
    enabled: boolean;
    tables: Array<{ tableName: string; rowCount: number }>;
    lastChecked?: string;
    message?: string;
  };
  lastIngestion: {
    lastRun: string | null;
    status: string;
    lastFile?: string;
  };
  timestamp: string;
}

export default function Admin() {
  const { data, isLoading, error, refetch } = useAdminStats();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats = (data as any)?.data as AdminStats | undefined;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const getTimeSince = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ago`;
    if (hours > 0) return `${hours}h ago`;
    return "< 1h ago";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">
              Error Loading Admin Stats
            </h3>
            <p className="text-red-600 dark:text-red-300">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }
  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              System statistics and data management
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Last Updated */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            Last updated: {formatDate(stats.timestamp)}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Items
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.overview.totalItems)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Server className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                GitHub Repos
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.overview.githubCount)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                HN Stories
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.overview.hackerNewsCount)}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Last Ingestion
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {getTimeSince(stats.lastIngestion.lastRun)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats.lastIngestion.status}
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GitHub Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              GitHub Data
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Repositories
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.github.count)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Stars
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.github.totalStars)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Forks
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.github.totalForks)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(stats.github.lastUpdated)}
                </span>
              </div>
            </div>
          </div>

          {/* HackerNews Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              HackerNews Data
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Stories
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.hackerNews.count)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Points
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.hackerNews.totalPoints)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Comments
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(stats.hackerNews.totalComments)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Updated
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(stats.hackerNews.lastUpdated)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SQL Database Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            SQL Database
          </h2>
          {stats.sql.enabled ? (
            <div>
              {stats.sql.tables && stats.sql.tables.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">
                          Table Name
                        </th>
                        <th className="text-right py-2 px-4 text-gray-600 dark:text-gray-400 font-medium">
                          Row Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.sql.tables.map((table) => (
                        <tr
                          key={table.tableName}
                          className="border-b border-gray-100 dark:border-gray-700/50"
                        >
                          <td className="py-2 px-4 text-gray-900 dark:text-white">
                            {table.tableName}
                          </td>
                          <td className="text-right py-2 px-4 text-gray-900 dark:text-white font-semibold">
                            {formatNumber(table.rowCount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No tables found
                </p>
              )}
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">
              {stats.sql.message || "SQL Database not configured"}
            </div>
          )}
        </div>

        {/* Last Ingestion Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Ingestion Status
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Run</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.lastIngestion.lastRun
                  ? formatDate(stats.lastIngestion.lastRun)
                  : "Never"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.lastIngestion.status}
              </span>
            </div>
            {stats.lastIngestion.lastFile && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Last File
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {stats.lastIngestion.lastFile}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
