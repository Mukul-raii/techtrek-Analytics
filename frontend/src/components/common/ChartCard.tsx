import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
  action,
}: ChartCardProps) {
  return (
    <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 bg-white hover:border-gray-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 border-b border-gray-100">
        <div className="flex-1">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="text-gray-400 hover:text-gray-600 transition-colors ml-4">
            {action}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-5 sm:pt-6">{children}</CardContent>
    </Card>
  );
}
