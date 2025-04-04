import { Link, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Globe, Network, Calendar, Clock, FileText } from "lucide-react";

import { getToken, r } from "#/lib";
import { getAssetStatistics, getTaskDetail, type TaskDetail } from "#/api";
import { Card, CardContent, CardHeader, CardTitle, ScrollArea, Badge, Button, ScanTaskHeader } from "#/components";
import { SCAN_TASK_ASSETS_ROUTE } from "#/routes";

import { PortServiceList, ServiceTypeList, StatisticsList, ServiceIconGrid } from "#/components";

const overviewItems = [
  {
    title: "扫描模板",
    value: "template",
    icon: FileText,
    description: "使用的扫描模板",
    format: (detail: TaskDetail) => detail.template
  },
  {
    title: "扫描节点",
    value: "node",
    icon: Network,
    description: "执行节点数量",
    format: (detail: TaskDetail) => (detail.allNode ? "所有节点" : String(detail.node?.length || 0))
  },
  {
    title: "定时任务",
    value: "scheduledTasks",
    icon: Calendar,
    description: "是否为定时任务",
    format: (detail: TaskDetail) => (detail.scheduledTasks ? "是" : "否")
  },
  {
    title: "执行时间",
    value: "hour",
    icon: Clock,
    description: "定时执行时间（小时）",
    format: (detail: TaskDetail) => (detail.scheduledTasks ? `${detail.hour}:00` : "-")
  }
] as const;

export async function loader({ params, request }: LoaderFunctionArgs) {
  const taskId = params.taskId;
  if (!taskId) {
    throw new Response("Task ID not found", { status: 404 });
  }

  const token = await getToken(request);

  try {
    const [taskDetail, assetStatistics] = await Promise.all([
      getTaskDetail({ id: taskId, token }),
      getAssetStatistics({
        search: "",
        pageIndex: 1,
        pageSize: 20,
        filter: {
          taskId
        },
        token
      })
    ]);
    if (!taskDetail) {
      return redirect("/404", {
        status: 404
      });
    }

    return { success: true, taskId, taskDetail, assetStatistics };
  } catch (error: any) {
    return { success: false, error: error.message || "未知错误" };
  }
}

export default function TaskOverviewPage() {
  const { taskId, taskDetail, assetStatistics, success, error } = useLoaderData<typeof loader>();

  if (!success || !taskDetail || !assetStatistics || !taskId) {
    return <div className="p-4 space-y-4">{error}</div>;
  }

  return (
    <>
      <ScanTaskHeader taskId={taskId} taskDetail={taskDetail} routes={[{ name: "任务概览" }]}>
        <Link to={r(SCAN_TASK_ASSETS_ROUTE, { variables: { taskId } })}>
          <Button variant="default">所有资产</Button>
        </Link>
      </ScanTaskHeader>

      <div className="p-4 space-y-4">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {overviewItems.map(({ title, icon: Icon, description, format }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">{format(taskDetail)}</div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Globe className="h-4 w-4 text-muted-foreground" />
              扫描目标
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[160px] w-full rounded-md border p-3 bg-muted/30">
              <div className="flex flex-wrap gap-2">
                {taskDetail.target.split("\n").map((target: string, index: number) => (
                  <Badge key={index} variant="secondary" className="px-2 py-0.5 text-sm font-mono">
                    {target.trim()}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <PortServiceList className="max-h-[32rem]" data={assetStatistics.Port} />
          <ServiceTypeList className="max-h-[32rem]" data={assetStatistics.Service} />
          <StatisticsList className="max-h-[32rem]" data={assetStatistics.Product} />
        </div>

        <ServiceIconGrid data={assetStatistics.Icon} />
      </div>
    </>
  );
}
