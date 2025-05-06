import { NOT_FOUND_ROUTE, DASHBOARD_ROUTE, NODES_ROUTE } from "#/routes";
import { redirect, useLoaderData, useParams } from "react-router";
import { getToken } from "#/lib/cookie";
import { getNodeLog } from "#/api";
import { LogViewer } from "#/components/custom/log-viewer";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { nodeName } = params;
  if (!nodeName) {
    return redirect(NOT_FOUND_ROUTE);
  }

  const token = await getToken(request);
  try {
    const logData = await getNodeLog({ name: nodeName, token });
    return { success: true, logContent: logData?.logs, nodeName };
  } catch (error) {
    console.error(`Failed to load log for node ${nodeName}:`, error);
    return {
      success: false,
      logContent: "无法加载日志",
      nodeName,
      message: `无法加载节点 ${nodeName} 的日志`
    };
  }
}

export default function NodeLogPage() {
  const { success, logContent, nodeName, message } = useLoaderData<typeof loader>();
  const { nodeName: paramNodeName } = useParams(); // Can also get nodeName from params

  return (
    <LogViewer
      headerRoutes={[
        { name: "Dashboard", href: DASHBOARD_ROUTE },
        { name: "节点管理", href: NODES_ROUTE },
        { name: `节点 ${nodeName} - 日志` }
      ]}
      pageTitle={`节点 ${nodeName} - 日志`}
      pageDescription="查看节点运行日志"
      cardTitle={`日志详情 (Node: ${nodeName})`}
      logContent={logContent}
      showClearButton={false}
    />
  );
}
