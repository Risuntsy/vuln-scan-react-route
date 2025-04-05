import {
  useLoaderData,
  useSearchParams,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useFetcher
} from "react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getToken, getSearchParams } from "#/lib";
import {
  getTemplateData,
  getTemplateDetail,
  deleteTemplateDetail,
  saveTemplateDetail,
  getPluginDataByModule,
  type TemplateDetail,
  type PluginData
} from "#/api";
import { DASHBOARD_ROUTE } from "#/routes";
import {
  Button,
  Input,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  CustomFormField,
  Alert,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Header,
  CustomSwitchOption,
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
import { Plus, MoreHorizontal, Pencil, Trash2, AlertCircle, Loader2, Divide } from "lucide-react";
import React from "react";

const PAGE_SIZES = [10, 20, 50];

type Module = keyof TemplateDetail["Parameters"];

const modules = [
  "TargetHandler",
  "SubdomainScan",
  "SubdomainSecurity",
  "PortScanPreparation",
  "PortScan",
  "PortFingerprint",
  "AssetMapping",
  "AssetHandle",
  "URLScan",
  "WebCrawler",
  "URLSecurity",
  "DirScan",
  "VulnerabilityScan"
] as const;

type ModuleType = (typeof modules)[number];

const templateFormSchema = z.object({
  id: z.string().optional(),
  result: z.object({
    name: z.string(),
    TargetHandler: z.array(z.string()),
    Parameters: z.object({
      TargetHandler: z.record(z.string(), z.string()),
      SubdomainScan: z.record(z.string(), z.string()),
      SubdomainSecurity: z.record(z.string(), z.string()),
      PortScanPreparation: z.record(z.string(), z.string()),
      PortScan: z.record(z.string(), z.string()),
      PortFingerprint: z.record(z.string(), z.string()),
      AssetMapping: z.record(z.string(), z.string()),
      AssetHandle: z.record(z.string(), z.string()),
      URLScan: z.record(z.string(), z.string()),
      WebCrawler: z.record(z.string(), z.string()),
      URLSecurity: z.record(z.string(), z.string()),
      DirScan: z.record(z.string(), z.string()),
      VulnerabilityScan: z.record(z.string(), z.string())
    }),
    SubdomainScan: z.array(z.string()),
    SubdomainSecurity: z.array(z.string()),
    PortScanPreparation: z.array(z.string()),
    PortScan: z.array(z.string()),
    PortFingerprint: z.array(z.string()),
    AssetMapping: z.array(z.string()),
    AssetHandle: z.array(z.string()),
    URLScan: z.array(z.string()),
    WebCrawler: z.array(z.string()),
    URLSecurity: z.array(z.string()),
    DirScan: z.array(z.string()),
    VulnerabilityScan: z.array(z.string()),
    vullist: z.array(z.string())
  })
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await getToken(request);
  const { pageIndex, pageSize } = getSearchParams(request, {
    pageIndex: 1,
    pageSize: PAGE_SIZES[0]
  });

  try {
    const { list, total } = await getTemplateData({ pageIndex, pageSize, token });

    const plugins: Record<ModuleType, PluginData[]> = {} as Record<ModuleType, PluginData[]>;

    for (const module of modules) {
      const { list: pluginList } = await getPluginDataByModule({ module, token });
      plugins[module] = pluginList;
    }

    return {
      success: true,
      templates: list,
      total,
      pageIndex,
      pageSize,
      plugins,
      message: "ok"
    };
  } catch (error) {
    console.error("Failed to load templates:", error);
    return {
      success: false,
      message: "无法加载模板列表"
    };
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const [token, requestBody] = await Promise.all([getToken(request), request.json()]);
  const { _action: actionType, data } = requestBody;

  try {
    switch (actionType) {
      case "create":
      case "update": {
        if (actionType === "update" && data.id) {
          await saveTemplateDetail({ ...data, token });
          return { success: true, message: "模板更新成功" };
        } else {
          await saveTemplateDetail({ ...data, token });
          return { success: true, message: "模板创建成功" };
        }
      }
      case "delete": {
        const templateId = data.templateId as string;
        if (!templateId) {
          return { success: false, message: "缺少模板ID" };
        }
        await deleteTemplateDetail({ ids: [templateId], token });
        return { success: true, message: "模板删除成功", deletedId: templateId };
      }
      default:
        return { success: false, message: "无效操作" };
    }
  } catch (error: any) {
    console.error(`Action ${actionType} failed:`, error);
    return {
      success: false,
      message:
        error?.message || `${actionType === "delete" ? "删除" : actionType === "update" ? "更新" : "创建"}模板失败`
    };
  }
}

export default function ScanTemplatePage() {
  const { templates, total, pageIndex, pageSize, plugins, success, message } = useLoaderData<typeof loader>();

  if (!success) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  if (!templates) {
    throw new Error("fuck");
  }

  function submitAction(action: string, data: any) {
    fetcher.submit({ _action: action, data }, { method: "post", encType: "application/json" });
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      id: undefined,
      result: {
        name: "",
        TargetHandler: [],
        Parameters: {
          TargetHandler: {},
          SubdomainScan: {},
          SubdomainSecurity: {},
          PortScanPreparation: {},
          PortScan: {},
          PortFingerprint: {},
          AssetMapping: {},
          AssetHandle: {},
          URLScan: {},
          WebCrawler: {},
          URLSecurity: {},
          DirScan: {},
          VulnerabilityScan: {}
        },
        SubdomainScan: [],
        SubdomainSecurity: [],
        PortScanPreparation: [],
        PortScan: [],
        PortFingerprint: [],
        AssetMapping: [],
        AssetHandle: [],
        URLScan: [],
        WebCrawler: [],
        URLSecurity: [],
        DirScan: [],
        VulnerabilityScan: [],
        vullist: []
      }
    }
  });

  const [dialogState, setDialogState] = useState<{
    mode: "create" | "edit";
    open: boolean;
  }>({
    mode: "create",
    open: false
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "扫描模板" }]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">扫描模板</h1>
            <p className="text-muted-foreground text-sm">管理扫描任务使用的模板</p>
          </div>
          <Button onClick={() => setDialogState({ mode: "create", open: true })}>
            <Plus className="w-4 h-4 mr-2" />
            新建模板
          </Button>
        </div>
      </Header>
      delete: {JSON.stringify(deleteDialogOpen)}
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
              {templates?.length > 0 ? (
                templates.map(template => (
                  <React.Fragment key={template.id}>
                    <TableRow>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => {
                            setDialogState({ mode: "edit", open: true });
                            form.reset({
                              id: template.id,
                              result: template
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          编辑
                        </Button>
                        <Button
                          onClick={() => {
                            submitAction("delete", { templateId: template.id });
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </Button>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    {fetcher.state !== "idle" ? (
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    ) : (
                      "没有找到扫描模板。"
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationControls pageIndex={pageIndex} pageSize={pageSize} total={total} setSearchParams={setSearchParams} />
      </Card>
      <TemplateFormDialog
        state={dialogState}
        onOpenChange={open => setDialogState({ ...dialogState, open })}
        plugins={plugins}
        fetcher={fetcher}
        form={form}
        submitAction={submitAction}
        setDialogState={setDialogState}
      />
    </div>
  );
}

function TemplateFormDialog({
  state,
  onOpenChange,
  plugins,
  fetcher,
  form,
  submitAction,
  setDialogState
}: TemplateFormDialogProps) {
  const { mode, open } = state;
  const { register, watch, setValue, handleSubmit } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "新建扫描模板" : "编辑扫描模板"}</DialogTitle>
          <DialogDescription>配置扫描模板的名称和包含的模块及插件参数。</DialogDescription>
        </DialogHeader>

        <div className="flex flex-1">
          <form className="space-y-4">
            <CustomFormField name="name" label="模板名称" required>
              <Input {...register("result.name")} />
            </CustomFormField>

            <div className="space-y-6">
              {modules.map(moduleName => {
                const selected = watch(`result.${moduleName}`);
                const modulePlugins = plugins[moduleName];
                return modulePlugins.length === 0 ? null : (
                  <div key={moduleName} className="space-y-3">
                    <h3 className="text-lg font-medium">{moduleName}</h3>
                    <div className="space-y-4 pl-2">
                      {modulePlugins.map(plugin => {
                        const isSelected = selected.includes(plugin.id);
                        return (
                          <div key={plugin.id} className="space-y-2">
                            <CustomSwitchOption
                              name={`${moduleName}-${plugin.id}`}
                              label={`${plugin.name}`}
                              checked={isSelected}
                              onChange={checked => {
                                setValue(`result.Parameters.${moduleName}.${plugin.id}`, plugin.parameter);
                                setValue(
                                  `result.${moduleName}`,
                                  checked ? [...selected, plugin.id] : selected.filter(id => id !== plugin.id)
                                );
                              }}
                            />
                            <Input
                              hidden={!isSelected}
                              placeholder={`${plugin.name} 参数`}
                              value={watch(`result.Parameters.${moduleName}.${plugin.id}`) || ""}
                              onChange={e => setValue(`result.Parameters.${moduleName}.${plugin.id}`, e.target.value)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </form>
        </div>

        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              取消
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit(data => {
              submitAction(mode, data);
            })}
          >
            {fetcher.state !== "idle" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "创建模板" : "保存更改"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PaginationControlsProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
}

function PaginationControls({ pageIndex, pageSize, total, setSearchParams }: PaginationControlsProps) {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams(prev => {
      prev.set("pageIndex", newPageIndex.toString());
      return prev;
    });
  };

  const handleSizeChange = (newPageSize: string) => {
    setSearchParams(prev => {
      prev.set("pageSize", newPageSize);
      prev.set("pageIndex", "1");
      return prev;
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sticky bottom-0 bg-background py-3 border-t px-6">
      <div className="text-sm text-muted-foreground">
        显示 {total > 0 ? (pageIndex - 1) * pageSize + 1 : 0}-
        {(pageIndex - 1) * pageSize + Math.min(pageSize, total - (pageIndex - 1) * pageSize)} 共 {total} 条记录
      </div>
      <div className="flex items-center space-x-2">
        <Select defaultValue={pageSize.toString()} onValueChange={handleSizeChange}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map(s => (
              <SelectItem key={s} value={s.toString()}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex <= 1}
            className="h-8"
          >
            上一页
          </Button>
          <span className="text-xs whitespace-nowrap">
            第 {pageIndex} 页 / 共 {totalPages > 0 ? totalPages : 1} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages}
            className="h-8"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  );
}

interface TemplateFormDialogProps {
  state: {
    mode: "create" | "edit";
    open: boolean;
  };
  setDialogState: (state: { mode: "create" | "edit"; open: boolean }) => void;
  onOpenChange: (open: boolean) => void;
  plugins: Record<ModuleType, PluginData[]>;
  fetcher: ReturnType<typeof useFetcher>;
  form: UseFormReturn<TemplateFormValues>;
  submitAction: (action: string, data: any) => void;
}
