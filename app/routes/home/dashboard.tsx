import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Header } from "#/components";
import { CheckCircle2, Clock, Play, Plus, RefreshCw, Server, HardDrive, Cpu, MemoryStick } from "lucide-react";
import { SCAN_TASK_CREATE_ROUTE, SCAN_TASKS_ROUTE } from "#/routes";
import { getNodeData, getOverallAssetStatistics, getTaskData, getVersionData } from "#/api";
import { getToken } from "#/lib";
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { VersionData, NodeData } from "#/api";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);

  const [assetStats, taskData, nodeData, versionData] = await Promise.all([
    getOverallAssetStatistics({ token }),
    getTaskData({ pageSize: 5, token }),
    getNodeData({ token }),
    getVersionData({ token })
  ]);

  const runningTasks = nodeData.list.reduce((acc: number, node: { running: number }) => acc + node.running, 0);

  const recentTasks = await getTaskData({ pageSize: 3, token });

  return {
    assetStats,
    taskData,
    nodeData,
    runningTasks,
    recentTasks,
    versionData
  };
}

function OverviewCards({
  assetStats,
  taskData,
  runningTasks
}: {
  assetStats: any;
  taskData: any;
  runningTasks: number;
}) {
  const cards = [
    {
      title: "总扫描任务",
      value: taskData.total,
      footer: (
        <p className="text-xs text-muted-foreground">
          进行中 <span className="text-green-500">{runningTasks}</span>
        </p>
      )
    },
    {
      title: "已发现漏洞",
      value: assetStats.vulnerabilityCount,
      footer: (
        <div className="flex items-center text-xs text-muted-foreground">
          <Badge variant="destructive" className="mr-1">
            高危 24
          </Badge>
          <Badge className="mr-1 text-white bg-yellow-500 hover:bg-yellow-400">中危 78</Badge>
          <Badge variant="outline">低危 254</Badge>
        </div>
      )
    },
    {
      title: "已发现资产",
      value: assetStats.asetCount,
      footer: (
        <div className="flex items-center text-xs text-muted-foreground">
          <span className="mr-2">域名: {assetStats.subdomainCount}</span>
          <span className="mr-2">敏感: {assetStats.sensitiveCount}</span>
          <span>URL: {assetStats.urlCount}</span>
        </div>
      )
    },
    {
      title: "活跃扫描",
      value: runningTasks,
      footer: (
        <div className="flex items-center text-xs text-muted-foreground">
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
          <span>正在进行中</span>
        </div>
      )
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.footer}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentTasks({ recentTasks }: { recentTasks: any }) {
  const { list } = recentTasks;

  const taskStatusMap: Record<
    string,
    {
      icon: typeof Play | typeof CheckCircle2 | typeof Clock;
      iconColor: string;
      status: string;
      statusClass?: string;
    }
  > = {
    running: { icon: Play, iconColor: "text-green-500", status: "进行中" },
    completed: { icon: CheckCircle2, iconColor: "text-green-500", status: "已完成", statusClass: "bg-green-50" },
    pending: { icon: Clock, iconColor: "text-yellow-500", status: "计划中" }
  };

  const tasks = list.map((task: any) => {
    const status = task.progress === "100" ? "completed" : task.progress === "0" ? "pending" : "running";
    const statusConfig = taskStatusMap[status];

    return {
      icon: statusConfig.icon,
      iconColor: statusConfig.iconColor,
      title: task.name,
      subtitle: `任务编号: ${task.taskNum}`,
      status: statusConfig.status,
      time: task.creatTime,
      statusClass: statusConfig.statusClass
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">最近任务</CardTitle>
        <Link to={SCAN_TASKS_ROUTE}>
          <Button size="sm">
            全部任务
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <task.icon className={`w-4 h-4 mr-2 ${task.iconColor}`} />
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className={`mr-2 ${task.statusClass || ""}`}>
                  {task.status}
                </Badge>
                <p className="text-xs text-muted-foreground">{task.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function VersionInfo({ versionData }: { versionData: { list: VersionData[] } }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">系统版本</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versionData.list.map((version, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="w-4 h-4 mr-2 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{version.name}</p>
                  <p className="text-xs text-muted-foreground">当前版本: {version.cversion}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant={version.cversion === version.lversion ? "outline" : "secondary"} className="mb-1">
                  {version.cversion === version.lversion ? "最新版本" : `可更新至 ${version.lversion}`}
                </Badge>
                {version.msg && <p className="text-xs text-muted-foreground">{version.msg}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
function NodeStatusCard({ nodeData }: { nodeData: { list: NodeData[] } }) {
  const nodeMetrics = [
    {
      icon: Play,
      color: "text-green-500",
      label: "运行中",
      value: (node: NodeData) => node.running
    },
    {
      icon: CheckCircle2,
      color: "text-blue-500",
      label: "已完成",
      value: (node: NodeData) => node.finished
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">节点状态</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nodeData.list.map((node, index) => (
            <div key={index} className="flex flex-col border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <HardDrive className={`w-4 h-4 mr-2 ${node.state === 1 ? "text-green-500" : "text-red-500"}`} />
                  <p className="text-sm font-medium">{node.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {nodeMetrics.map((metric, idx) => {
                  const Icon = metric.icon;
                  const value = metric.value(node);
                  return (
                    <div key={idx} className="flex items-center">
                      <Icon className={`w-3 h-3 mr-1 ${metric.color}`} />
                      <p className="text-xs">
                        {metric.label}: {value}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="text-sm">CPU 使用率</span>
                    </div>
                    <span className="text-sm font-medium">{Number(node.cpuNum).toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${Number(node.cpuNum)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <MemoryStick className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm">内存使用率</span>
                    </div>
                    <span className="text-sm font-medium">{Number(node.memNum).toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${Number(node.memNum)}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">更新时间: {node.updateTime}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { assetStats, taskData, nodeData, runningTasks, recentTasks, versionData } = useLoaderData<typeof loader>();

  return (
    <>
      <Header>
        <div className="flex items-center gap-2 justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold">仪表盘</h1>
            <p className="text-muted-foreground text-sm">系统概览和最近活动</p>
          </div>
          <Link to={SCAN_TASK_CREATE_ROUTE}>
            <Button className="hover:cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              新建扫描任务
            </Button>
          </Link>
        </div>
      </Header>

      <div className="p-6 space-y-6">
        <OverviewCards assetStats={assetStats} taskData={taskData} runningTasks={runningTasks} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <NodeStatusCard nodeData={nodeData} />
            <VersionInfo versionData={versionData} />
          </div>

          <div className="space-y-6">
            <RecentTasks recentTasks={recentTasks} />
          </div>
        </div>
      </div>
    </>
  );
}
