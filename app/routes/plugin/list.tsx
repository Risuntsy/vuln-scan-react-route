import { useLoaderData, useSearchParams, type LoaderFunctionArgs, Link, useFetcher, Form } from "react-router";
import { getToken, getSearchParams, r, sleep } from "#/lib";
import { getPluginData, reInstallPlugin, reCheckPlugin, uninstallPlugin } from "#/api";
import { DASHBOARD_ROUTE, PLUGIN_CREATE_ROUTE, PLUGIN_EDIT_ROUTE, PLUGIN_LOG_ROUTE } from "#/routes";
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
  PaginationControls,
  Input
} from "#/components";
import { Plus, Upload, RotateCw, CheckCircle2, Trash2, FileText, Pencil, PackageSearch, Store } from "lucide-react";
import React, { useEffect } from "react";
import { successToast, errorToast } from "#/components/custom/toast";
import { EmptyPlaceholder } from "#/components/custom/empty-placeholder";

const PAGE_SIZES = [10, 20, 50];

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const { pageIndex, pageSize, search } = getSearchParams(request, {
    pageIndex: 1,
    pageSize: PAGE_SIZES[0],
    search: ""
  });

  try {
    const { list, total } = await getPluginData({ pageIndex, pageSize, search, token });

    return {
      success: true,
      plugins: list || [],
      total: total || 0,
      pageIndex,
      pageSize,
      search,
      message: "ok"
    };
  } catch (error) {
    console.error("Failed to load plugins:", error);
    return {
      success: false,
      message: "无法加载插件列表"
    };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const [{ pluginId, _action: action, node, hash, module }, token] = await Promise.all([
    request.json(),
    getToken(request)
  ]);

  if (!pluginId || !node || !hash || !module) {
    return { success: false, message: "缺少必要参数" };
  }

  try {
    switch (action) {
      case "reinstall":
        return {
          ...(await reInstallPlugin({ node, hash, module, token })),
          success: true,
          message: "插件重新安装成功"
        };
      case "recheck":
        return {
          ...(await reCheckPlugin({ node, hash, module, token })),
          success: true,
          message: "插件重新检查成功"
        };
      case "uninstall":
        return {
          ...(await uninstallPlugin({ node, hash, module, token })),
          success: true,
          message: "插件卸载成功"
        };
      default:
        return { success: false, message: "无效操作" };
    }
  } catch (error) {
    console.error(`Failed to ${action} plugin:`, error);
    return { success: false, message: `插件${action}失败` };
  }
}

export default function PluginListPage() {
  const { plugins, total, pageIndex, pageSize, search, success, message } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
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

  if (!success || !plugins) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "插件管理" }]}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">插件管理</h1>
            <p className="text-muted-foreground text-sm">管理漏洞扫描插件</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="h-8 px-2 sm:px-3">
              <a href="https://plugin.scope-sentry.top/" target="_blank" rel="noopener noreferrer">
                <Store className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">插件市场</span>
              </a>
            </Button>
            <Button size="sm" className="h-8 px-2 sm:px-3">
              <Upload className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">导入插件</span>
            </Button>
            <Button asChild size="sm" className="h-8 px-2 sm:px-3">
              <Link to={PLUGIN_CREATE_ROUTE}>
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">新建插件</span>
              </Link>
            </Button>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-hidden m-6 p-2">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center mb-4">
            <Form className="flex gap-2">
              <Input
                type="text"
                placeholder="搜索插件名称..."
                defaultValue={search}
                name="search"
                className="w-[300px]"
              />
              <Button type="submit">搜索</Button>
            </Form>
          </div>

          <div className="flex-1 overflow-auto">
            {plugins && plugins.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>插件名称</TableHead>
                    <TableHead>模块</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>系统插件</TableHead>
                    <TableHead className="w-[300px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plugins.map(plugin => (
                    <React.Fragment key={plugin.id}>
                      <TableRow>
                        <TableCell className="font-medium">{plugin.name}</TableCell>
                        <TableCell>{plugin.module}</TableCell>
                        <TableCell>{plugin.version}</TableCell>
                        <TableCell>{plugin.isSystem ? "是" : "否"}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() =>
                              fetcher.submit(
                                {
                                  pluginId: plugin.id,
                                  _action: "reinstall",
                                  node: "default",
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
                                  pluginId: plugin.id,
                                  _action: "recheck",
                                  node: "default",
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
                          <Button variant="outline" size="sm" className="h-8" asChild>
                            <Link to={r(PLUGIN_LOG_ROUTE, { params: { hash: plugin.hash, module: plugin.module } })}>
                              <FileText className="w-4 h-4 mr-2" />
                              查看日志
                            </Link>
                          </Button>
                          {!plugin.isSystem && (
                            <>
                              <Button variant="outline" size="sm" className="h-8" asChild>
                                <Link to={r(PLUGIN_EDIT_ROUTE, { params: { pluginId: plugin.id } })}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  编辑
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm" className="h-8">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    卸载
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>确认卸载</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      确定要卸载此插件吗？此操作无法撤销。
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        fetcher.submit(
                                          {
                                            pluginId: plugin.id,
                                            _action: "uninstall",
                                            node: "default",
                                            hash: plugin.hash,
                                            module: plugin.module
                                          },
                                          { method: "post", encType: "application/json" }
                                        )
                                      }
                                      disabled={fetcher.state !== "idle"}
                                    >
                                      {fetcher.state !== "idle" ? <span className="animate-spin">⏳</span> : "卸载"}
                                    </Button>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyPlaceholder
                icon={<PackageSearch className="h-12 w-12 text-muted-foreground" />}
                title="没有找到插件"
                description="系统中当前没有安装任何插件，或搜索条件无结果。"
              />
            )}
          </div>

          <PaginationControls
            pageIndex={pageIndex}
            pageSize={pageSize}
            total={total}
            setSearchParams={setSearchParams}
          />
        </div>
      </Card>
    </div>
  );
}
