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
  Badge,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger
} from "#/components";
import { RotateCw, CheckCircle2, PackageSearch, AlertCircle, CheckCircle, XCircle } from "lucide-react";
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

const getInstallStatusBadge = (install: string) => {
  if (install === "1") {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        已安装
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
      <XCircle className="w-3 h-3 mr-1" />
      未安装
    </Badge>
  );
};

const getCheckStatusBadge = (check: string) => {
  if (check === "1") {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        检查通过
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
      <AlertCircle className="w-3 h-3 mr-1" />
      检查失败
    </Badge>
  );
};

const getModuleBadge = (module: string) => {
  const moduleColors: Record<string, string> = {
    AssetHandle: "bg-purple-100 text-purple-800",
    AssetMapping: "bg-indigo-100 text-indigo-800",
    DirScan: "bg-pink-100 text-pink-800",
    PortFingerprint: "bg-cyan-100 text-cyan-800",
    PortScan: "bg-teal-100 text-teal-800",
    PortScanPreparation: "bg-orange-100 text-orange-800",
    SubdomainScan: "bg-emerald-100 text-emerald-800",
    SubdomainSecurity: "bg-lime-100 text-lime-800",
    URLScan: "bg-sky-100 text-sky-800",
    URLSecurity: "bg-rose-100 text-rose-800",
    VulnerabilityScan: "bg-red-100 text-red-800",
    WebCrawler: "bg-amber-100 text-amber-800"
  };

  return (
    <Badge variant="outline" className={moduleColors[module] || "bg-gray-100 text-gray-800"}>
      {module}
    </Badge>
  );
};

export default function NodePluginListPage() {
  const { plugins, nodeName, success, message } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

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
    return (
      <div className="flex flex-1 flex-col h-full">
        <Header routes={[
          { name: "Dashboard", href: DASHBOARD_ROUTE },
          { name: "节点管理", href: NODES_ROUTE },
          { name: `节点插件管理` }
        ]}>
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">节点插件管理</h1>
              <p className="text-muted-foreground text-sm">管理节点上的插件</p>
            </div>
          </div>
        </Header>
        <div className="m-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div>
              <h4 className="font-medium">加载失败</h4>
              <p className="text-sm">{message}</p>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  const installedPlugins = plugins.filter(plugin => plugin.install === "1");
  const notInstalledPlugins = plugins.filter(plugin => plugin.install === "0");
  const passedCheckPlugins = installedPlugins.filter(plugin => plugin.check === "1");
  const failedCheckPlugins = installedPlugins.filter(plugin => plugin.check === "0");

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[
        { name: "Dashboard", href: DASHBOARD_ROUTE },
        { name: "节点管理", href: NODES_ROUTE },
        { name: `节点 ${nodeName} - 插件管理` }
      ]}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">节点 {nodeName} - 插件管理</h1>
            <p className="text-muted-foreground text-sm">管理节点上的插件状态和配置</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              已安装: {installedPlugins.length}
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              检查通过: {passedCheckPlugins.length}
            </Badge>
            {failedCheckPlugins.length > 0 && (
              <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
                检查失败: {failedCheckPlugins.length}
              </Badge>
            )}
            {notInstalledPlugins.length > 0 && (
              <Badge variant="secondary" className="bg-red-50 text-red-700">
                未安装: {notInstalledPlugins.length}
              </Badge>
            )}
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
                    <TableHead>模块类型</TableHead>
                    <TableHead>安装状态</TableHead>
                    <TableHead>检查状态</TableHead>
                    <TableHead>HASH</TableHead>
                    <TableHead className="w-[300px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plugins.map(plugin => (
                    <TableRow key={`${plugin.module}-${plugin.hash}`} className={plugin.install === "0" ? "opacity-60" : ""}>
                      <TableCell className="font-medium">{plugin.name}</TableCell>
                      <TableCell>{getModuleBadge(plugin.module)}</TableCell>
                      <TableCell>{getInstallStatusBadge(plugin.install)}</TableCell>
                      <TableCell>{getCheckStatusBadge(plugin.check)}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{plugin.hash}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              disabled={fetcher.state !== "idle"}
                            >
                              <RotateCw className="w-4 h-4 mr-2" />
                              重新安装
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认重新安装</AlertDialogTitle>
                              <AlertDialogDescription>
                                确定要重新安装插件 "{plugin.name}" 吗？这将重新下载并安装插件。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
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
                              >
                                重新安装
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        {plugin.install === "1" && (
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
                        )}
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