import { useLoaderData, useSearchParams, type LoaderFunctionArgs, Link, useFetcher, Form } from "react-router";
import { getToken, getSearchParams, r } from "#/lib";
import { getPocData, deletePocData } from "#/api/poc/api";
import { DASHBOARD_ROUTE, POC_CREATE_ROUTE, POC_EDIT_ROUTE, POCS_ROUTE } from "#/routes";
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
  Input,
  Badge
} from "#/components";
import { Plus, Upload, Trash2, Pencil, FileSearch, ShieldAlert } from "lucide-react";
import React, { useEffect } from "react";
import { successToast, errorToast } from "#/components/custom/toast";
import { EmptyPlaceholder } from "#/components/custom/empty-placeholder";
import type { PocData } from "#/api/poc/entity";

const PAGE_SIZES = [10, 20, 50];

// Risk level badge styles
const RISK_LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  高危: { bg: "bg-red-100", text: "text-red-700" },
  中危: { bg: "bg-orange-100", text: "text-orange-700" },
  低危: { bg: "bg-yellow-100", text: "text-yellow-700" },
  信息: { bg: "bg-blue-100", text: "text-blue-700" },
  // Default style for unknown levels
  default: { bg: "bg-gray-100", text: "text-gray-700" }
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const { pageIndex, pageSize, search } = getSearchParams(request, {
    pageIndex: 1,
    pageSize: PAGE_SIZES[0],
    search: ""
  });

  try {
    const { list, total } = await getPocData({
      pageIndex,
      pageSize,
      search,
      filter: {}, // Empty filter object, could be expanded later
      token
    });

    return {
      success: true,
      pocs: list || [],
      total: total || 0,
      pageIndex,
      pageSize,
      search,
      message: "ok"
    };
  } catch (error) {
    console.error("Failed to load POCs:", error);
    return {
      success: false,
      message: "无法加载POC列表"
    };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const [{ ids, _action }, token] = await Promise.all([request.json(), getToken(request)]);

  if (!ids || !ids.length) {
    return { success: false, message: "缺少必要参数" };
  }

  try {
    switch (_action) {
      case "delete":
        await deletePocData({ ids, token });
        return { success: true, message: "POC删除成功" };
      default:
        return { success: false, message: "无效操作" };
    }
  } catch (error) {
    console.error(`Failed to ${_action} POC:`, error);
    return { success: false, message: `POC${_action === "delete" ? "删除" : "操作"}失败` };
  }
}

export default function PocListPage() {
  const { pocs, total, pageIndex, pageSize, search, success, message } = useLoaderData<typeof loader>();
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

  if (!success || !pocs) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  // Helper to render risk level badge with appropriate style
  const renderRiskLevel = (level: string) => {
    const style = RISK_LEVEL_STYLES[level] || RISK_LEVEL_STYLES.default;
    return (
      <Badge variant="outline" className={`${style.bg} ${style.text} border-none`}>
        {level}
      </Badge>
    );
  };

  // Helper to render tags list
  const renderTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return <span className="text-muted-foreground text-sm">无标签</span>;

    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "POC管理" }]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">POC管理</h1>
            <p className="text-muted-foreground text-sm">管理漏洞扫描POC</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              导入POC
            </Button>
            <Button asChild>
              <Link to={POC_CREATE_ROUTE}>
                <Plus className="w-4 h-4 mr-2" />
                新建POC
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
                placeholder="搜索POC名称或标签..."
                defaultValue={search}
                name="search"
                className="w-[300px]"
              />
              <Button type="submit">搜索</Button>
            </Form>
          </div>

          <div className="flex-1 overflow-auto">
            {pocs && pocs.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>POC名称</TableHead>
                    <TableHead>风险等级</TableHead>
                    <TableHead>标签</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="w-[200px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pocs.map((poc: PocData) => (
                    <TableRow key={poc.id}>
                      <TableCell className="font-medium">{poc.name}</TableCell>
                      <TableCell>{renderRiskLevel(poc.level)}</TableCell>
                      <TableCell>{renderTags(poc.tags)}</TableCell>
                      <TableCell>{poc.time}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="h-8" asChild>
                          <Link to={r(POC_EDIT_ROUTE, { variables: { pocId: poc.id } })}>
                            <Pencil className="w-4 h-4 mr-2" />
                            编辑
                          </Link>
                        </Button>
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
                                确定要删除 POC "{poc.name}" 吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  fetcher.submit(
                                    {
                                      ids: [poc.id],
                                      _action: "delete"
                                    },
                                    { method: "post", encType: "application/json" }
                                  )
                                }
                              >
                                删除
                              </AlertDialogAction>
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
                icon={<FileSearch className="h-12 w-12 text-muted-foreground" />}
                title="没有找到POC"
                description="系统中当前没有任何POC，或搜索条件无结果。"
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
