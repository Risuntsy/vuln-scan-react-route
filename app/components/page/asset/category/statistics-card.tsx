import { Card, CardContent, CardHeader, CardTitle } from "#/components";
import { cn } from "#/lib/utils";

interface StatisticsCardProps {
  title: string;
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export function StatisticsCard({ title, children, compact, className }: StatisticsCardProps) {
  // 优化间距：header和content都用更紧凑的padding
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("py-2", compact && "py-1")}>
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn("py-2", compact && "py-1")}>
        {children}
      </CardContent>
    </Card>
  );
}
