import { useLoaderData, Link, useFetcher, useRevalidator } from "react-router";
import { getToken, r } from "#/lib";
import { getNodeData, deleteNode } from "#/api/node/api";
import { DASHBOARD_ROUTE, NODE_PLUGINS_ROUTE, NODE_LOG_ROUTE } from "#/routes";
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
  Checkbox,
  Badge
} from "#/components";
import { Plug, FileText, Trash2, Server } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { successToast, errorToast } from "#/components/custom/toast";
import type { LoaderFunctionArgs } from "react-router";
import { EmptyPlaceholder } from "#/components/custom/sundry/empty-placeholder";

function formatMemory(memStr: string | undefined): string {
  if (!memStr) return "N/A";
  const memBytes = parseFloat(memStr);
  if (isNaN(memBytes)) return "N/A";
  return (memBytes / 1024).toFixed(2) + " GB";
}

function getNodeStateText(state: string): string {
  switch (state) {
    case '1':
      return '运行中';
    case '2':
      return '已停止';
    default:
      return '离线';
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  try {
    const { list } = await getNodeData({ token });
    return {
      success: true,
      nodes: list || [],
      message: "ok"
    };
  } catch (error) {
    return {
      success: false,
      nodes: [],
      message: "无法加载节点列表"
    };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const [body, token] = await Promise.all([request.json(), getToken(request)]);
  const { nodeName, nodeNames, _action } = body;

  if (_action !== "delete") {
    return { success: false, message: "缺少必要参数或无效操作" };
  }

  // 支持单个和多个
  const names = nodeNames && Array.isArray(nodeNames) && nodeNames.length > 0
    ? nodeNames
    : nodeName
      ? [nodeName]
      : [];

  if (names.length === 0) {
    return { success: false, message: "缺少必要参数或无效操作" };
  }

  try {
    await deleteNode({ names, token });
    return { success: true, message: "节点删除成功" };
  } catch (error) {
    return { success: false, message: "节点删除失败" };
  }
}

export default function NodeListPage() {
  const { nodes, success, message } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // 多选状态
  const [selected, setSelected] = useState<string[]>([]);
  const allNodeNames = useMemo(() => nodes?.map(n => n.name) ?? [], [nodes]);
  const allSelected = selected.length > 0 && selected.length === allNodeNames.length;

  // 处理全选/全不选
  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? allNodeNames : []);
  };

  // 处理单个选择
  const handleSelectOne = (name: string, checked: boolean) => {
    setSelected(prev =>
      checked ? [...prev, name] : prev.filter(n => n !== name)
    );
  };

  // 删除多选
  const handleBatchDelete = () => {
    if (selected.length === 0) return;
    fetcher.submit(
      { nodeNames: selected, _action: "delete" },
      { method: "post", encType: "application/json" }
    );
  };

  // 删除单个
  const handleDeleteOne = (name: string) => {
    fetcher.submit(
      { nodeName: name, _action: "delete" },
      { method: "post", encType: "application/json" }
    );
  };

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        successToast(fetcher.data.message);
        setSelected([]); // 删除后清空选择
      } else {
        errorToast(fetcher.data.message);
      }
    }
  }, [fetcher.data]);

  if (!success) {
    return <Alert variant="destructive">{message}</Alert>;
  }
  const revalidate = useRevalidator();
  useEffect(() => {
    let cancelled = false;
    const chainRevalidate = async () => {
      if (cancelled) return;
      await revalidate.revalidate();
      setTimeout(chainRevalidate, 5000);
    };
    chainRevalidate();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "节点管理" }]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">节点管理</h1>
            <p className="text-muted-foreground text-sm">管理扫描节点</p>
          </div>
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  disabled={selected.length === 0 || fetcher.state !== "idle"}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  批量删除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认批量删除</AlertDialogTitle>
                  <AlertDialogDescription>
                    确定要删除选中的 {selected.length} 个节点吗？此操作无法撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={handleBatchDelete}
                    disabled={fetcher.state !== "idle"}
                  >
                    {fetcher.state !== "idle" ? <span className="animate-spin">加载中</span> : "删除"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-hidden m-6 p-2">
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-auto">
            {nodes && nodes.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={allSelected}
                        // indeterminate={selected.length > 0 && !allSelected}
                        onCheckedChange={checked => handleSelectAll(!!checked)}
                        aria-label="全选"
                      />
                    </TableHead>
                    <TableHead>节点名称</TableHead>
                    <TableHead>最大任务数量</TableHead>
                    <TableHead>任务数量</TableHead>
                    <TableHead>完成数量</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>内存</TableHead>
                    <TableHead>节点状态</TableHead>
                    <TableHead>更新时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes.map(node => (
                    <TableRow key={node.name}>
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(node.name)}
                          onCheckedChange={checked => handleSelectOne(node.name, !!checked)}
                          aria-label={`选择节点 ${node.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{node.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{node.maxTaskNum || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{node.running || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{node.finished || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{node.cpuNum || "N/A"} Cores</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {node.memNum ? `${parseFloat(node.memNum).toFixed(1)}%` : "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={node.state === '1' ? 'default' : node.state === '2' ? 'secondary' : 'destructive'}>
                          {getNodeStateText(node.state)}
                        </Badge>
                      </TableCell>
                      <TableCell>{node.updateTime || "N/A"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="h-8 bg-orange-100 text-orange-700 hover:bg-orange-200" asChild>
                          <Link to={r(NODE_PLUGINS_ROUTE, { variables: { nodeName: node.name } })}>
                            <Plug className="w-4 h-4 mr-1" />
                            插件
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 bg-green-100 text-green-700 hover:bg-green-200" asChild>
                          <Link to={r(NODE_LOG_ROUTE, { variables: { nodeName: node.name } })}>
                            <FileText className="w-4 h-4 mr-1" />
                            日志
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                确定要删除节点 {node.name} 吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteOne(node.name)}
                                disabled={fetcher.state !== "idle"}
                              >
                                {fetcher.state !== "idle" ? <span className="animate-spin">加载中</span> : "删除"}
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyPlaceholder 
                icon={<Server className="h-12 w-12 text-muted-foreground" />}
                title="没有节点"
                description="系统中当前没有配置任何扫描节点。" 
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
