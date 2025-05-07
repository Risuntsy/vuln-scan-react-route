import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Database, Globe, Link, ShieldAlert, AlertTriangle } from "lucide-react";
import type { AssetStatisticsResponse } from "#/api/dashboard/entity";

interface AssetStatisticsProps {
  data: AssetStatisticsResponse;
}

export function AssetStatistics({ data }: AssetStatisticsProps) {
  const stats = [
    {
      title: "总资产数",
      value: data.assetCount ,
      icon: Database,
      color: "text-blue-500",
      description: "已发现的资产总数"
    },
    {
      title: "子域名",
      value: data.subdomainCount,
      icon: Globe,
      color: "text-green-500",
      description: "发现的子域名数量"
    },
    {
      title: "敏感信息",
      value: data.sensitiveCount,
      icon: ShieldAlert,
      color: "text-red-500",
      description: "发现的敏感信息数量"
    },
    {
      title: "URL数量",
      value: data.urlCount,
      icon: Link,
      color: "text-purple-500",
      description: "发现的URL数量"
    },
    {
      title: "漏洞数量",
      value: data.vulnerabilityCount,
      icon: AlertTriangle,
      color: "text-orange-500",
      description: "发现的漏洞总数"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 