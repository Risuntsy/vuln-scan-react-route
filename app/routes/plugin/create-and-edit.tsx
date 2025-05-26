import {
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useActionData,
  useSubmit,
  useFetcher,
  redirect,
  useNavigate,
  useLocation
} from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { AlertCircle, ArrowLeft, Save, Plus } from "lucide-react";

import { getToken, r } from "#/lib";
import { PLUGINS_ROUTE, DASHBOARD_ROUTE } from "#/routes";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CustomFormField,
  CustomFormSection,
  CustomSwitchOption,
  Header,
  Alert,
  AlertDescription
} from "#/components";

// Form schema for plugin creation/editing
const formSchema = z.object({
  name: z.string().min(1, "插件名称不能为空"),
  module: z.string().min(1, "模块名称不能为空"),
  parameters: z.string().default(""),
  paramDesc: z.string().default(""),
  version: z.string().min(1, "版本号不能为空"),
  description: z.string().default(""),
  sourceCode: z.string().min(1, "源代码不能为空"),
  isSystem: z.boolean().default(false)
});

// Placeholder loader function
export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const pluginId = params.pluginId;
  
  // Mock data for demonstration purposes
  // In a real implementation, you would fetch data from an API
  const pluginData = pluginId 
    ? {
        name: "测试插件",
        module: "test_module",
        parameters: "target, port=80",
        paramDesc: "target: 目标地址\nport: 端口号，默认80",
        version: "1.0.0",
        description: "这是一个测试插件，用于演示创建和编辑插件页面",
        sourceCode: `
# -*- coding: utf-8 -*-
import requests

def run(target, port=80):
    url = f"http://{target}:{port}"
    try:
        response = requests.get(url, timeout=5)
        return {
            "status": "success",
            "code": response.status_code,
            "content": response.text[:100]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
`,
        isSystem: false
      }
    : null;

  return {
    pluginData,
    isEditMode: !!pluginId
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const [token, rawData] = await Promise.all([getToken(request), request.json()]);
  const { data, error: parseError } = formSchema.safeParse(rawData);

  if (parseError) {
    return { success: false, message: parseError.errors.map(e => e.message).join(", ") };
  }

  return redirect(PLUGINS_ROUTE);
}

export default function PluginCreateEditPage() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { pluginData, isEditMode } = useLoaderData<typeof loader>();
  const { success, message } = useActionData<typeof action>() || {};
  const submit = useSubmit();

  // Initialize form with data (if editing) or defaults (if creating)
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: pluginData || {
      name: "",
      module: "",
      parameters: "",
      paramDesc: "",
      version: "1.0.0",
      description: "",
      sourceCode: "",
      isSystem: false
    }
  });

  const pageTitle = isEditMode ? "编辑插件" : "新建插件";

  return (
    <div className="flex flex-col h-full">
      <Header
        routes={[
          { name: "仪表盘", href: DASHBOARD_ROUTE },
          { name: "插件管理", href: PLUGINS_ROUTE },
          { name: pageTitle }
        ]}
      >
        <div className="flex items-center">
          <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="mr-4 hover:cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">{isEditMode ? "编辑现有插件" : "创建新的漏洞扫描插件"}</p>
          </div>
        </div>
      </Header>

      <div className="p-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>插件配置</CardTitle>
            <CardDescription>配置插件的基本信息和源代码</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert variant="destructive" className="mb-4 sticky top-0">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <fetcher.Form
              method="post"
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                submit(form.getValues(), { method: "post", encType: "application/json" });
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomFormField name="name" label="插件名称" required>
                  <Input
                    placeholder="请输入插件名称"
                    name="name"
                    defaultValue={form.getValues("name")}
                    onChange={e => form.setValue("name", e.target.value)}
                  />
                </CustomFormField>

                <CustomFormField name="module" label="模块" required>
                  <Input
                    placeholder="请输入模块名称"
                    name="module"
                    defaultValue={form.getValues("module")}
                    onChange={e => form.setValue("module", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">插件的模块名称，用于引用</p>
                </CustomFormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomFormField name="parameters" label="参数">
                  <Textarea
                    placeholder="请输入参数，例如：target, port=80"
                    className="min-h-[100px]"
                    name="parameters"
                    defaultValue={form.getValues("parameters")}
                    onChange={e => form.setValue("parameters", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">参数列表，使用逗号分隔，可设置默认值</p>
                </CustomFormField>

                <CustomFormField name="paramDesc" label="参数说明">
                  <Textarea
                    placeholder="参数的详细说明，例如：
target: 目标地址
port: 端口号，默认80"
                    className="min-h-[100px]"
                    name="paramDesc"
                    defaultValue={form.getValues("paramDesc")}
                    onChange={e => form.setValue("paramDesc", e.target.value)}
                  />
                </CustomFormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomFormField name="version" label="版本" required>
                  <Input
                    placeholder="请输入版本号，例如：1.0.0"
                    name="version"
                    defaultValue={form.getValues("version")}
                    onChange={e => form.setValue("version", e.target.value)}
                  />
                </CustomFormField>

                <CustomFormSection>
                  <CustomSwitchOption
                    label="系统插件"
                    checked={form.watch("isSystem")}
                    onChange={checked => form.setValue("isSystem", checked)}
                  />
                  <p className="text-sm text-muted-foreground ml-9">系统插件无法被修改或删除{isEditMode && pluginData?.isSystem ? "（此插件为系统插件）" : ""}</p>
                </CustomFormSection>
              </div>

              <CustomFormField name="description" label="简介">
                <Textarea
                  placeholder="请输入插件的简要描述"
                  className="min-h-[100px]"
                  name="description"
                  defaultValue={form.getValues("description")}
                  onChange={e => form.setValue("description", e.target.value)}
                />
              </CustomFormField>

              <CustomFormField name="sourceCode" label="源码" required>
                <Textarea
                  placeholder="请输入插件源代码"
                  className="min-h-[300px] font-mono"
                  name="sourceCode"
                  defaultValue={form.getValues("sourceCode")}
                  onChange={e => form.setValue("sourceCode", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Python格式的插件源代码</p>
              </CustomFormField>

              <Button type="submit" className="w-full">
                {isEditMode ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    保存插件
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    创建插件
                  </>
                )}
              </Button>
            </fetcher.Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
