import {
  useFetcher,
  useLoaderData,
  useSearchParams,
  type ActionFunctionArgs,
  type LoaderFunctionArgs
} from "react-router";
import {
  deleteScheduledTask,
  getScheduledTaskData,
  updateScheduleTask,
  type ScheduledTaskData,
  getNodeDataOnline,
  addScheduledTask,
  getTemplateData,
  updateScheduledTaskPageMonit
} from "#/api";
import { TaskListLayout, successToast, errorToast } from "#/components";
import { DASHBOARD_ROUTE } from "#/routes";
import { getSearchParams, getToken } from "#/lib";
import { TaskCard } from "#/components/page/task/scheduled/task-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { useState, useEffect } from "react";
import { ScheduledTaskForm, type TaskFormData } from "#/components";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);

  const { search, pageIndex, pageSize } = getSearchParams(request, {
    search: "",
    pageIndex: 1,
    pageSize: 10
  });

  const [{ list, total }, nodeData, templates] = await Promise.all([
    getScheduledTaskData({
      search,
      pageIndex,
      pageSize,
      token
    }),
    getNodeDataOnline({ token }),
    getTemplateData({ token })
  ]);

  return {
    tasks: list,
    total,
    pageIndex,
    pageSize,
    nodeList: nodeData.list.map((nodeName: string) => ({ label: nodeName, value: nodeName })),
    templateList: templates.list
  };
}

export type ScheduledTaskActionData = {
  success: boolean;
  message: string;
  _action?: "create" | "edit" | "delete" | "update";
  data?: any;
};

export async function action({ request }: ActionFunctionArgs): Promise<ScheduledTaskActionData> {
  const token = await getToken(request);
  let rawData = await request.json();
  const { _action, cycleType, hour, minute, day, week, ...restData } = rawData;
  const apiData: any = { ...restData };

  if (cycleType === "nhours") {
    apiData.hour = hour;
    apiData.minute = undefined;
    apiData.day = undefined;
    apiData.week = undefined;
  } else if (cycleType === "daily") {
    apiData.hour = hour;
    apiData.minute = minute;
    apiData.day = day;
    apiData.week = undefined;
  } else if (cycleType === "weekly") {
    apiData.hour = hour;
    apiData.minute = minute;
    apiData.week = week;
    apiData.day = undefined;
  }

  if (apiData.targetSource === "subdomain" && !apiData.target) {
    apiData.target = "";
  }

  try {
    switch (_action) {
      case "create":
        return {
          message: "创建成功",
          data: await addScheduledTask({ token, cycleType, ...apiData }),
          success: true,
          _action: "create"
        };
      case "edit":
        if (apiData.id === "page_monitoring") {
          return {
            message: "编辑成功",
            data: await updateScheduledTaskPageMonit({ token, cycleType, ...apiData }),
            success: true,
            _action: "update"
          };
        }
        return {
          message: "编辑成功",
          data: await updateScheduleTask({ token, cycleType, ...apiData }),
          success: true,
          _action: "edit"
        };
      case "delete":
        return {
          message: "删除成功",
          data: await deleteScheduledTask({ token, ids: rawData.ids }),
          success: true,
          _action: "delete"
        };
      default:
        throw new Error("Unsupported action");
    }
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message || `${_action === "create" ? "创建" : _action === "edit" ? "更新" : "删除"}定时任务失败。`,
      _action
    };
  }
}

export default function ScheduledTaskListPage() {
  const { tasks, total, pageIndex, pageSize, nodeList, templateList } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search") || "";
  const fetcher = useFetcher<typeof action>();
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    taskData?: ScheduledTaskData;
    taskId?: string;
  }>({
    open: false,
    mode: "create"
  });

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        successToast(fetcher.data.message || "操作成功");
        if (dialogState.open && (fetcher.data?._action === "create" || fetcher.data?._action === "edit")) {
          setDialogState({ open: false, mode: "create", taskData: undefined, taskId: undefined });
        }
      } else {
        errorToast(fetcher.data.message || "操作失败");
      }
    }
  }, [fetcher.data]);

  const handleEdit = async (task: ScheduledTaskData) => {
    setDialogState({
      open: true,
      mode: "edit",
      taskData: task,
      taskId: task.id
    });
  };

  const handleCreate = () => {
    setDialogState({
      open: true,
      mode: "create",
      taskData: undefined,
      taskId: undefined
    });
  };

  return (
    <>
      <TaskListLayout
        title="计划任务"
        subtitle="管理所有定时扫描任务"
        searchPlaceholder="搜索任务名称..."
        routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "计划任务" }]}
        createButtonText="新建计划任务"
        searchValue={searchValue}
        setSearchParams={setSearchParams}
        pageSize={pageSize}
        pageIndex={pageIndex}
        total={total}
        onCreateClick={handleCreate}
      >
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={() => handleEdit(task)} fetcher={fetcher} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">没有找到匹配的计划任务。</div>
          )}
        </div>
      </TaskListLayout>

      <Dialog
        open={dialogState.open}
        onOpenChange={open => {
          if (!open) {
            setDialogState({ open: false, mode: "create", taskData: undefined, taskId: undefined });
          }
        }}
      >
        <DialogContent className="min-w-[50%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogState.mode === "create" ? "创建计划任务" : "编辑计划任务"}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <ScheduledTaskForm
            mode={dialogState.mode}
            defaultValues={dialogState.taskData}
            nodeList={nodeList}
            templateList={templateList}
            fetcher={fetcher}
            taskId={dialogState.taskId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
