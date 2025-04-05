import { useLoaderData, useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getScheduledTaskData } from "#/api";
import { TaskListLayout, TaskCard } from "#/components";
import { Calendar, Clock, Pencil, Server, type LucideIcon } from "lucide-react";
import { DASHBOARD_ROUTE, SCHEDULED_TASK_EDIT_ROUTE } from "#/routes";
import { getSearchParams, getToken, r } from "#/lib";

// 定时任务状态定义
type TaskState = "enabled" | "disabled";

// 状态标记定义
const STATE_BADGES: Record<
  TaskState,
  {
    icon: LucideIcon;
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  enabled: {
    icon: Clock,
    label: "已启用",
    variant: "default",
    className: "bg-green-500 hover:bg-green-600"
  },
  disabled: {
    icon: Clock,
    label: "已禁用",
    variant: "outline"
  }
};

// // 定时任务操作
// const TASK_ACTIONS = [
//   {
//     key: "edit",
//     icon: Pencil,
//     title: "编辑",
//     route: (id: string) => r(SCHEDULED_TASK_EDIT_ROUTE, { variables: { taskId: id } })
//   }
// ];

const TASK_ACTIONS: {
  key: string;
  icon: LucideIcon;
  title: string;
  route: (id: string) => string;
}[] = [];

// 加载器函数获取定时任务数据
export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);

  const { search, pageIndex, pageSize } = getSearchParams(request, {
    search: "",
    pageIndex: 1,
    pageSize: 10
  });

  const { list, total } = await getScheduledTaskData({
    search,
    pageIndex,
    pageSize,
    token
  });

  console.log(list);

  return { tasks: list, total, pageIndex, pageSize };
}

// 格式化时间显示
function formatTime(time: string | null): string {
  if (!time) return "未设置";
  return new Date(time).toLocaleString();
}

// 格式化节点显示
function formatNodes(nodes: string[] | undefined, allNode: boolean | undefined): React.ReactNode {
  if (allNode) return "所有节点";
  if (!nodes || nodes.length === 0) return "未指定节点";
  return (
    <div className="flex items-center">
      <Server className="w-3 h-3 mr-1 text-blue-500" />
      <span>{nodes.length} 个节点</span>
    </div>
  );
}

// 主页面组件
export default function ScheduledTaskListPage() {
  const { tasks, total, pageIndex, pageSize } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search") || "";

  return (
    <TaskListLayout
      title="定时任务"
      subtitle="管理所有定时扫描任务"
      searchPlaceholder="搜索任务名称..."
      routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "定时任务" }]}
      createButtonText="新建定时任务"
      searchValue={searchValue}
      setSearchParams={setSearchParams}
      pageSize={pageSize}
      pageIndex={pageIndex}
      total={total}
      showDownload={false}
    >
      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map(task => {
            const taskState: TaskState = task.state ? "enabled" : "disabled";
            const stateInfo = STATE_BADGES[taskState];

            return (
              <TaskCard
                key={task.name}
                id={task.ID}
                title={task.name}
                statusKey={taskState}
                statusBadge={stateInfo}
                actions={TASK_ACTIONS}
                items={[
                  {
                    label: "类型",
                    value: task.taskType
                  },
                  {
                    label: "周期",
                    value: task.cycle ? `${task.cycle}分钟` : "未设置"
                  },
                  {
                    label: "节点",
                    value: formatNodes(task.node, task.allNode)
                  },
                  {
                    label: "上次执行",
                    value: formatTime(task.lastTime)
                  },
                  {
                    label: "下次执行",
                    value: formatTime(task.nextTime)
                  }
                ]}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">没有找到匹配的定时任务。</div>
      )}
    </TaskListLayout>
  );
}
