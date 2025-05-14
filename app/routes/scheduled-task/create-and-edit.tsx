import {
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useFetcher,
  redirect,
  useNavigate
} from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { AlertCircle, ArrowLeft, Save } from "lucide-react";

import { getToken, r } from "#/lib";
import { getNodeDataOnline, updateScheduledTaskPageMonit, getScheduleTaskDetail } from "#/api";
import { SCHEDULED_TASK_ROUTE, SCHEDULED_TASKS_ROUTE } from "#/routes";
import {
  Button,
  Input,
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
  AlertDescription,
  MultipleSelector
} from "#/components";

const editSchema = z.object({
  allNode: z.boolean().default(true),
  node: z.array(z.string()),
  hour: z.number().int().positive("监控周期必须是正整数"),
  state: z.boolean().default(true)
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const taskId = params.taskId;

  if (!taskId) {
    throw new Response("Missing Task ID", { status: 400 });
  }

  try {
    const [nodeData, taskData] = await Promise.all([
      getNodeDataOnline({ token }),
      getScheduleTaskDetail({ token, id: taskId })
    ]);

    return {
      taskId,
      taskData,
      nodeList: nodeData.list.map((nodeName: string) => ({ label: nodeName, value: nodeName }))
    };
  } catch (error) {
    console.error("Failed to load task data:", error);
    throw new Response("Failed to load task data", { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const [token, rawData] = await Promise.all([getToken(request), request.json()]);

  const { data, error: parseError } = editSchema.safeParse(rawData);

  if (parseError) {
    console.error("Validation Error:", parseError.flatten());
    return { success: false, message: "表单验证失败，请检查输入。" };
  }

  try {
    await updateScheduledTaskPageMonit({
      token,
      node: data.node,
      allNode: data.allNode,
      hour: data.hour,
      state: data.state
    });
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, message: error?.message || "更新定时任务失败。" };
  }

  return redirect(SCHEDULED_TASKS_ROUTE);
}

export default function ScheduledTaskEditPage() {
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof action>();
  const { success, message } = fetcher.data || {};
  const { taskData, nodeList, taskId } = useLoaderData<typeof loader>();

  const form = useForm<z.infer<typeof editSchema>>({
    defaultValues: {
      node: taskData.node || [],
      allNode: taskData.allNode ?? true,
      hour: taskData.hour || 24,
      state: taskData.state ?? true
    }
  });

  const { watch, setValue } = form;
  const watchedNodes = watch("node");
  const watchedAllNode = watch("allNode");

  return (
    <div className="flex flex-col h-full">
      <Header
        routes={[
          { name: "仪表盘", href: r("/") },
          { name: "定时任务", href: r(SCHEDULED_TASK_ROUTE, { variables: { taskId } }) },
          { name: "编辑定时任务" }
        ]}
      >
        <div className="flex items-center">
          <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">编辑定时任务</h1>
            <p className="text-muted-foreground">修改定时任务 '{taskData.name}' 的配置</p>
          </div>
        </div>
      </Header>

      <div className="p-6 flex-1 overflow-y-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>任务配置</CardTitle>
            <CardDescription>修改定时任务的执行节点、周期和状态。</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert variant={success === false ? "destructive" : "default"} className="mb-4 sticky top-0 z-10">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            <fetcher.Form
              method="post"
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                const formData = form.getValues();
                fetcher.submit(formData, { method: "post", encType: "application/json" });
              }}
            >

              <CustomFormField name="cycle" label="监控周期 (小时)" required>
                <Input
                  type="number"
                  placeholder="请输入监控周期（小时）"
                  {...form.register("hour", { valueAsNumber: true })}
                  min="1"
                />
                {form.formState.errors.hour && (
                  <p className="text-sm text-destructive">{form.formState.errors.hour.message}</p>
                )}
              </CustomFormField>

              <CustomFormField name="node" label="目标节点">
                <MultipleSelector
                  options={nodeList}
                  value={watchedNodes.map(node => ({ label: node, value: node }))}
                  onChange={value => {
                    setValue(
                      "node",
                      value.map(item => item.value),
                      { shouldValidate: true }
                    );
                  }}
                  disabled={nodeList.length === 0 || watchedAllNode}
                  placeholder={watchedAllNode ? "已选择所有节点" : "选择执行节点..."}
                  emptyIndicator={
                    <p className="text-center text-sm text-muted-foreground py-2">
                      {nodeList.length === 0 ? "无可用在线节点" : "没有更多节点可选"}
                    </p>
                  }
                  className="min-h-[40px]" // Adjust height if needed
                />
                <p className="text-sm text-muted-foreground mt-1">
                  选择任务执行的节点。如果勾选了"自动加入节点"，此选项将被禁用。
                </p>
              </CustomFormField>

              <CustomFormSection>
                <CustomSwitchOption
                  label="自动加入节点"
                  checked={watchedAllNode}
                  onChange={checked => setValue("allNode", checked, { shouldValidate: true })}
                />
                <CustomSwitchOption
                  label="启用任务"
                  checked={watch("state")}
                  onChange={checked => setValue("state", checked, { shouldValidate: true })}
                />
              </CustomFormSection>

              <Button type="submit" className="w-full" disabled={fetcher.state !== "idle"}>
                <Save className="w-4 h-4 mr-2" />
                {fetcher.state === "submitting" ? "保存中..." : "保存更改"}
              </Button>
            </fetcher.Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
