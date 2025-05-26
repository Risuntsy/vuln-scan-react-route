import { useLoaderData, useSearchParams, type LoaderFunctionArgs, Link, useFetcher } from "react-router";
import { getToken, getSearchParams, r, sleep, cn } from "#/lib";
import { getTemplateData, deleteTemplateDetail } from "#/api";
import { DASHBOARD_ROUTE, TEMPLATE_CREATE_ROUTE, TEMPLATE_EDIT_ROUTE } from "#/routes";
import {
  Button,
  Card,
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
  PaginationControls
} from "#/components";
import { Plus, Pencil, Trash2 } from "lucide-react";
import React from "react";

const PAGE_SIZES = [10, 20, 50];

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const { pageIndex, pageSize } = getSearchParams(request, {
    pageIndex: 1,
    pageSize: PAGE_SIZES[0]
  });

  try {
    const { list, total } = await getTemplateData({ pageIndex, pageSize, token });

    return {
      success: true,
      templates: list || [],
      total: total || 0,
      pageIndex,
      pageSize,
      message: "ok"
    };
  } catch (error) {
    return {
      success: false,
      message: "无法加载模板列表"
    };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const [{ templateId, _action: action }, token] = await Promise.all([request.json(), getToken(request)]);

  if (action === "delete") {
    if (!templateId) {
      return { success: false, message: "缺少模板ID" };
    }

    try {
      await deleteTemplateDetail({ ids: [templateId], token });
      return { success: true, message: "模板删除成功" };
    } catch (error) {
      return { success: false, message: "删除模板失败" };
    }
  }

  return { success: false, message: "无效操作" };
}

export default function ScanTemplatePage() {
  const { templates, total, pageIndex, pageSize, success, message } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetcher = useFetcher();

  if (!success || !templates) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  return (
    <div className="flex flex-1 flex-col h-full p-4 space-y-4">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "扫描模板" }]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">扫描模板</h1>
            <p className="text-muted-foreground text-sm mt-1">管理扫描任务使用的模板</p>
          </div>
          <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link to={TEMPLATE_CREATE_ROUTE}>
              <Plus className="w-4 h-4 mr-2" />
              新建模板
            </Link>
          </Button>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-hidden shadow-lg">
        <div className="flex-1 overflow-auto p-4">
          {templates.length > 0 ? (
            <ul className="space-y-3">
              {templates.map(template => (
                <li
                  key={template.id}
                  className="flex items-center justify-between p-3 bg-background rounded-md border border-border hover:border-primary transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-lg">
                      {template.name || "-"} <span className="text-sm text-muted-foreground">(ID: {template.id})</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 shadow-sm hover:shadow transition-shadow"
                      asChild
                    >
                      <Link to={r(TEMPLATE_EDIT_ROUTE, { variables: { templateId: template.id } })}>
                        <Pencil className="w-4 h-4 mr-2" />
                        编辑
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 shadow-sm hover:shadow transition-shadow"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg font-bold">确认删除</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            确定要删除 "{template.name}" 模板吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="space-x-2">
                          <AlertDialogCancel className="shadow-sm hover:shadow transition-shadow">
                            取消
                          </AlertDialogCancel>
                          <AlertDialogAction>
                            <Button
                              onClick={() =>
                                fetcher.submit(
                                  { templateId: template.id, _action: "delete" },
                                  { method: "post", encType: "application/json" }
                                )
                              }
                              disabled={fetcher.state !== "idle"}
                              className={cn(
                                "shadow-sm hover:shadow transition-shadow",
                                fetcher.state !== "idle" && "animate-pulse"
                              )}
                            >
                              删除
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-32 flex items-center justify-center text-muted-foreground">没有找到扫描模板。</div>
          )}
        </div>

        <PaginationControls pageIndex={pageIndex} pageSize={pageSize} total={total} setSearchParams={setSearchParams} />
      </Card>
    </div>
  );
}
