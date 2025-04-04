import { Card, CardContent, CardHeader, CardTitle } from "#/components";
import { cn } from "#/lib/utils";

interface StatisticsCardProps {
  title: string;
  children: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export default function StatisticsCard({ title, children, compact, className }: StatisticsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("pb-2", compact && "py-3")}>
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn(compact && "py-3")}>
        {children}
      </CardContent>
    </Card>
  );
}
