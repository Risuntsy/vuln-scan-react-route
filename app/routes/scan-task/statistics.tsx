import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Button, ScanTaskHeader } from "#/components";
import { SCAN_TASK_ASSETS_ROUTE } from "#/routes";
import { getToken, r } from "#/lib";
import { getTaskDetail } from "#/api";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const taskId = params.taskId;
  if (!taskId) {
    throw new Response("Task ID not found", { status: 404 });
  }

  const token = await getToken(request);
  const taskDetail = await getTaskDetail({ id: taskId, token });

  if (!taskDetail) {
    throw new Response("Task not found", { status: 404 });
  }

  return { taskId, taskDetail };
}

export default function ScanTaskStatisticsPage() {
  const { taskId, taskDetail } = useLoaderData<typeof loader>();

  return <div>
    <ScanTaskHeader taskId={taskId} taskDetail={taskDetail} routes={[{ name: "统计信息" }]}>
      <Link to={r(SCAN_TASK_ASSETS_ROUTE, { variables: { taskId } })}>  
        <Button variant="default">所有资产</Button>
      </Link>
    </ScanTaskHeader>

    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">任务统计信息</h2>
      {/* 统计信息内容将在这里添加 */}
    </div>
  </div>;
}
