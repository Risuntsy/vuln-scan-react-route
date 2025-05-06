import {
  Link,
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
  useSearchParams,
  type SetURLSearchParams
} from "react-router";
import {
  Globe,
  Network,
  Calendar,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader,
  BarChart,
  List
} from "lucide-react";
import { cn } from "#/lib";

import { getToken, r, getSearchParams } from "#/lib";
import { getAssetStatistics, getTaskDetail, getTaskProgress, type TaskDetail, type TaskProgessInfo } from "#/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  ScanTaskHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "#/components";
import { ASSET_ROUTE, SCAN_TASK_ASSETS_ROUTE, SCAN_TASK_STATISTICS_ROUTE } from "#/routes";

import { PortServiceList, ServiceTypeList, StatisticsList, ServiceIconGrid } from "#/components";
import { CustomPagination } from "#/components";
import { EmptyPlaceholder } from "#/components/custom/empty-placeholder";

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

const progressItems: { key: keyof TaskProgessInfo; label: string }[] = [
  { key: "TargetHandler", label: "目标处理" },
  { key: "SubdomainScan", label: "子域名扫描" },
  { key: "SubdomainSecurity", label: "子域名安全" },
  { key: "PortScanPreparation", label: "端口扫描准备" },
  { key: "PortScan", label: "端口扫描" },
  { key: "PortFingerprint", label: "端口指纹" },
  { key: "AssetMapping", label: "资产映射" },
  { key: "AssetHandle", label: "资产处理" },
  { key: "URLScan", label: "URL扫描" },
  { key: "WebCrawler", label: "Web爬虫" },
  { key: "URLSecurity", label: "URL安全" },
  { key: "DirScan", label: "目录扫描" },
  { key: "VulnerabilityScan", label: "漏洞扫描" }
] as const;

function getProgressStatus(times: string[]) {
  times = times.filter(time => time != "");
  if (times.length === 0) return "未开始";
  if (times.length === 2) return "已完成";
  return "进行中";
}

// Helper to get icon and style for progress status
function getProgressBadge(status: string): React.ReactNode {
  let IconComponent;
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let className = "";

  switch (status) {
    case "已完成":
      IconComponent = CheckCircle;
      variant = "default";
      className = "bg-green-100 text-green-700 border-green-200";
      break;
    case "进行中":
      IconComponent = Loader; // Use Loader icon for running
      variant = "secondary";
      className = "bg-blue-100 text-blue-700 border-blue-200 animate-pulse";
      break;
    case "未开始":
    default:
      IconComponent = XCircle;
      variant = "outline";
      className = "bg-gray-100 text-gray-500 border-gray-200";
      break;
  }

  return (
    <Badge variant={variant} className={cn("flex items-center gap-1", className)}>
      <IconComponent className="h-3 w-3" />
      <span>{status}</span>
    </Badge>
  );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const taskId = params.taskId;
  if (!taskId) {
    throw new Response("Task ID not found", { status: 404 });
  }

  const token = await getToken(request);
  const { pageIndex, pageSize } = getSearchParams(request, { pageIndex: 1, pageSize: 20 });

  try {
    const [taskDetail, assetStatistics, taskProgress] = await Promise.all([
      getTaskDetail({ id: taskId, token }),
      getAssetStatistics({
        search: "",
        pageIndex,
        pageSize,
        filter: {
          taskId
        },
        token
      }),
      getTaskProgress({
        id: taskId,
        pageIndex,
        pageSize,
        token
      })
    ]);
    if (!taskDetail) {
      return redirect("/404", {
        status: 404
      });
    }

    return {
      success: true,
      taskId,
      taskDetail,
      assetStatistics,
      taskProgressList: {
        list: taskProgress.list.sort((a, b) => a.target.localeCompare(b.target)),
        total: taskProgress.total
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message || "未知错误" };
  }
}

export default function TaskOverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = Number(searchParams.get("pageIndex")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const {
    taskId,
    taskDetail,
    assetStatistics,
    taskProgressList: { list: taskProgress, total: totalTaskProgress } = {},
    success,
    error
  } = useLoaderData<typeof loader>();

  if (!success || !taskDetail || !assetStatistics || !taskId) {
    return <div className="p-4 space-y-4">{error}</div>;
  }

  assetStatistics.Icon.forEach(item => {
    item.href = r(SCAN_TASK_ASSETS_ROUTE, { variables: { taskId } });
  });

  return (
    <div>
      <ScanTaskHeader taskId={taskId} taskDetail={taskDetail} routes={[{ name: "任务概览" }]}>
        <div className="flex gap-2">
          <Link to={r(SCAN_TASK_STATISTICS_ROUTE, { variables: { taskId } })}>
            <Button variant="outline">
              <BarChart className="w-4 h-4 mr-2" />
              统计信息
            </Button>
          </Link>
          <Link to={r(SCAN_TASK_ASSETS_ROUTE, { variables: { taskId } })}>
            <Button variant="default">所有资产</Button>
          </Link>
        </div>
      </ScanTaskHeader>

      <div className="p-2 space-y-2">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
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
          <CardHeader className="pb-3 sticky top-0 bg-background z-10">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>扫描进度</span>
                </div>
                <CustomPagination
                  total={totalTaskProgress || 0}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  setSearchParams={setSearchParams}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {taskProgress && taskProgress.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>扫描目标</TableHead>
                    <TableHead>节点</TableHead>
                    {progressItems.map(({ label }) => (
                      <TableHead key={label}>{label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskProgress.map((progress: TaskProgessInfo, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{progress.target}</TableCell>
                      <TableCell>{progress.node}</TableCell>
                      {progressItems.map(({ key }) => {
                        const times = progress[key] as string[];
                        const status = getProgressStatus(times);
                        return <TableCell key={key}>{getProgressBadge(status)}</TableCell>;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyPlaceholder
                icon={<List className="h-12 w-12 text-muted-foreground" />}
                title="没有扫描进度数据"
                description="此任务可能尚未开始或没有进度记录。"
              />
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <PortServiceList className="max-h-[32rem]" data={assetStatistics.Port} taskId={taskId} />
          <ServiceTypeList className="max-h-[32rem]" data={assetStatistics.Service} taskId={taskId} />
          <StatisticsList className="max-h-[32rem]" data={assetStatistics.Product} taskId={taskId} />
        </div>

        <ServiceIconGrid data={assetStatistics.Icon} taskId={taskId} />
      </div>
    </div>
  );
}
