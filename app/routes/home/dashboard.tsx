import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Header } from "#/components";
import {
  CheckCircle2,
  Clock,
  Play,
  Plus,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Database,
  Globe,
  ShieldAlert,
  AlertTriangle,
  Link as LinkIcon
} from "lucide-react";
import { SCAN_TASK_CREATE_ROUTE, SCAN_TASKS_ROUTE } from "#/routes";
import { getNodeData, getOverallAssetStatistics, getTaskData, getVersionData } from "#/api";
import { getToken } from "#/lib";
import { useEffect, Suspense } from "react";
import { Link, useLoaderData, useRevalidator, Await, type LoaderFunctionArgs } from "react-router";
import type { VersionData, NodeData, AssetStatisticsResponse } from "#/api";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  
  // All data as promises to avoid blocking
  const assetStatsPromise = getOverallAssetStatistics({ token });
  const taskDataPromise = getTaskData({ pageSize: 5, token });
  const nodeDataPromise = getNodeData({ token });
  const versionDataPromise = Promise.resolve({
    list: [
      {
        name: "ScopeSentry-Server",
        cversion: "1.7",
        lversion: "1.7",
        msg: "https://www.scope-sentry.top/guide/update/"
      },
      {
        name: "node-test",
        cversion: "1.7",
        lversion: "1.7",
        msg: "https://www.scope-sentry.top/guide/update/"
      }
    ]
  }); // getVersionData({ token })
  
  const recentTasksPromise = getTaskData({ pageSize: 3, token });

  return { 
    assetStatsPromise, 
    taskDataPromise, 
    nodeDataPromise, 
    versionDataPromise,
    recentTasksPromise
  };
}

const assetStatsConfig = [
  {
    title: "总资产数",
    key: "assetCount",
    icon: Database,
    color: "text-blue-500",
    description: "已发现的资产总数"
  },
  {
    title: "子域名",
    key: "subdomainCount",
    icon: Globe,
    color: "text-green-500",
    description: "发现的子域名数量"
  },
  {
    title: "敏感信息",
    key: "sensitiveCount",
    icon: ShieldAlert,
    color: "text-red-500",
    description: "发现的敏感信息数量"
  },
  {
    title: "URL数量",
    key: "urlCount",
    icon: LinkIcon,
    color: "text-purple-500",
    description: "发现的URL数量"
  },
  {
    title: "漏洞数量",
    key: "vulnerabilityCount",
    icon: AlertTriangle,
    color: "text-orange-500",
    description: "发现的漏洞总数",
    fallbackValue: 5
  }
];

function AssetStatistics({ assetStatsPromise }: { assetStatsPromise: Promise<AssetStatisticsResponse> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Suspense fallback={
        assetStatsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })
      }>
        <Await resolve={assetStatsPromise}>
          {(data) => 
            assetStatsConfig.map((stat, index) => {
              const Icon = stat.icon;
              const value = data[stat.key as keyof AssetStatisticsResponse] ?? stat.fallbackValue ?? 0;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })
          }
        </Await>
      </Suspense>
    </div>
  );
}

const taskStatusConfig = {
  "1": { icon: Play, iconColor: "text-blue-500", status: "进行中", statusClass: "bg-blue-50 text-blue-700" },
  "3": { icon: CheckCircle2, iconColor: "text-green-500", status: "已完成", statusClass: "bg-green-50 text-green-700" },
  "0": { icon: Clock, iconColor: "text-yellow-500", status: "计划中", statusClass: "bg-yellow-50 text-yellow-700" }
};

function RecentTasks({ recentTasksPromise }: { recentTasksPromise: Promise<any> }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex justify-between pb-2 border-b">
        <CardTitle className="text-lg font-semibold">最近任务</CardTitle>
        <Link to={SCAN_TASKS_ROUTE}>
          <Button size="sm" className="text-sm">
            查看全部
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-2">
        <Suspense fallback={
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1 animate-pulse" />
                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        }>
          <Await resolve={recentTasksPromise}>
            {(recentTasks) => {
              const tasks = recentTasks?.list?.map((task: any) => {
                const { icon, iconColor, status, statusClass } =
                  taskStatusConfig[task?.status as keyof typeof taskStatusConfig] ?? taskStatusConfig["0"];
                return {
                  icon,
                  iconColor,
                  title: task?.name,
                  subtitle: `任务数量: ${task?.taskNum}`,
                  status,
                  time: task?.creatTime,
                  statusClass
                };
              }) ?? [];

              return (
                <div className="space-y-2">
                  {tasks.map((task: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <task.icon className={`w-4 h-4 ${task.iconColor}`} />
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs text-gray-500">{task.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={task.statusClass}>
                          {task.status}
                        </Badge>
                        <p className="text-xs text-gray-500">{task.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </CardContent>
    </Card>
  );
}

function VersionInfo({ versionDataPromise }: { versionDataPromise: Promise<{ list: VersionData[] }> }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg font-semibold">系统版本</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <Suspense fallback={
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded mb-1 animate-pulse" />
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-5 bg-gray-200 rounded mb-1 animate-pulse" />
                  <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        }>
          <Await resolve={versionDataPromise}>
            {(versionData) => (
              <div className="space-y-2">
                {versionData.list?.map((version, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Server className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{version?.name}</p>
                        <p className="text-xs text-gray-500">当前版本: {version?.cversion}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={version?.cversion === version?.lversion ? "outline" : "secondary"}>
                        {version?.cversion === version?.lversion ? "最新版本" : `可更新至 ${version?.lversion}`}
                      </Badge>
                      {version?.msg && <p className="text-xs text-gray-500 mt-1">{version.msg}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </CardContent>
    </Card>
  );
}

const nodeMetrics = [
  { icon: Play, color: "text-green-500", label: "运行中", value: (node: NodeData) => node?.running },
  { icon: CheckCircle2, color: "text-blue-500", label: "已完成", value: (node: NodeData) => node?.finished }
];

function NodeStatusCard({ nodeDataPromise }: { nodeDataPromise: Promise<{ list: NodeData[] }> }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg font-semibold">节点状态</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <Suspense fallback={
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-4 h-4 text-green-500" />
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-12 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      {idx === 0 ? (
                        <Play className="w-3 h-3 text-green-500" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                      )}
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="mb-1">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center space-x-1">
                        {idx === 0 ? (
                          <Cpu className="w-3 h-3 text-yellow-500" />
                        ) : (
                          <MemoryStick className="w-3 h-3 text-purple-500" />
                        )}
                        <span className="text-xs">{idx === 0 ? "CPU" : "内存"}使用率</span>
                      </div>
                      <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${idx === 0 ? "bg-yellow-500" : "bg-purple-500"} rounded-full w-1/3`} />
                    </div>
                  </div>
                ))}
                <div className="w-32 h-3 bg-gray-200 rounded mt-1 animate-pulse" />
              </div>
            ))}
          </div>
        }>
          <Await resolve={nodeDataPromise}>
            {(nodeData) => (
              <div className="space-y-3">
                {nodeData.list?.map((node, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <HardDrive className={`w-4 h-4 ${node?.state === "1" ? "text-green-500" : "text-red-500"}`} />
                        <p className="text-sm font-medium">{node?.name}</p>
                      </div>
                      <Badge variant={node?.state === "1" ? "default" : "destructive"}>
                        {node?.state === "1" ? "在线" : "离线"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      {nodeMetrics.map(({ icon: Icon, color, label, value }, idx) => (
                        <div key={idx} className="flex items-center space-x-1">
                          <Icon className={`w-3 h-3 ${color}`} />
                          <p className="text-xs">
                            {label}: <span className="font-medium">{value(node)}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                    {["CPU", "内存"].map((type, idx) => (
                      <div key={idx} className="mb-1">
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center space-x-1">
                            {type === "CPU" ? (
                              <Cpu className="w-3 h-3 text-yellow-500" />
                            ) : (
                              <MemoryStick className="w-3 h-3 text-purple-500" />
                            )}
                            <span className="text-xs">{type}使用率</span>
                          </div>
                          <span className="text-xs font-medium">
                            {Number(node?.[type === "CPU" ? "cpuNum" : "memNum"])?.toFixed(2)}%
                          </span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              type === "CPU" ? "bg-yellow-500" : "bg-purple-500"
                            } rounded-full transition-all duration-300`}
                            style={{ width: `${Number(node?.[type === "CPU" ? "cpuNum" : "memNum"])}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-1">更新时间: {node?.updateTime}</p>
                  </div>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { assetStatsPromise, nodeDataPromise, recentTasksPromise, versionDataPromise } = useLoaderData<typeof loader>();
  // const revalidate = useRevalidator();
  
  // useEffect(() => {
  //   let cancelled = false;
  //   const chainRevalidate = async () => {
  //     if (cancelled) return;
  //     await revalidate.revalidate();
  //     setTimeout(chainRevalidate, 5000);
  //   };
  //   chainRevalidate();
  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  return (
    <>
      <Header className="border-b">
        <div className="flex justify-between w-full px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">概览</h1>
            <p className="text-sm text-gray-500">系统概览和最近活动</p>
          </div>
          <Link to={SCAN_TASK_CREATE_ROUTE}>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              新建扫描任务
            </Button>
          </Link>
        </div>
      </Header>

      <div className="px-4 py-4 space-y-4">
        <AssetStatistics assetStatsPromise={assetStatsPromise} />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <NodeStatusCard nodeDataPromise={nodeDataPromise} />
            <VersionInfo versionDataPromise={versionDataPromise} />
          </div>
          <RecentTasks recentTasksPromise={recentTasksPromise} />
        </div>
      </div>
    </>
  );
}
