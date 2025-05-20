import { z } from "zod";
import { useForm } from "react-hook-form";
import { AlertCircle, Save } from "lucide-react";
import {
  Button,
  Input,
  CustomFormField,
  CustomFormSection,
  CustomSwitchOption,
  Alert,
  AlertDescription,
  MultipleSelector,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from "#/components";
import type { TaskTemplateData } from "#/api";
import { type FetcherWithComponents } from "react-router";

const cycleTypeOptions = [
  { label: "每日", value: "daily" },
  { label: "每隔N小时", value: "nhours" },
  { label: "每周", value: "weekly" }
];

const targetSourceOptions = [
  { label: "常规目标", value: "general" },
  { label: "来自子域名", value: "subdomain" }
];

const duplicatesOptions = [
  { label: "不过滤", value: "None" },
  { label: "子域名结果过滤", value: "subdomain" }
];

const taskSchema = z.object({
  name: z.string().min(1, "任务名称不能为空"),
  targetSource: z.string().default("general"),
  target: z.string().optional(),
  ignore: z.string().optional(),
  node: z.array(z.string()),
  allNode: z.boolean().default(true),
  duplicates: z.string().default("None"),
  scheduledTasks: z.boolean().default(true),
  template: z.string().min(1, "扫描模板不能为空"),
  cycleType: z.string().default("daily"),
  hour: z.number().int().min(0, "小时不能为负").optional(),
  minute: z.number().int().min(0).max(59).optional(),
  day: z.number().int().min(1).max(31).optional(),
  week: z.number().int().min(1).max(7).optional(),
  targetTp: z.string().optional().default("select"),
  search: z.string().optional().default(""),
  filter: z.record(z.any()).optional().default({}),
  targetNumber: z.number().optional().default(0),
  targetIds: z.array(z.string()).optional().default([]),
  project: z.array(z.string()).optional().default([]),
  bindProject: z.string().nullable().optional().default(null)
});

taskSchema
  .refine(data => data.targetSource !== "general" || (!!data.target && data.target.trim() !== ""), {
    message: "常规目标时，目标不能为空",
    path: ["target"]
  })
  .refine(data => data.cycleType !== "nhours" || (data.hour !== undefined && data.hour >= 0), {
    message: "选择每隔N小时时，小时数不能为空",
    path: ["hour"]
  })
  .refine(
    data =>
      data.cycleType !== "daily" || (data.day !== undefined && data.hour !== undefined && data.minute !== undefined),
    { message: "选择每日时，日、小时和分钟不能为空", path: ["day", "hour", "minute"] }
  )
  .refine(
    data =>
      data.cycleType !== "weekly" || (data.week !== undefined && data.hour !== undefined && data.minute !== undefined),
    { message: "选择每周时，周、小时和分钟不能为空", path: ["week", "hour", "minute"] }
  )
  .refine(
    data => {
      if (!data.allNode && (!data.node || data.node.length === 0)) {
        return false;
      }
      return true;
    },
    { message: "未选择所有节点时，目标节点不能为空", path: ["node"] }
  );

export type TaskFormData = z.infer<typeof taskSchema>;

interface ScheduledTaskFormProps {
  defaultValues?: Partial<TaskFormData>;
  nodeList: Array<{ label: string; value: string }>;
  templateList: Array<TaskTemplateData>;
  fetcher: FetcherWithComponents<any>;
  mode: "create" | "edit";
  taskId?: string;
}

export function ScheduledTaskForm({
  defaultValues,
  nodeList,
  templateList,
  fetcher,
  mode,
  taskId
}: ScheduledTaskFormProps) {
  const form = useForm<TaskFormData>({
    resolver: async data => ({
      values: data,
      errors: (await taskSchema.safeParseAsync(data)).error?.flatten().fieldErrors || {}
    }),
    defaultValues: {
      name: "",
      targetSource: "general",
      target: "",
      ignore: "",
      node: nodeList?.map(node => node.value) || [],
      allNode: true,
      duplicates: "None",
      scheduledTasks: true,
      template: "",
      cycleType: "daily",
      hour: 1,
      minute: 30,
      day: 1,
      week: 1,
      targetTp: "select",
      search: "",
      filter: {},
      targetNumber: 0,
      targetIds: [],
      project: [],
      bindProject: null,
      ...defaultValues
    }
  });

  const {
    watch,
    setValue,
    register,
    formState: { errors, isSubmitting }
  } = form;

  const watchedNodes = watch("node");
  const watchedAllNode = watch("allNode");
  const watchedTargetSource = watch("targetSource");
  const watchedCycleType = watch("cycleType");

  return (
    <div className="w-full">
      <div className="space-y-6">
        {fetcher.data?.success === false && (
          <Alert variant="destructive" className="mb-4 sticky top-0 z-10">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{fetcher.data.message}</AlertDescription>
          </Alert>
        )}
        <form
          className="space-y-6"
          onSubmit={e => {
            e.preventDefault();
            const submissionData: Record<string, any> = {
              _action: mode,
              ...form.getValues()
            };
            if (mode === "edit" && taskId) {
              submissionData.id = taskId;
            }
            fetcher.submit(submissionData, { method: "POST", encType: "application/json" });
          }}
        >
          <CustomFormField name="name" label="任务名称" required>
            <Input placeholder="请输入任务名称" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </CustomFormField>

          <CustomFormField name="targetSource" label="目标来源" required>
            <Select
              onValueChange={value => setValue("targetSource", value, { shouldValidate: true })}
              defaultValue={form.getValues("targetSource")}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择目标来源" />
              </SelectTrigger>
              <SelectContent>
                {targetSourceOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.targetSource && <p className="text-sm text-destructive">{errors.targetSource.message}</p>}
          </CustomFormField>

          {watchedTargetSource === "general" && (
            <CustomFormField name="target" label="扫描目标" required={watchedTargetSource === "general"}>
              <Textarea
                placeholder="请输入扫描目标，例如：example.com, 192.168.1.1, 192.168.1.0/24"
                {...register("target")}
                className="min-h-[80px]"
              />
              {errors.target && <p className="text-sm text-destructive">{errors.target.message}</p>}
            </CustomFormField>
          )}

          <CustomFormField name="ignore" label="排除目标 (可选)">
            <Textarea placeholder="请输入需要排除的目标，一行一个" {...register("ignore")} className="min-h-[60px]" />
            {errors.ignore && <p className="text-sm text-destructive">{errors.ignore.message}</p>}
          </CustomFormField>

          <CustomFormField name="template" label="扫描模板" required>
            <Select
              onValueChange={value => setValue("template", value, { shouldValidate: true })}
              defaultValue={form.getValues("template")}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择扫描模板" />
              </SelectTrigger>
              <SelectContent>
                {templateList &&
                  templateList.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.template && <p className="text-sm text-destructive">{errors.template.message}</p>}
          </CustomFormField>

          <CustomFormField name="duplicates" label="去重方式" required>
            <Select
              onValueChange={value => setValue("duplicates", value, { shouldValidate: true })}
              defaultValue={form.getValues("duplicates")}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择去重方式" />
              </SelectTrigger>
              <SelectContent>
                {duplicatesOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.duplicates && <p className="text-sm text-destructive">{errors.duplicates.message}</p>}
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
              className="min-h-[40px]"
            />
            <p className="text-sm text-muted-foreground mt-1">
              选择任务执行的节点。如果勾选了"自动加入节点"，此选项将被禁用。
            </p>
            {errors.node && (
              <p className="text-sm text-destructive">
                {(errors.node as any)?.message || (typeof errors.node === "string" ? errors.node : "节点选择有误")}
              </p>
            )}
          </CustomFormField>

          <CustomFormSection>
            <CustomSwitchOption
              label="自动选择所有节点"
              checked={watchedAllNode}
              onChange={checked => setValue("allNode", checked, { shouldValidate: true })}
            />
            <CustomSwitchOption
              label="启用定时任务"
              checked={watch("scheduledTasks")}
              onChange={checked => setValue("scheduledTasks", checked, { shouldValidate: true })}
            />
          </CustomFormSection>

          <CustomFormField name="cycleType" label="监控周期类型" required>
            <Select
              onValueChange={value => setValue("cycleType", value, { shouldValidate: true })}
              defaultValue={form.getValues("cycleType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择周期类型" />
              </SelectTrigger>
              <SelectContent>
                {cycleTypeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cycleType && <p className="text-sm text-destructive">{errors.cycleType.message}</p>}
          </CustomFormField>

          {watchedCycleType === "nhours" && (
            <CustomFormField name="hour" label="每隔N小时" required={watchedCycleType === "nhours"}>
              <Input
                type="number"
                placeholder="输入小时数"
                {...register("hour", { valueAsNumber: true, required: watchedCycleType === "nhours", min: 0 })}
                min="0"
              />
              {errors.hour && <p className="text-sm text-destructive">{errors.hour.message}</p>}
            </CustomFormField>
          )}

          {watchedCycleType === "daily" && (
            <div className="grid grid-cols-3 gap-4">
              <CustomFormField name="day" label="日" required={watchedCycleType === "daily"}>
                <Input
                  type="number"
                  placeholder="日 (1-31)"
                  {...register("day", { valueAsNumber: true, required: watchedCycleType === "daily", min: 1, max: 31 })}
                  min="1"
                  max="31"
                />
                {errors.day && <p className="text-sm text-destructive">{errors.day.message}</p>}
              </CustomFormField>
              <CustomFormField name="hour" label="时" required={watchedCycleType === "daily"}>
                <Input
                  type="number"
                  placeholder="时 (0-23)"
                  {...register("hour", {
                    valueAsNumber: true,
                    required: watchedCycleType === "daily",
                    min: 0,
                    max: 23
                  })}
                  min="0"
                  max="23"
                />
                {errors.hour && <p className="text-sm text-destructive">{errors.hour.message}</p>}
              </CustomFormField>
              <CustomFormField name="minute" label="分" required={watchedCycleType === "daily"}>
                <Input
                  type="number"
                  placeholder="分 (0-59)"
                  {...register("minute", {
                    valueAsNumber: true,
                    required: watchedCycleType === "daily",
                    min: 0,
                    max: 59
                  })}
                  min="0"
                  max="59"
                />
                {errors.minute && <p className="text-sm text-destructive">{errors.minute.message}</p>}
              </CustomFormField>
            </div>
          )}

          {watchedCycleType === "weekly" && (
            <div className="grid grid-cols-3 gap-4">
              <CustomFormField name="week" label="周几" required={watchedCycleType === "weekly"}>
                <Select
                  onValueChange={value => setValue("week", parseInt(value), { shouldValidate: true })}
                  defaultValue={form.getValues("week")?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择周几" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(7).keys()].map(i => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>{`周${
                        ["一", "二", "三", "四", "五", "六", "日"][i]
                      }`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.week && <p className="text-sm text-destructive">{errors.week.message}</p>}
              </CustomFormField>
              <CustomFormField name="hour" label="时" required={watchedCycleType === "weekly"}>
                <Input
                  type="number"
                  placeholder="时 (0-23)"
                  {...register("hour", {
                    valueAsNumber: true,
                    required: watchedCycleType === "weekly",
                    min: 0,
                    max: 23
                  })}
                  min="0"
                  max="23"
                />
                {errors.hour && <p className="text-sm text-destructive">{errors.hour.message}</p>}
              </CustomFormField>
              <CustomFormField name="minute" label="分" required={watchedCycleType === "weekly"}>
                <Input
                  type="number"
                  placeholder="分 (0-59)"
                  {...register("minute", {
                    valueAsNumber: true,
                    required: watchedCycleType === "weekly",
                    min: 0,
                    max: 59
                  })}
                  min="0"
                  max="59"
                />
                {errors.minute && <p className="text-sm text-destructive">{errors.minute.message}</p>}
              </CustomFormField>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting || Object.keys(errors).length > 0}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "保存中..." : mode === "create" ? "创建任务" : "保存更改"}
          </Button>
        </form>
      </div>
    </div>
  );
}
