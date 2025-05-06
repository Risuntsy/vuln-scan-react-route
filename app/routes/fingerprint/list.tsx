import { useLoaderData, useSearchParams, type LoaderFunctionArgs, Link, useFetcher, Form, useRevalidator } from "react-router";
import { getToken, getSearchParams, r } from "#/lib";
import { getFingerprintData, deleteFingerprintData, addFingerprintData, updateFingerprintData, type FingerprintData, type FingerprintAddData } from "#/api";
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
  DialogDescription
} from "#/components";
import { Plus, Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

const PAGE_SIZES = [10, 20, 50];

const initialFormData: FingerprintAddData & { id?: string } = {
    name: "",
    rule: "",
    category: "",
    parent_category: "",
    state: true,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const { pageIndex, pageSize, search = "" } = getSearchParams(request, {
    pageIndex: 1,
    pageSize: PAGE_SIZES[0],
    search: ""
  });

  try {
    const { list, total } = await getFingerprintData({ pageIndex, pageSize, search, token });

    return {
      success: true,
      fingerprints: list || [],
      total: total || 0,
      pageIndex,
      pageSize,
      search,
      message: "ok"
    };
  } catch (error) {
    console.error("Failed to load fingerprints:", error);
    return {
      success: false,
      fingerprints: [],
      total: 0,
      pageIndex: 1,
      pageSize: PAGE_SIZES[0],
      search: "",
      message: "无法加载指纹列表"
    };
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const [formData, token] = await Promise.all([request.json(), getToken(request)]);
  const { _action, ...data } = formData;

  if (_action === "delete") {
    const { fingerprintId } = data;
    if (!fingerprintId) {
      return { success: false, message: "缺少指纹ID" };
    }
    try {
      await deleteFingerprintData({ ids: [fingerprintId], token });
      return { success: true, message: "指纹删除成功", action: _action };
    } catch (error) {
      console.error("Failed to delete fingerprint:", error);
      return { success: false, message: "删除指纹失败", action: _action };
    }
  }

  if (_action === "save") {
     const { id, ...saveData } = data as FingerprintData;
     try {
         if (id) {
             await updateFingerprintData({ ...saveData, id, token });
             return { success: true, message: "指纹更新成功", action: _action };
         } else {
             await addFingerprintData({ ...saveData, token });
             return { success: true, message: "指纹创建成功", action: _action };
         }
     } catch (error) {
         console.error("Failed to save fingerprint:", error);
         return { success: false, message: id ? "更新指纹失败" : "创建指纹失败", action: _action };
     }
  }

  return { success: false, message: "无效操作" };
}

export default function FingerprintListPage() {
  const initialData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const revalidator = useRevalidator();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FingerprintAddData & { id?: string }>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);

  const { fingerprints, total, pageIndex, pageSize, search, success, message } = initialData;

  useEffect(() => {
      if (fetcher.data?.success && fetcher.state === 'idle') {
          setIsDialogOpen(false);
      }
      if (!fetcher.data?.success && fetcher.data?.message && fetcher.state === 'idle' && fetcher.data?.action === 'save') {
         setFormError(fetcher.data.message);
      } else {
          setFormError(null);
      }
  }, [fetcher.data, fetcher.state]);

  const handleOpenDialog = (fingerprint?: FingerprintData) => {
    setFormData(fingerprint ? { ...fingerprint } : initialFormData);
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, state: checked }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.rule) {
      setFormError("名称和规则不能为空");
      return;
    }
    setFormError(null);
    fetcher.submit(
        { ...formData, _action: "save" },
        { method: "post", encType: "application/json" }
    );
  };

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

  if (!success && fingerprints.length === 0) {
    return <Alert variant="destructive">{message}</Alert>;
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "Dashboard", href: DASHBOARD_ROUTE }, { name: "指纹资产" }]}>
        <div className="flex flex-col gap-4 w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">指纹资产</h1>
            <p className="text-muted-foreground text-sm">管理Web指纹信息</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
             <Form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
               <Input name="search" placeholder="搜索名称或规则..." defaultValue={search} className="w-full sm:w-64"/>
               <Button type="submit">搜索</Button>
             </Form>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  新建指纹
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{formData.id ? "编辑指纹" : "新建指纹"}</DialogTitle>
                  <DialogDescription/>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                   {formError && <Alert variant="destructive">{formError}</Alert>}
                  <CustomFormField name="name" label="名称" required>
                    <Input name="name" value={formData.name} onChange={handleInputChange} required />
                  </CustomFormField>
                  <CustomFormField name="rule" label="规则" required>
                    <Input name="rule" value={formData.rule} onChange={handleInputChange} required/>
                  </CustomFormField>
                  <CustomFormField name="category" label="类型">
                    <Input name="category" value={formData.category} onChange={handleInputChange} />
                  </CustomFormField>
                  <CustomFormField name="parent_category" label="归类">
                    <Input name="parent_category" value={formData.parent_category} onChange={handleInputChange} />
                  </CustomFormField>
                  <CustomFormField name="state" label="状态" className="items-center">
                    <Switch
                        id="state"
                        name="state"
                        checked={formData.state}
                        onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="state" className="ml-2">{formData.state ? "启用" : "禁用"}</Label>
                  </CustomFormField>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="outline">取消</Button>
                  </DialogClose>
                  <Button onClick={handleSubmit} disabled={fetcher.state !== "idle"}>
                    {fetcher.state !== "idle" && fetcher.data?.action === 'save' ? "保存中..." : "保存"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 flex-col overflow-hidden m-6 p-2">
        {fetcher.data && fetcher.data.action === 'delete' && (
          <Alert variant={fetcher.data.success ? "default" : "destructive"} className="mb-4">
            {fetcher.data.message}
          </Alert>
        )}
        <div className="flex-1 overflow-y-auto">
          <Table className="h-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[200px]">名称</TableHead>
                <TableHead>规则</TableHead>
                <TableHead className="w-[150px]">类型</TableHead>
                <TableHead className="w-[150px]">归类</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="w-[180px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fingerprints.length > 0 ? (
                fingerprints.map(fp => (
                  <React.Fragment key={fp.id}>
                    <TableRow>
                      <TableCell className="font-medium max-w-[200px] truncate">{fp.name}</TableCell>
                      <TableCell className="max-w-[400px] truncate" title={fp.rule}>{fp.rule}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{fp.category}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{fp.parent_category}</TableCell>
                      <TableCell>
                        <Badge variant={fp.state ? "default" : "secondary"}>{fp.state ? "启用" : "禁用"}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                         <Button variant="outline" size="sm" className="h-8" onClick={() => handleOpenDialog(fp)}>
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
                              <AlertDialogDescription>确定要删除指纹 [{fp.name}] 吗？此操作无法撤销。</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  fetcher.submit(
                                    { fingerprintId: fp.id, _action: "delete" },
                                    { method: "post", encType: "application/json" }
                                  )
                                }
                                disabled={fetcher.state !== "idle"}
                              >
                                {fetcher.state !== "idle" && fetcher.data?.action === 'delete' ? "删除中..." : "删除"}
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
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    {search ? `没有找到 "${search}" 相关的指纹信息。`: "没有找到指纹信息。"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationControls
          pageIndex={pageIndex}
          pageSize={pageSize}
          total={total}
          setSearchParams={setSearchParams}
        />
      </Card>
    </div>
  );
}
