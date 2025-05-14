import { NOT_FOUND_ROUTE, DASHBOARD_ROUTE, PLUGINS_ROUTE } from "#/routes";
import { redirect, useFetcher, useLoaderData, useParams } from "react-router";
import { getToken } from "#/lib/cookie";
import { getPluginLog, cleanPluginLog } from "#/api";
import { useEffect } from "react";
import { successToast, errorToast } from "#/components/custom/toast";
// Assuming LogViewer is correctly placed, adjust import if necessary
import { LogViewer } from "#/components/custom/sundry/log-viewer"; 
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { hash, module } = params;
  if (!hash || !module) {
    return redirect(NOT_FOUND_ROUTE);
  }

  const token = await getToken(request);
  try {
    const logData = await getPluginLog({ module, hash, token });
    return { success: true, logContent: logData?.logs, module, hash };
  } catch (error) {
    console.error("Failed to load plugin log:", error);
    return {
      success: false,
      logContent: "无法加载日志",
      module,
      hash,
      message: "无法加载插件日志"
    };
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { hash, module } = params;
  if (!hash || !module) {
    return { success: false, message: "缺少必要参数" };
  }

  const token = await getToken(request);

  try {
    await cleanPluginLog({ module, hash, token });
    return { success: true, message: "日志清理成功" };
  } catch (error) {
    console.error("Failed to clean plugin log:", error);
    return { success: false, message: "日志清理失败" };
  }
}

export default function PluginLogPage() {
  const { success, logContent, module, hash, message } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        successToast(fetcher.data.message);
      } else {
        errorToast(fetcher.data.message);
      }
    }
  }, [fetcher.state, fetcher.data]);


  const handleClear = () => {
    if (!hash || !module) return;
    fetcher.submit({}, { method: "post" });
  };

  return (
    <LogViewer
      headerRoutes={[
        { name: "Dashboard", href: DASHBOARD_ROUTE },
        { name: "插件管理", href: PLUGINS_ROUTE },
        { name: "插件日志" }
      ]}
      pageTitle="插件日志"
      pageDescription="查看和管理插件运行日志"
      cardTitle={`日志详情 (Module: ${module}, Hash: ${hash})`}
      logContent={logContent}
      showClearButton={true}
      fetcher={fetcher}
      onClear={handleClear}
    />
  );
} 