import { useLoaderData, useSearchParams, type LoaderFunctionArgs, Link, useFetcher, Form , data} from "react-router";
import { getToken, getSearchParams, r } from "#/lib";
import { getPluginData, reInstallPlugin, reCheckPlugin, deletePluginData, checkKey, importPlugin } from "#/api";
import { getPluginKey, pluginKeyCookie } from "#/lib/cookie";
import { DASHBOARD_ROUTE, PLUGIN_EDIT_ROUTE, PLUGIN_LOG_ROUTE } from "#/routes";
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
  AlertDialogTrigger,
  PaginationControls,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  Checkbox,
  Badge
} from "#/components";
import {
  Plus,
  Upload,
  RotateCw,
  CheckCircle2,
  Trash2,
  FileText,
  Pencil,
  PackageSearch,
  Store,
  Key,
  Info
} from "lucide-react";
import  { useEffect, useRef, useState } from "react";
import { successToast, errorToast } from "#/components";
import { EmptyPlaceholder } from "#/components";
import type { CheckedState } from "@radix-ui/react-checkbox";

const PAGE_SIZES = [10, 20, 50];

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const { pageIndex, pageSize, search } = getSearchParams(request, {
    pageIndex: 1,
    pageSize: PAGE_SIZES[1],
    search: ""
  });

  // Check if plugin key exists
  const pluginKey = await getPluginKey(request);

  try {
    const { list, total } = await getPluginData({ pageIndex, pageSize, search, token });

    return {
      success: true,
      plugins: list || [],
      total: total || 0,
      pageIndex,
      pageSize,
      search,
      message: "ok",
      hasPluginKey: !!pluginKey
    };
  } catch (error) {
    return {
      success: false,
      message: "无法加载插件列表",
      hasPluginKey: !!pluginKey
    };
  }
}

async function handlePluginImport(request: Request): Promise<{ success: boolean; message: string; action: string }> {
  const [token, formData, pluginKey] = await Promise.all([
    getToken(request),
    request.formData(),
    getPluginKey(request)
  ]);
  if (!pluginKey) {
    return { success: false, message: "请先设置插件密钥", action: "import" };
  }
  const result = await importPlugin({ token, formData, key: pluginKey });
  return { success: true, message: result.message || "插件导入成功", action: "import" };
}

function isMultipartFormData(request: Request) {
  return request.headers.get("content-type")?.includes("multipart/form-data");
}

export async function action({ request }: LoaderFunctionArgs) {
  if (isMultipartFormData(request)) {
    return handlePluginImport(request);
  }

  const [{ pluginId, _action: action, node, hash, module, key, plugins: pluginsToDelete }, token] = await Promise.all([
    request.json(),
    getToken(request)
  ]);

  // Handle plugin key validation
  if (action === "validateKey") {
    if (!key) {
      return { success: false, message: "请输入插件密钥" };
    }

    try {
      const result = await checkKey({ key, token });
      return data({ success: true, message: result.message || "插件密钥验证成功" }, { status: 200, headers: {
        "Set-Cookie": await pluginKeyCookie.serialize(key)
      }});
    } catch (error) {
      return { success: false, message: "插件密钥验证失败" };
    }
  }

  // Handle other plugin actions
  try {
    switch (action) {
      case "reinstall":
        if (!pluginId || !node || !hash || !module) {
          return { success: false, message: "缺少必要参数" };
        }
        return {
          ...(await reInstallPlugin({ node, hash, module, token })),
          success: true,
          message: "插件重新安装成功"
        };
      case "recheck":
        if (!pluginId || !node || !hash || !module) {
          return { success: false, message: "缺少必要参数" };
        }
        return {
          ...(await reCheckPlugin({ node, hash, module, token })),
          success: true,
          message: "插件重新检查成功"
        };
      case "delete":
        if (pluginsToDelete && Array.isArray(pluginsToDelete) && pluginsToDelete.length > 0) {
          // Batch delete
          const result = await deletePluginData({ data: pluginsToDelete, token });
          return { success: true, message: result.message || "插件批量删除成功", action: "delete" };
        } else if (hash && module) {
          // Single delete
          const result = await deletePluginData({ data: [{ hash, module }], token });
          return { success: true, message: result.message || "插件删除成功", action: "delete" };
        } else {
          return { success: false, message: "缺少必要参数", action: "delete" };
        }
      default:
        return { success: false, message: "无效操作" };
    }
  } catch (error) {
    return { success: false, message: `插件${action}失败` };
  }
}

export default function PluginListPage() {
  const { plugins, total, pageIndex, pageSize, search, success, message, hasPluginKey } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

  // Plugin key dialog state
  const [showKeyDialog, setShowKeyDialog] = useState(!hasPluginKey);
  const [pluginKey, setPluginKey] = useState("");
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importPluginFormRef = useRef<HTMLFormElement>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        successToast(fetcher.data.message);
        if (fetcher.data.action === "validateKey") {
          setShowKeyDialog(false);
          setPluginKey("");
        }
        if (fetcher.data.action === "import") {
          setShowImportDialog(false);
        }
        if (fetcher.data.action === "delete") {
          setSelectedRows([]);
        }
      } else {
        errorToast(fetcher.data.message);
      }
      setIsValidatingKey(false);
    }
  }, [fetcher.data]);

  const handleKeySubmit = () => {
    setIsValidatingKey(true);
    fetcher.submit({ _action: "validateKey", key: pluginKey }, { method: "post", encType: "application/json" });
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0 || !plugins) {
      return;
    }
    const pluginsToDelete = plugins
      .filter(p => selectedRows.includes(p.id))
      .map(p => ({ hash: p.hash, module: p.module }));
    
    fetcher.submit(
      { _action: "delete", plugins: pluginsToDelete },
      { method: "post", encType: "application/json" }
    );
  };

  if (!success || !plugins) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  const nonSystemPlugins = plugins.filter(p => !p.isSystem);
  const isAllSelected = selectedRows.length === nonSystemPlugins.length && nonSystemPlugins.length > 0;
  const isIndeterminate = selectedRows.length > 0 && !isAllSelected;

  const handleSelectAll = (checked: CheckedState) => {
    if (checked === "indeterminate") return;
    
    if (checked) {
      setSelectedRows(nonSystemPlugins.map(p => p.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (pluginId: string, checked: CheckedState) => {
    if (checked === "indeterminate") return;
    
    if (checked) {
      setSelectedRows(prev => [...prev, pluginId]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== pluginId));
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "插件管理" }]}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">插件管理</h1>
            <p className="text-muted-foreground text-sm">管理漏洞扫描插件</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!hasPluginKey && (
              <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3" onClick={() => setShowKeyDialog(true)}>
                <Key className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">插件密钥</span>
              </Button>
            )}
            <Button asChild size="sm" className="h-8 px-2 sm:px-3">
              <a href="https://plugin.scope-sentry.top/" target="_blank" rel="noopener noreferrer">
                <Store className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">插件市场</span>
              </a>
            </Button>
            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 px-2 sm:px-3">
                  <Upload className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">导入插件</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>导入插件</DialogTitle>
                  <DialogDescription>请选择要导入的插件文件(.zip格式)</DialogDescription>
                </DialogHeader>
                <fetcher.Form
                  method="post"
                  encType="multipart/form-data"
                  ref={importPluginFormRef}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Input type="file" name="file" accept=".zip" ref={fileInputRef} required />
                  </div>
                  <DialogFooter>
                    <Button type="submit">导入</Button>
                  </DialogFooter>
                </fetcher.Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Header>

      {/* Plugin Key Dialog */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              插件密钥验证
            </DialogTitle>
            <DialogDescription>请输入您的插件密钥以访问插件功能。您可以从插件市场获取密钥。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="请输入插件密钥"
                value={pluginKey}
                onChange={e => setPluginKey(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleKeySubmit();
                  }
                }}
                disabled={isValidatingKey}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowKeyDialog(false)} disabled={isValidatingKey}>
              跳过
            </Button>
            <Button onClick={handleKeySubmit} disabled={isValidatingKey || !pluginKey.trim()}>
              {isValidatingKey ? "验证中..." : "验证"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="flex flex-1 overflow-hidden m-6 p-2">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center mb-4">
            <fetcher.Form className="flex gap-2">
              <Input
                type="text"
                placeholder="搜索插件名称..."
                defaultValue={search}
                name="search"
                className="w-[300px]"
              />
              <Button type="submit">搜索</Button>
            </fetcher.Form>
            {selectedRows.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除选中 ({selectedRows.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>
                      确定要删除选中的 {selectedRows.length} 个插件吗？此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDeleteSelected}>
                      删除
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {plugins && plugins.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-12 p-2">
                      <Checkbox
                        checked={isAllSelected ? true : isIndeterminate ? "indeterminate" : false}
                        onCheckedChange={handleSelectAll}
                        disabled={nonSystemPlugins.length === 0}
                      />
                    </TableHead>
                    <TableHead>插件名称</TableHead>
                    <TableHead>模块</TableHead>
                    <TableHead>版本</TableHead>
                    <TableHead>参数</TableHead>
                    <TableHead>简介</TableHead>
                    <TableHead>系统插件</TableHead>
                    <TableHead className="w-[300px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plugins.map(plugin => (
                    <TableRow key={plugin.id}>
                      <TableCell className="p-2">
                        <Checkbox
                          checked={selectedRows.includes(plugin.id)}
                          onCheckedChange={checked => handleSelectRow(plugin.id, checked)}
                          disabled={plugin.isSystem}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {plugin.name}
                          {plugin.introduction && (
                            <span className="ml-1">
                              <Badge variant="secondary" className="text-xs px-1 py-0.5">{plugin.introduction}</Badge>
                            </span>
                          )}
                        </div>
                        {plugin.help && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            <span>{plugin.help}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{plugin.module}</TableCell>
                      <TableCell>{plugin.version}</TableCell>
                      <TableCell>
                        {plugin.parameter ? (
                          <span className="break-all text-xs font-mono bg-muted px-2 py-1 rounded">
                            {plugin.parameter}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">无</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {plugin.introduction ? (
                          <span className="text-xs">{plugin.introduction}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="h-8">
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除此插件吗？此操作无法撤销。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    fetcher.submit(
                                      {
                                        _action: "delete",
                                        plugins: [{ hash: plugin.hash, module: plugin.module }]
                                      },
                                      { method: "post", encType: "application/json" }
                                    )
                                  }
                                  disabled={fetcher.state !== "idle"}
                                >
                                  删除
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
