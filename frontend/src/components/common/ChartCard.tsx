import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div className="text-gray-400">{action}</div>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
