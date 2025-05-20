import {
  useLoaderData,
  useSearchParams,
  type LoaderFunctionArgs,
  useFetcher,
  Form,
  useRevalidator
} from "react-router";
import { getToken, getSearchParams, r, cn } from "#/lib";
import {
  getSensitiveData,
  deleteSensitiveData,
  addSensitiveData,
  updateSensitiveData,
  updateSensitiveState,
  type SensitiveData,
  type SensitiveAddData
} from "#/api/sensitive";
import { DASHBOARD_ROUTE } from "#/routes";
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
  Badge,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Input,
  Label,
  Switch,
  CustomFormField,
  DialogDescription,
  SelectTrigger,
  Select,
  SelectItem,
  SelectContent,
  SelectValue
} from "#/components";
import { Plus, Pencil, Trash2, Power } from "lucide-react";
import React, { useState, useEffect } from "react";
import { successToast, errorToast } from "#/components/custom/toast";

const PAGE_SIZES = [10, 20, 50];

const initialFormData: SensitiveAddData & { id?: string } = {
  name: "",
  regular: "",
  color: "#000000",
  state: true
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const {
    pageIndex,
    pageSize,
    search = ""
  } = getSearchParams(request, {
    pageIndex: 1,
    pageSize: PAGE_SIZES[0],
    search: ""
  });

  try {
    const { list, total } = await getSensitiveData({ pageIndex, pageSize, search, token });

    return {
      success: true,
      sensitiveRules: list || [],
      total: total || 0,
      pageIndex,
      pageSize,
      search,
      message: "ok"
    };
  } catch (error) {
    console.error("Failed to load sensitive rules:", error);
    return {
      success: false,
      sensitiveRules: [],
      total: 0,
      pageIndex: 1,
      pageSize: PAGE_SIZES[0],
      search: "",
      message: "无法加载敏感信息规则列表"
    };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const [formData, token] = await Promise.all([request.json(), getToken(request)]);
  const { _action, ...data } = formData;

  if (_action === "delete") {
    const { sensitiveId } = data;
    if (!sensitiveId) {
      return { success: false, message: "缺少规则ID" };
    }
    try {
      await deleteSensitiveData({ ids: [sensitiveId], token });
      return { success: true, message: "规则删除成功", action: _action };
    } catch (error) {
      console.error("Failed to delete sensitive rule:", error);
      return { success: false, message: "删除规则失败", action: _action };
    }
  }

  if (_action === "save") {
    const { id, ...saveData } = data as SensitiveAddData & { id?: string };
    try {
      if (id) {
        await updateSensitiveData({
          id,
          name: saveData.name,
          regular: saveData.regular,
          color: saveData.color,
          state: saveData.state,
          token
        });
        return { success: true, message: "规则更新成功", action: _action };
      } else {
        await addSensitiveData({
          name: saveData.name,
          regular: saveData.regular,
          color: saveData.color,
          state: saveData.state,
          token
        });
        return { success: true, message: "规则创建成功", action: _action };
      }
    } catch (error) {
      console.error("Failed to save sensitive rule:", error);
      return { success: false, message: id ? "更新规则失败" : "创建规则失败", action: _action };
    }
  }

  if (_action === "toggleState") {
    const { id, state } = data;
    if (!id) {
      return { success: false, message: "缺少规则ID" };
    }
    try {
      await updateSensitiveState({ ids: [id], state, token });
      return { success: true, message: "规则状态更新成功", action: _action, state };
    } catch (error) {
      console.error("Failed to update sensitive rule state:", error);
      return { success: false, message: "更新规则状态失败", action: _action };
    }
  }

  return { success: false, message: "无效操作" };
}

export default function SensitiveRuleListPage() {
  const initialData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<SensitiveAddData & { id?: string }>(initialFormData);

  const { sensitiveRules, total, pageIndex, pageSize, search, success, message } = initialData;

  const handleOpenDialog = (rule?: SensitiveData) => {
    setFormData(
      rule
        ? {
            name: rule.name,
            regular: rule.regular,
            color: rule.color,
            state: rule.state,
            id: rule.id
          }
        : initialFormData
    );
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, state: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.regular) {
      return;
    }
    await fetcher.submit({ ...formData, _action: "save" }, { method: "post", encType: "application/json" });
  };

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        successToast(fetcher.data?.message || "操作成功");
      } else {
        errorToast(fetcher.data?.message || "操作失败");
      }
    }
  }, [fetcher.data]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSearch = formData.get("search") as string;
    setSearchParams(prev => {
      prev.set("search", newSearch);
      prev.set("pageIndex", "1");
      return prev;
    });
  };

  const handleToggleState = async (id: string, currentState: boolean) => {
    await fetcher.submit(
      { id, state: !currentState, _action: "toggleState" },
      { method: "post", encType: "application/json" }
    );
  };

  if (!success && sensitiveRules.length === 0) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "敏感信息规则" }]}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">敏感信息规则</h1>
            <p className="text-muted-foreground text-sm">管理敏感信息规则</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
              <Input name="search" placeholder="搜索名称或规则..." defaultValue={search} className="w-full sm:w-64" />
              <Button type="submit">搜索</Button>
            </Form>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  新建规则
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{formData.id ? "编辑规则" : "新建规则"}</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <CustomFormField name="name" label="名称" required>
                    <Input name="name" value={formData.name} onChange={handleInputChange} required />
                  </CustomFormField>
                  <CustomFormField name="regular" label="规则" required>
                    <Input name="regular" value={formData.regular} onChange={handleInputChange} required />
                  </CustomFormField>
                  <CustomFormField name="color" label="颜色">
                    <Select name="color" value={formData.color} onValueChange={(e)=>{
                      setFormData(prev => ({ ...prev, color: e }));
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择颜色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="green">绿色</SelectItem>
                        <SelectItem value="red">红色</SelectItem>
                        <SelectItem value="cyan">青色</SelectItem>
                        <SelectItem value="yellow">黄色</SelectItem>
                        <SelectItem value="orange">橙色</SelectItem>
                        <SelectItem value="gray">灰色</SelectItem>
                        <SelectItem value="pink">粉色</SelectItem>
                      </SelectContent>
                    </Select>
                  </CustomFormField>
                  <CustomFormField name="state" label="状态" className="items-center">
                    <Switch id="state" name="state" checked={formData.state} onCheckedChange={handleSwitchChange} />
                    <Label htmlFor="state" className="ml-2">
                      {formData.state ? "启用" : "禁用"}
                    </Label>
                  </CustomFormField>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">取消</Button>
                  </DialogClose>
                  <Button onClick={handleSubmit} disabled={fetcher.state !== "idle"}>
                    {fetcher.state !== "idle" && fetcher.data?.action === "save" ? "保存中..." : "保存"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 flex-col overflow-hidden m-6 p-2">
        <div className="flex-1 overflow-y-auto">
          <Table className="h-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[200px]">名称</TableHead>
                <TableHead>规则</TableHead>
                <TableHead className="w-[100px]">颜色</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[180px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensitiveRules.length > 0 ? (
                sensitiveRules.map(rule => (
                  <React.Fragment key={rule.id}>
                    <TableRow>
                      <TableCell className="font-medium max-w-[200px] truncate">{rule.name}</TableCell>
                      <TableCell className="max-w-[400px] truncate" title={rule.regular}>
                        {rule.regular}
                      </TableCell>
                      <TableCell>
                        <div className={cn("w-6 h-6 rounded-full")} style={{ backgroundColor: rule.color }} />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.state}
                          onCheckedChange={async () => await handleToggleState(rule.id, rule.state)}
                          disabled={fetcher.state !== "idle"}
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="h-8" onClick={() => handleOpenDialog(rule)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          编辑
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
                                确定要删除规则 [{rule.name}] 吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  fetcher.submit(
                                    { sensitiveId: rule.id, _action: "delete" },
                                    { method: "post", encType: "application/json" }
                                  )
                                }
                                disabled={fetcher.state !== "idle"}
                              >
                                {fetcher.state !== "idle" && fetcher.data?.action === "delete" ? "删除中..." : "删除"}
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {search ? `没有找到 "${search}" 相关的规则信息。` : "没有找到规则信息。"}
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
