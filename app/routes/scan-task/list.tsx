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
  Card,
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

      <div className="h-full p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b pb-4">
          <div className="relative w-full sm:w-auto max-w-[250px]">
            <Form role="search" method="get">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="搜索任务..."
                className="pl-8"
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">每页显示:</span>
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
                <SelectTrigger className="w-[70px] h-9">
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
            </div>
            <div className="flex items-center gap-2 sm:border-l sm:pl-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
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
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {pageIndex}/{Math.ceil(total / pageSize)}页
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
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
          <div className="flex items-center justify-between gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedTasks.length === tasks.length}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm text-muted-foreground">
                {selectedTasks.length > 0 ? `已选择 ${selectedTasks.length} 个任务` : "全选"}
              </span>
            </div>
            {selectedTasks.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBatchDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                批量删除 ({selectedTasks.length})
              </Button>
            )}
          </div>
        )}

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                <Card 
                  key={task.id} 
                  className={cn(
                    "overflow-hidden border hover:shadow-md transition-all",
                    isSelected && "ring-2 ring-primary"
                  )}
                >
                  <div
                    className={`h-1.5 ${
                      statusKey === "in-progress"
                        ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x bg-[length:400%_100%]"
                        : statusKey === "completed"
                        ? "bg-primary"
                        : statusKey === "pending"
                        ? "bg-yellow-500"
                        : statusKey === "paused"
                        ? "bg-yellow-500"
                        : "bg-destructive"
                    }`}
                  />
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 flex-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Link
                          to={r(SCAN_TASK_ROUTE, { variables: { taskId: task.id } })}
                          className="text-primary font-medium truncate max-w-[120px]"
                          title={task.name}
                        >
                          {task.name}
                        </Link>
                      </div>

                      {/* 大屏幕显示操作按钮组 */}
                      <div className="hidden md:flex space-x-1">
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
                                  className={cn("h-7 w-7", isDestructive && "text-destructive hover:text-destructive")}
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
                                <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
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

                      {/* 小屏幕显示下拉菜单 */}
                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
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

                              const itemContent = (
                                <span className="flex items-center">
                                  <Icon className={cn(isDestructive && "text-destructive", "w-4 h-4 mr-2")} />
                                  <span>{title}</span>
                                </span>
                              );

                              if (needConfirm && action) {
                                return (
                                  <DropdownMenuItem
                                    key={key}
                                    className={cn(
                                      "flex items-center cursor-pointer",
                                      isDestructive && "text-destructive hover:text-destructive"
                                    )}
                                    onClick={() =>
                                      setTaskActionDialogData({
                                        ...taskAction,
                                        show: true,
                                        onConfirm: handleAction.bind(null, action)
                                      })
                                    }
                                  >
                                    {itemContent}
                                  </DropdownMenuItem>
                                );
                              }

                              if (action) {
                                throw new Error("Action not implemented");
                              }

                              if (route) {
                                return (
                                  <DropdownMenuItem
                                    key={key}
                                    className={cn(
                                      "flex items-center cursor-pointer",
                                      isDestructive && "text-destructive"
                                    )}
                                  >
                                    <Link to={route(task.id)} className="block">
                                      {itemContent}
                                    </Link>
                                  </DropdownMenuItem>
                                );
                              }

                              return null;
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">任务编号</div>
                      <p className="font-medium truncate" title={task.taskNum}>
                        {task.taskNum}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <div className="text-sm text-muted-foreground">状态 ({task.progress}%)</div>
                        <Badge variant={statusInfo.variant} className={statusInfo.className}>
                          <statusInfo.icon className={`w-3 h-3 mr-1 ${statusInfo.animate ? "animate-spin" : ""}`} />
                          <span>{statusInfo.label}</span>
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">创建时间</div>
                        <p className="text-sm">{task.creatTime}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {["域名", "IP", "Web"].map(label => (
                        <div key={label} className="bg-muted p-2 text-center rounded-md">
                          <div className="text-xs text-muted-foreground">{label}</div>
                          <div className="font-medium">-</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">漏洞</div>
                      <p className="text-xs text-muted-foreground">暂无数据</p>
                    </div>
                  </div>
                </Card>
              );
            })}

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
          <div className="text-center py-10 text-muted-foreground">没有找到匹配的任务。</div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sticky bottom-0 bg-background py-3 border-t">
          <div className="text-sm text-muted-foreground">
            显示 {tasks.length > 0 ? (pageIndex - 1) * pageSize + 1 : 0}-{(pageIndex - 1) * pageSize + tasks.length} 共{" "}
            {total} 条记录
          </div>
        </div>
      </div>
    </>
  );
}
