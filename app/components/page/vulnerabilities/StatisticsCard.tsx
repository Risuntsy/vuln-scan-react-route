import { Card, CardContent } from "#/components/ui/card";

interface SubStat {
  label: string;
  value: number | string;
}

interface StatisticsCardProps {
  title: string;
  mainValue: string | number;
  subStats: SubStat[];
  mainValueColor?: string;
}

export function StatisticsCard({
  title,
  mainValue,
  subStats,
  mainValueColor = "text-foreground"
}: StatisticsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${mainValueColor}`}>{mainValue}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {subStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-1">
                <span>{stat.label}</span>
                <span className="font-medium text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
