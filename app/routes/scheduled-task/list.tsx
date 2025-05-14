import {
  useFetcher,
  useLoaderData,
  useSearchParams,
  type ActionFunctionArgs,
  type LoaderFunctionArgs
} from "react-router";
import { deleteScheduledTask, getScheduledTaskData, updateScheduleTask, type ScheduledTaskData } from "#/api";
import { TaskListLayout } from "#/components";
import { DASHBOARD_ROUTE } from "#/routes";
import { getSearchParams, getToken } from "#/lib";
import { TaskCard } from "#/components/page/task/scheduled/task-card";

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

  return { tasks: list, total, pageIndex, pageSize };
}

export async function action({ request }: ActionFunctionArgs) {
  const token = await getToken(request);
  const { _action, ...data } = await request.json();
  switch (_action) {
    case "edit":
      return {
        message: "编辑成功",
        data: await updateScheduleTask({ token, ...data }),
        success: true
      };
    case "delete":
      return {
        message: "删除成功",
        data: await deleteScheduledTask({ token, ...data }),
        success: true
      };
    default:
      throw new Error("Unsupported action");
  }
}

export default function ScheduledTaskListPage() {
  const { tasks, total, pageIndex, pageSize } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("search") || "";
  const fetcher = useFetcher();

  const handleDelete = async (id: string) => {
    await fetcher.submit({ _action: "delete", ids: [id] }, { method: "POST", encType: "application/json" });
  };

  const handleEdit = async (data: ScheduledTaskData) => {
    await fetcher.submit({ _action: "edit", ...data }, { method: "POST", encType: "application/json" });
  };

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
    >
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
        {tasks.length === 0 && <div className="text-center py-10 text-muted-foreground">没有找到匹配的定时任务。</div>}
      </div>
    </TaskListLayout>
  );
}
