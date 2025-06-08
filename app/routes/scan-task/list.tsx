import {
  Link,
  useLoaderData,
  useSearchParams,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useFetcher,
  Form
} from "react-router";
import { deleteTask, getTaskData, retestTask, startTask, stopTask } from "#/api";
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Header,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  errorToast,
  successToast,
  CustomTooltip,
  Checkbox
} from "#/components";
import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  MoreHorizontal,
  Play,
  RefreshCw,
  Search,
  StopCircle,
  Trash2,
  XCircle,
  Plus,
  Pause,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { DASHBOARD_ROUTE, SCAN_TASK_CREATE_ROUTE, SCAN_TASK_REPORT_ROUTE, SCAN_TASK_ROUTE } from "#/routes";
import { cn, getSearchParams, getToken, r } from "#/lib";
import { useEffect, useState } from "react";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  const { search, pageIndex, pageSize } = getSearchParams(request, {
    search: "",
    pageIndex: 1,
    pageSize: 10
  });
  const { list, total } = await getTaskData({ search, pageIndex, pageSize, token });
  return { success: true, tasks: list, total, pageIndex, pageSize };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const [token, { _action, ...data }] = await Promise.all([getToken(request), request.json()]);
  try {
    switch (_action) {
      case "start":
        return { success: true, message: "Task started", data: await startTask({ ...data, token }) };
      case "stop":
        return { success: true, message: "Task stopped", data: await stopTask({ ...data, token }) };
      case "rescan":
        return { success: true, message: "Task rescan initiated", data: await retestTask({ ...data, token }) };
      case "delete":
        return { success: true, message: "Task deleted", data: await deleteTask({ ...data, token }) };
      default:
        return { success: false, message: "Invalid action" };
    }
  } catch (error: any) {
    return { success: false, message: error?.message || "Action failed" };
  }
};

const PAGE_SIZES = [10, 20, 50, 100];
type TaskStatus = "completed" | "in-progress" | "pending" | "failed" | "paused";

type TaskAction = {
  key: string;
  icon: React.ComponentType<any>;
  title: string;
  showWhen?: (status: TaskStatus) => boolean;
  action?: string;
  route?: (id: string) => string;
  needConfirm?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  isDestructive?: boolean;
  onConfirm?: () => Promise<void>;
};

const TASK_ACTIONS: TaskAction[] = [
  {
    key: "stop",
    icon: StopCircle,
    title: "暂停",
    showWhen: (status: TaskStatus) => status === "in-progress",
    action: "stop",
    needConfirm: true,
    confirmTitle: "确认暂停任务",
    confirmDescription: "暂停任务后，正在进行的扫描将立即终止。此操作不可撤销。"
  },
  {
    key: "start",
    icon: Play,
    title: "开始",
    showWhen: (status: TaskStatus) => status === "pending" || status === "failed" || status === "paused",
    action: "start",
    needConfirm: true,
    confirmTitle: "确认开始任务",
    confirmDescription: "确定开始任务?"
  },
  {
    key: "rescan",
    icon: RefreshCw,
    title: "重新扫描",
    showWhen: (status: TaskStatus) => status === "completed",
    action: "rescan",
    needConfirm: true,
    confirmTitle: "确认重新扫描",
    confirmDescription: "重新扫描将覆盖之前的扫描结果。此操作不可撤销。"
  },
  {
    key: "view",
    icon: Eye,
    title: "查看详情",
    route: (id: string) => r(SCAN_TASK_ROUTE, { variables: { taskId: id } })
  },
  // {
  //   key: "report",
  //   icon: FileText,
  //   title: "导出报告",
  //   route: (id: string) => r(SCAN_TASK_REPORT_ROUTE, { variables: { taskId: id } })
  // },
  {
    key: "delete",
    icon: Trash2,
    title: "删除任务",
    action: "delete",
    isDestructive: true,
    needConfirm: true,
    confirmTitle: "确认删除任务",
    confirmDescription: "删除任务后，相关的扫描结果和报告都将被永久删除。此操作不可撤销。"
  }
];

const STATUS_BADGES: Record<
  TaskStatus,
  {
    icon: any;
    label: string;
    variant: "default" | "outline" | "destructive";
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
  failed: { icon: XCircle, label: "失败", variant: "destructive" },
  paused: { icon: Pause, label: "暂停", variant: "outline", className: "bg-yellow-400 hover:bg-yellow-500" }
};

const getStatus = (progress: string, status: number): TaskStatus => {
  if (status != null) {
    if (status === 2) {
      return "paused";
    } else if (status === 3) {
      return "completed";
    }
  }

  const p = parseInt(progress);
  if (isNaN(p)) return "failed";
  if (p === 100) return "completed";
  if (p >= 0 && p < 100) return "in-progress";
  return "failed";
};

export default function ScanTasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, total, pageIndex, pageSize } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBatchDeleteDialog, setShowBatchDeleteDialog] = useState(false);

  const [taskActionDialogData, setTaskActionDialogData] = useState<
    TaskAction & { show: boolean; onConfirm: () => Promise<void> }
  >({
    key: "",
    icon: () => null,
    title: "",
    showWhen: () => false,
    action: "",
    route: () => "",
    needConfirm: false,
    show: false,
    onConfirm: () => Promise.resolve()
  });

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        successToast(fetcher.data?.message || "操作成功");
        // 清空选中的任务
        setSelectedTasks([]);
      } else {
        errorToast(fetcher.data?.message || "操作失败");
      }
    }
  }, [fetcher.data]);

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(tasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleBatchDelete = async () => {
    await fetcher.submit(
      { _action: "delete", ids: selectedTasks },
      { method: "post", encType: "application/json" }
    );
    setShowBatchDeleteDialog(false);
  };

  return (
    <>
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "扫描任务" }]}>
        <div className="flex items-center gap-2 justify-between w-full">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">扫描任务</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">管理所有扫描任务</p>
          </div>
          <Link to={SCAN_TASK_CREATE_ROUTE}>
            <Button size="sm" className="h-8 px-3">
              <Plus className="w-4 h-4 mr-1" />
              新建
            </Button>
          </Link>
        </div>
      </Header>

      <div className="h-full p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 border-b pb-2">
          <div className="relative w-full sm:w-auto max-w-[200px]">
            <Form role="search" method="get">
              <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="搜索任务..."
                className="pl-7 h-8 text-sm"
                onChange={e => {
                  if (e.target.value === "") {
                    setSearchParams(prev => {
                      prev.delete("search");
                      return prev;
                    });
                  }
                }}
                defaultValue={searchParams.get("search") || ""}
              />
            </Form>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground whitespace-nowrap">每页:</span>
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
                <SelectTrigger className="w-[72px] h-8 text-xs">
                  <SelectValue placeholder="行数" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map(s => (
                    <SelectItem key={s} value={s.toString()} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 sm:border-l sm:pl-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  setSearchParams(prev => {
                    prev.set("pageIndex", (pageIndex - 1).toString());
                    return prev;
                  })
                }
                disabled={pageIndex <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {pageIndex}/{Math.ceil(total / pageSize)}页
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  setSearchParams(prev => {
                    prev.set("pageIndex", (pageIndex + 1).toString());
                    return prev;
                  })
                }
                disabled={pageIndex >= Math.ceil(total / pageSize)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 批量操作栏 */}
        {tasks.length > 0 && (
          <div className="flex items-center justify-between gap-2 mb-2 p-2 bg-muted/40 rounded">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedTasks.length === tasks.length}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-xs text-muted-foreground">
                {selectedTasks.length > 0 ? `已选 ${selectedTasks.length}` : "全选"}
              </span>
            </div>
            {selectedTasks.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setShowBatchDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                删除({selectedTasks.length})
              </Button>
            )}
          </div>
        )}

        {tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm border rounded-lg bg-background">
              <thead>
                <tr className="bg-muted/60">
                  <th className="p-2 text-left w-8">
                    <Checkbox
                      checked={selectedTasks.length === tasks.length}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </th>
                  <th className="p-2 text-left">任务名称</th>
                  <th className="p-2 text-center">数量</th>
                  <th className="p-2 text-center">状态</th>
                  <th className="p-2 text-center">进度</th>
                  <th className="p-2 text-center">创建时间</th>
                  <th className="p-2 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const statusKey = getStatus(task.progress, task.status);
                  const statusInfo = STATUS_BADGES[statusKey];
                  const isSelected = selectedTasks.includes(task.id);

                  const handleAction = async (action: string) => {
                    if (action === "rescan") {
                      return await fetcher.submit(
                        { _action: action, id: task.id },
                        { method: "post", encType: "application/json" }
                      );
                    } else {
                      return await fetcher.submit(
                        { _action: action, ids: [task.id] },
                        { method: "post", encType: "application/json" }
                      );
                    }
                  };

                  return (
                    <tr
                      key={task.id}
                      className={cn(
                        "border-b hover:bg-muted/30 transition-all",
                        isSelected && "bg-primary/10"
                      )}
                    >
                      <td className="p-2 text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </td>
                      <td className="p-2 max-w-[140px] truncate">
                        <Link
                          to={r(SCAN_TASK_ROUTE, { variables: { taskId: task.id } })}
                          className="text-primary font-medium truncate"
                          title={task.name}
                        >
                          {task.name}
                        </Link>
                      </td>
                      <td className="p-2 text-center">{task.taskNum}</td>
                      <td className="p-2 text-center">
                        <Badge variant={statusInfo.variant} className={cn("px-2 py-0.5", statusInfo.className)}>
                          <statusInfo.icon className={`w-3 h-3 mr-1 ${statusInfo.animate ? "animate-spin" : ""}`} />
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="p-2 text-center">{task.progress}%</td>
                      <td className="p-2 text-center">{task.creatTime}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {TASK_ACTIONS.map(taskAction => {
                            const {
                              key,
                              title,
                              icon: Icon,
                              showWhen,
                              action,
                              route,
                              isDestructive,
                              needConfirm
                            } = taskAction;

                            if (showWhen && !showWhen(statusKey)) return null;

                            if (needConfirm && action) {
                              return (
                                <CustomTooltip key={key} description={title}>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-6 w-6", isDestructive && "text-destructive hover:text-destructive")}
                                    onClick={() =>
                                      setTaskActionDialogData({
                                        ...taskAction,
                                        show: true,
                                        onConfirm: handleAction.bind(null, action)
                                      })
                                    }
                                  >
                                    <Icon className="w-4 h-4" />
                                  </Button>
                                </CustomTooltip>
                              );
                            }

                            if (route) {
                              return (
                                <CustomTooltip key={key} description={title}>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                    <Link to={route(task.id)}>
                                      <Icon className="w-4 h-4" />
                                    </Link>
                                  </Button>
                                </CustomTooltip>
                              );
                            }

                            return null;
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 单个任务操作确认对话框 */}
            <AlertDialog open={taskActionDialogData.show}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{taskActionDialogData.confirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>{taskActionDialogData.confirmDescription}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setTaskActionDialogData({ ...taskActionDialogData, show: false })}>
                    取消
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className={cn(taskActionDialogData.isDestructive && "bg-destructive hover:bg-destructive/90")}
                    onClick={async () => {
                      await taskActionDialogData.onConfirm?.();
                      setTaskActionDialogData({ ...taskActionDialogData, show: false });
                    }}
                  >
                    确认
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* 批量删除确认对话框 */}
            <AlertDialog open={showBatchDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认批量删除任务</AlertDialogTitle>
                  <AlertDialogDescription>
                    您即将删除 {selectedTasks.length} 个任务。删除后，相关的扫描结果和报告都将被永久删除。此操作不可撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowBatchDeleteDialog(false)}>
                    取消
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleBatchDelete}
                  >
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm">没有找到匹配的任务。</div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sticky bottom-0 bg-background py-2 border-t">
          <div className="text-xs text-muted-foreground">
            显示 {tasks.length > 0 ? (pageIndex - 1) * pageSize + 1 : 0}-{(pageIndex - 1) * pageSize + tasks.length} 共{" "}
            {total} 条记录
          </div>
        </div>
      </div>
    </>
  );
}
