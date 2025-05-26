import { useLoaderData, useParams, Link, useFetcher, Form } from "react-router";
import { getToken, r } from "#/lib";
import { getPluginInfo, reInstallPlugin, reCheckPlugin } from "#/api"; // Assuming reInstallPlugin/reCheckPlugin are in index
import type { PluginInfo } from "#/api/node/entity";
import { DASHBOARD_ROUTE, NODES_ROUTE } from "#/routes";
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Alert,
  Header,
} from "#/components";
import { RotateCw, CheckCircle2, PackageSearch } from "lucide-react";
import React, { useEffect } from "react";
import { successToast, errorToast } from "#/components/custom/toast";
import type { LoaderFunctionArgs } from "react-router";
import { EmptyPlaceholder } from "#/components/custom/sundry/empty-placeholder";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const nodeName = params.nodeName;

  if (!nodeName) {
    return {
      success: false,
      message: "未指定节点名称",
      plugins: [],
      nodeName: null
    };
  }

  try {
    // getPluginInfo returns ListResponse<PluginInfo>, so we access list
    const { list } = await getPluginInfo({ name: nodeName, token });
    return {
      success: true,
      plugins: list || [],
      nodeName: nodeName,
      message: "ok"
    };
  } catch (error) {
    return {
      success: false,
      message: `无法加载节点 ${nodeName} 的插件列表`,
      plugins: [],
      nodeName: nodeName
    };
  }
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const nodeName = params.nodeName;
  const [{ _action, hash, module }, token] = await Promise.all([
    request.json(),
    getToken(request)
  ]);

  if (!nodeName || !hash || !module) {
    return { success: false, message: "缺少必要参数" };
  }

  const pluginData = { node: nodeName, hash, module, token };

  try {
    switch (_action) {
      case "reinstall":
        await reInstallPlugin(pluginData);
        return { success: true, message: "插件重新安装成功" };
      case "recheck":
        await reCheckPlugin(pluginData);
        return { success: true, message: "插件重新检查成功" };
      default:
        return { success: false, message: "无效操作" };
    }
  } catch (error) {
    const actionText = _action === "reinstall" ? "重新安装" : "重新检查";
    return { success: false, message: `插件${actionText}失败` };
  }
}

export default function NodePluginListPage() {
  const { plugins, nodeName, success, message } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  // Alternative way to get nodeName if needed
  // const params = useParams();
  // const currentNodeName = params.nodeName;

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        successToast(fetcher.data.message);
      } else {
        errorToast(fetcher.data.message);
      }
    }
  }, [fetcher.data]);

  if (!success) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[
        { name: "Dashboard", href: DASHBOARD_ROUTE },
        { name: "节点管理", href: NODES_ROUTE },
        { name: `节点 ${nodeName} - 插件管理` }
      ]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">节点 {nodeName} - 插件管理</h1>
            <p className="text-muted-foreground text-sm">管理节点上的插件</p>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-hidden m-6 p-2">
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-auto">
            {plugins && plugins.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>插件名称</TableHead>
                    <TableHead>模块</TableHead>
                    <TableHead>HASH</TableHead>
                    <TableHead className="w-[300px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plugins.map(plugin => (
                    <TableRow key={`${plugin.module}-${plugin.hash}`}>
                      <TableCell className="font-medium">{plugin.name}</TableCell>
                      <TableCell>{plugin.module}</TableCell>
                      <TableCell className="font-mono text-xs">{plugin.hash}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() =>
                            fetcher.submit(
                              {
                                _action: "reinstall",
                                hash: plugin.hash,
                                module: plugin.module
                              },
                              { method: "post", encType: "application/json" }
                            )
                          }
                          disabled={fetcher.state !== "idle"}
                        >
                          <RotateCw className="w-4 h-4 mr-2" />
                          重新安装
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() =>
                            fetcher.submit(
                              {
                                _action: "recheck",
                                hash: plugin.hash,
                                module: plugin.module
                              },
                              { method: "post", encType: "application/json" }
                            )
                          }
                          disabled={fetcher.state !== "idle"}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          重新检查
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyPlaceholder 
                icon={<PackageSearch className="h-12 w-12 text-muted-foreground" />}
                title="没有找到插件"
                description={`此节点 (${nodeName}) 上没有找到插件。`}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 