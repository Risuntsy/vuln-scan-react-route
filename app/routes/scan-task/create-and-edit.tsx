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
import { AlertCircle, ArrowLeft, Play } from "lucide-react";

import { getToken, r } from "#/lib";
import { getNodeDataOnline, getTemplateData, addTask, getTaskDetail } from "#/api";
import { SCAN_TASKS_ROUTE } from "#/routes";
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
  CustomRadioGroup,
  Header,
  CustomSelect,
  Alert,
  AlertDescription
} from "#/components";
import { MultipleSelector } from "#/components";

const formSchema = z.object({
  name: z.string().min(1, "任务名称不能为空"),
  target: z.string().min(1, "目标不能为空"),
  ignore: z.string().default(""),
  allNode: z.boolean().default(true),
  node: z.array(z.string()),
  scheduledTasks: z.boolean().default(false),
  duplicates: z.enum(["None", "subdomain"]).default("None"),
  template: z.string(),
  hour: z.number().default(24),
  tp: z.string().default("scan"),
  targetTp: z.string().default("select"),
  search: z.string().default(""),
  filter: z.record(z.string(), z.any()).default({}),
  targetNumber: z.number().default(0),
  targetIds: z.array(z.string()).default([])
});

const deduplicationOptions: { label: string; value: "None" | "subdomain" }[] = [
  { label: "None", value: "None" },
  { label: "子域名", value: "subdomain" }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);

  const [nodeData, templateData] = await Promise.all([getNodeDataOnline({ token }), getTemplateData({ token })]);

  return {
    nodeList: nodeData.list.map((nodeName: string) => ({ label: nodeName, value: nodeName })),
    templateList: templateData.list.map(({ name, id }: { name: string; id: string }) => ({
      label: name,
      value: id
    }))
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const [token, rawData] = await Promise.all([getToken(request), request.json()]);
  const { data, error: parseError } = formSchema.safeParse(rawData);

  if (parseError) {
    return { success: false, message: parseError.message };
  }

  try {
    await addTask({
      ...data,
      token
    });
  } catch (error: any) {
    return { success: false, message: error?.message || "未知错误" };
  }

  return redirect(SCAN_TASKS_ROUTE);
}
export default function CreateScanTaskPage() {
  const isCreateTask = useLocation().pathname.endsWith("create");

  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { success, message } = useActionData<typeof action>() || {};
  const submit = useSubmit();
  const { nodeList, templateList } = useLoaderData<typeof loader>();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      target: "",
      ignore: "",
      template: "",
      node: [],
      scheduledTasks: false,
      duplicates: "None",
      tp: "scan",
      targetTp: "select"
    }
  });

  return (
    <div className="flex flex-col h-full">
      <Header
        routes={[
          { name: "仪表盘", href: r("/") },
          { name: "扫描任务", href: SCAN_TASKS_ROUTE },
          { name: "新建扫描任务" }
        ]}
      >
        <div className="flex items-center">
          <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="mr-4 hover:cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">新建扫描任务</h1>
            <p className="text-muted-foreground">创建新的漏洞扫描任务</p>
          </div>
        </div>
      </Header>

      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>任务配置</CardTitle>
            <CardDescription>配置扫描任务的基本信息和目标</CardDescription>
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
              <CustomFormField name="name" label="任务名称" required>
                <Input
                  placeholder="请输入任务名称"
                  name="name"
                  defaultValue={form.getValues("name")}
                  onChange={e => form.setValue("name", e.target.value)}
                />
              </CustomFormField>

              <CustomFormField name="target" label="目标" required>
                <Textarea
                  placeholder={`请输入目标，一行一个
192.168.1.1-192.168.1.253
192.168.1.1/24
example.com`}
                  className="min-h-[100px]"
                  name="target"
                  defaultValue={form.getValues("target")}
                  onChange={e => form.setValue("target", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">支持IP段、CIDR格式和域名，每行一个目标</p>
              </CustomFormField>

              <CustomFormField name="ignore" label="忽略目标">
                <Textarea
                  placeholder={`请输入要忽略的目标，一行一个
192.168.1.1-192.168.1.253
192.168.1.1/24
*.example.com`}
                  className="min-h-[100px]"
                  name="ignore"
                  defaultValue={form.getValues("ignore")}
                  onChange={e => form.setValue("ignore", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">域名格式需要加通配符，否则进行全等判断</p>
              </CustomFormField>

              <CustomFormField name="node" label="节点">
                <MultipleSelector
                  options={nodeList}
                  value={form.watch("node").map(node => ({ label: node, value: node }))}
                  onChange={value => {
                    form.setValue(
                      "node",
                      value.map(item => item.value)
                    );
                  }}
                  disabled={nodeList.length === 0 || form.watch("allNode")}
                  emptyIndicator={
                    <p className="text-sm text-muted-foreground">
                      {nodeList.length === form.watch("node").length ? "已选择所有节点" : "无在线节点"}
                    </p>
                  }
                />
              </CustomFormField>

              <CustomFormSection>
                <CustomSwitchOption
                  label="自动加入节点"
                  checked={form.watch("allNode")}
                  onChange={checked => form.setValue("allNode", checked)}
                />
                <CustomSwitchOption
                  label="定时任务"
                  checked={form.watch("scheduledTasks")}
                  onChange={checked => form.setValue("scheduledTasks", checked)}
                />
              </CustomFormSection>

              <CustomFormField name="duplicates" label="去重">
                <CustomRadioGroup
                  id="duplicates"
                  checked={form.watch("duplicates")}
                  onChange={value => form.setValue("duplicates", value)}
                  options={deduplicationOptions}
                />
              </CustomFormField>

              <CustomFormField name="template" label="扫描模板">
                <CustomSelect
                  name="template"
                  options={templateList}
                  defaultValue={form.watch("template")}
                  value={form.watch("template")}
                  placeholder="选择扫描模板"
                  title="扫描模板"
                  onChange={value => form.setValue("template", value)}
                />
              </CustomFormField>

              <Button type="submit" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                开始扫描
              </Button>
            </fetcher.Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
