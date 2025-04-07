import { useLoaderData, useSearchParams, type LoaderFunctionArgs, Link, useFetcher, Form } from "react-router";
import { getToken, getSearchParams } from "#/lib";
import { getTemplateData, deleteTemplateDetail } from "#/api";
import { DASHBOARD_ROUTE, TEMPLATE_CREATE_ROUTE } from "#/routes";
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
    console.error("Failed to load templates:", error);
    return {
      success: false,
      message: "无法加载模板列表"
    };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const formData = await request.formData();
  const action = formData.get("_action") as string;

  if (action === "delete") {
    const templateId = formData.get("templateId") as string;
    if (!templateId) {
      return { success: false, message: "缺少模板ID" };
    }

    try {
      await deleteTemplateDetail({ ids: [templateId], token });
      return { success: true, message: "模板删除成功" };
    } catch (error) {
      console.error("Failed to delete template:", error);
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
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "扫描模板" }]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">扫描模板</h1>
            <p className="text-muted-foreground text-sm">管理扫描任务使用的模板</p>
          </div>
          <Button asChild>
            <Link to={TEMPLATE_CREATE_ROUTE}>
              <Plus className="w-4 h-4 mr-2" />
              新建模板
            </Link>
          </Button>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-hidden m-6 p-2">
        <div className="flex-1">
          <Table className="h-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>模板名称</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length > 0 ? (
                templates.map(template => (
                  <React.Fragment key={template.id}>
                    <TableRow>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="h-8" asChild>
                          <Link to={`edit/${template.id}`}>
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
                              <AlertDialogDescription>确定要删除此模板吗？此操作无法撤销。</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <Form method="post">
                                <input type="hidden" name="_action" value="delete" />
                                <input type="hidden" name="templateId" value={template.id} />
                                <AlertDialogAction type="submit">删除</AlertDialogAction>
                              </Form>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    没有找到扫描模板。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationControls pageIndex={pageIndex} pageSize={pageSize} total={total} setSearchParams={setSearchParams} />
      </Card>
    </div>
  );
}
