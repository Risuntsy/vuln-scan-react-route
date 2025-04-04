import {
  Link,
  useLoaderData,
  useSearchParams,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useSubmit,
  redirect
} from "react-router";
import { deleteTask, getTaskData, retestTask, startTask, stopTask, type TaskData, type TaskDetail } from "#/api";
import {
  Input,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Header
} from "#/components";
import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  type LucideIcon,
  MoreHorizontal,
  Pencil,
  Play,
  RefreshCw,
  Search,
  StopCircle,
  Trash2,
  XCircle,
  Plus
} from "lucide-react";
import {
  DASHBOARD_ROUTE,
  SCAN_TASKS_ROUTE,
  SCAN_TASK_CREATE_ROUTE,
  SCAN_TASK_EDIT_ROUTE,
  SCAN_TASK_REPORT_ROUTE,
  SCAN_TASK_ROUTE
} from "#/routes";
import { getToken, r } from "#/lib";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const token = await getToken(request);

  const search = params.search || "";
  const pageIndex = parseInt(params.pageIndex || "1");
  const pageSize = parseInt(params.pageSize || "10");

  const { list, total } = await getTaskData({
    search,
    pageIndex,
    pageSize,
    token
  });

  return { success: true, tasks: list, total, pageIndex, pageSize };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const [token, { _action, taskId }] = await Promise.all([getToken(request), request.json()]);

  try {
    switch (_action) {
      case "start":
        await startTask({ id: taskId, token });
        return { success: true, message: "Task started" };
      case "stop":
        await stopTask({ id: taskId, token });
        return { success: true, message: "Task stopped" };
      case "rescan":
        await retestTask({ id: taskId, token });
        return { success: true, message: "Task rescan initiated" };
      case "delete":
        await deleteTask({ ids: [taskId], delA: false, token });
        return redirect(SCAN_TASKS_ROUTE);
      default:
        return { success: false, message: "Invalid action" };
    }
  } catch (error: any) {
    console.error(`Action ${_action} failed:`, error);
    return { success: false, message: error?.message || "Action failed" };
  }
};

const PAGE_SIZES = [10, 20, 50, 100];

const FILTER_OPTIONS = [
  { value: "all", label: "全部任务" },
  { value: "in-progress", label: "进行中" },
  { value: "completed", label: "已完成" },
  { value: "pending", label: "等待中" },
  { value: "failed", label: "失败" }
];

type TaskStatus = "completed" | "in-progress" | "pending" | "failed";

const TASK_ACTIONS: {
  key: string;
  icon: LucideIcon;
  title: string;
  showWhen?: (status: TaskStatus) => boolean;
  action?: "delete" | "stop" | "start" | "rescan";
  route?: (id: string) => string;
  isDestructive?: boolean;
}[] = [
  {
    key: "stop",
    icon: StopCircle,
    title: "停止",
    showWhen: (status: TaskStatus) => status === "in-progress",
    action: "stop"
  },
  {
    key: "start",
    icon: Play,
    title: "开始",
    showWhen: (status: TaskStatus) => status === "pending" || status === "failed",
    action: "start"
  },
  {
    key: "rescan",
    icon: RefreshCw,
    title: "重新扫描",
    showWhen: (status: TaskStatus) => status === "completed",
    action: "rescan"
  },
  {
    key: "edit",
    icon: Pencil,
    title: "编辑",
    route: (id: string) => r(SCAN_TASK_EDIT_ROUTE, { variables: { taskId: id } })
  },
  {
    key: "view",
    icon: Eye,
    title: "查看详情",
    route: (id: string) => r(SCAN_TASK_ROUTE, { variables: { taskId: id } })
  },
  {
    key: "report",
    icon: FileText,
    title: "导出报告",
    route: (id: string) => r(SCAN_TASK_REPORT_ROUTE, { variables: { taskId: id } })
  },
  {
    key: "delete",
    icon: Trash2,
    title: "删除任务",
    action: "delete",
    isDestructive: true
  }
];

const STATUS_BADGES: Record<
  TaskStatus,
  {
    icon: LucideIcon;
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
    animate?: boolean;
  }
> = {
  completed: { icon: CheckCircle, label: "已完成", variant: "default" },
  "in-progress": {
    icon: RefreshCw,
    label: "进行中",
    variant: "default",
    className: "bg-blue-400 hover:bg-blue-500",
    animate: true
  },
  pending: { icon: Clock, label: "等待中", variant: "outline" },
  failed: { icon: XCircle, label: "失败", variant: "destructive" }
};

function getStatusFromProgress(progress: string): TaskStatus {
  const p = parseInt(progress);
  if (isNaN(p)) return "failed";
  if (p === 100) return "completed";
  if (p === 0) return "pending";
  if (p > 0 && p < 100) return "in-progress";
  return "failed";
}

function TaskCard({
  task,
  statusKey,
  statusInfo
}: {
  task: TaskData;
  statusKey: TaskStatus;
  statusInfo: (typeof STATUS_BADGES)[TaskStatus];
}) {
  const submit = useSubmit();

  return (
    <Card key={task.id} className={`overflow-hidden border hover:shadow-md transition-shadow`}>
      {/* Progress Bar */}
      <div
        className={`h-1.5 ${
          statusKey === "in-progress"
            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x bg-[length:400%_100%]"
            : statusKey === "completed"
            ? "bg-primary"
            : statusKey === "pending"
            ? "bg-yellow-500"
            : "bg-destructive"
        }`}
      />

      <CardContent className="p-4">
        {/* Header: Name and Actions Menu */}
        <div className="flex justify-between items-start mb-3">
          <Link
            to={r(SCAN_TASK_ROUTE, { variables: { taskId: task.id } })}
            className="text-primary font-medium truncate max-w-[150px]"
            title={task.name}
          >
            {task.name}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {TASK_ACTIONS.map(({ key, title, icon: Icon, showWhen, action, route, isDestructive }) => {
                if (showWhen && !showWhen(statusKey)) {
                  return null;
                }

                const itemContent = (
                  <>
                    <Icon className="w-4 h-4 mr-2" />
                    {title}
                  </>
                );

                if (action) {
                  return (
                    <DropdownMenuItem
                      key={key}
                      className={isDestructive ? "text-destructive cursor-pointer" : "cursor-pointer"}
                      onClick={() =>
                        submit({ _action: action, taskId: task.id }, { method: "post", encType: "application/json" })
                      }
                    >
                      {itemContent}
                    </DropdownMenuItem>
                  );
                }

                if (route) {
                  return (
                    <DropdownMenuItem key={key} asChild>
                      <Link to={route(task.id)}>{itemContent}</Link>
                    </DropdownMenuItem>
                  );
                }

                return null;
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Task Number */}
        <div className="mb-3">
          <div className="text-sm text-muted-foreground mb-1">任务编号</div>
          <div className="font-medium truncate" title={task.taskNum}>
            {task.taskNum}
          </div>
        </div>

        {/* Status and Create Time */}
        <div className="flex flex-col sm:flex-row justify-between mb-3 gap-2">
          <div>
            <div className="text-sm text-muted-foreground mb-1">状态 ({task.progress}%)</div>
            <Badge variant={statusInfo.variant} className={statusInfo.className}>
              <div className="flex items-center">
                <div className={statusInfo.animate ? "animate-spin mr-1" : "mr-1"}>
                  <statusInfo.icon className="w-3 h-3" />
                </div>
                <span>{statusInfo.label}</span>
              </div>
            </Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">创建时间</div>
            <div className="text-sm">
              {task.creatTime} {/* Consider formatting date */}
            </div>
          </div>
        </div>

        {/* Domain/IP/Web Stats - Placeholder */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* ... (keep placeholder content) ... */}
          <div className="bg-muted rounded-md p-2 text-center">
            <div className="text-xs text-muted-foreground">域名</div>
            <div className="font-medium">-</div>
          </div>
          <div className="bg-muted rounded-md p-2 text-center">
            <div className="text-xs text-muted-foreground">IP</div>
            <div className="font-medium">-</div>
          </div>
          <div className="bg-muted rounded-md p-2 text-center">
            <div className="text-xs text-muted-foreground">Web</div>
            <div className="font-medium">-</div>
          </div>
        </div>

        {/* Vulnerabilities - Placeholder */}
        <div>
          <div className="text-sm text-muted-foreground mb-1">漏洞</div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-muted-foreground">暂无数据</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function ScanTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const submit = useSubmit();
  const { tasks, total, pageIndex, pageSize } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-2 max-w-screen h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "扫描任务" }]}>
        <div className="flex items-center gap-2 justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">扫描任务</h1>
            <p className="text-muted-foreground text-sm">管理所有扫描任务</p>
          </div>
          <Link to={SCAN_TASK_CREATE_ROUTE}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新建扫描任务
            </Button>
          </Link>
        </div>
      </Header>

      <Card className="h-full">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 border-b pb-2">
            {/* Search */}

            <div className="relative w-full sm:w-auto max-w-[250px] flex items-center justify-center gap-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="搜索任务..."
                className="pl-8"
                defaultValue={searchParams.get("search") || ""}
              />
              <Button
                onClick={() =>
                  setSearchParams(prev => {
                    prev.set("search", "test");
                    return prev;
                  })
                }
                size="sm"
              >
                搜索
              </Button>
            </div>

            {/* Filter */}
            <Select
              defaultValue={searchParams.get("filter") || "all"}
              onValueChange={value =>
                setSearchParams(prev => {
                  prev.set("filter", value);
                  return prev;
                })
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="筛选" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap items-center gap-2">
              {/* Size Selector */}
              <div className="flex items-center gap-1">
                <Select
                  defaultValue={pageSize.toString()}
                  onValueChange={value =>
                    setSearchParams(prev => {
                      prev.set("pageSize", value);
                      prev.set("pageIndex", "1");
                      return prev;
                    })
                  }
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="每页行数" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZES.map(s => (
                      <SelectItem key={s} value={s.toString()}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Download Button - Functionality needs implementation */}
                <Button variant="outline" size="icon" className="ml-1">
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-1 sm:ml-2 sm:border-l sm:pl-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSearchParams(prev => {
                      prev.set("pageIndex", (pageIndex - 1).toString());
                      return prev;
                    })
                  }
                  disabled={pageIndex <= 1}
                >
                  上一页
                </Button>
                <span className="text-xs whitespace-nowrap">
                  第 {pageIndex} 页，共 {Math.ceil(total / pageSize)} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSearchParams(prev => {
                      prev.set("pageIndex", (pageIndex + 1).toString());
                      return prev;
                    })
                  }
                  disabled={pageIndex >= Math.ceil(total / pageSize)}
                >
                  下一页
                </Button>
              </div>
            </div>
          </div>

          {/* Task Grid */}
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  statusKey={getStatusFromProgress(task.progress)}
                  statusInfo={STATUS_BADGES[getStatusFromProgress(task.progress)]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">没有找到匹配的任务。</div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sticky bottom-0 bg-background py-3 border-t">
            <div className="text-sm text-muted-foreground">
              显示 {tasks.length > 0 ? (pageIndex - 1) * pageSize + 1 : 0}-{(pageIndex - 1) * pageSize + tasks.length} 共 {total} 条记录
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
