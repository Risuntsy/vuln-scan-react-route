import {
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useActionData,
  useSubmit,
  useFetcher,
  redirect,
  useNavigate,
  useParams
} from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { AlertCircle, ArrowLeft, Save, Plus } from "lucide-react";
import { useState } from "react";

import { getToken, r } from "#/lib";
import { getPocDetail, getPocContent, addPocData, updatePocData } from "#/api/poc/api";
import { POCS_ROUTE, DASHBOARD_ROUTE } from "#/routes";
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
  Header,
  Alert,
  AlertDescription,
  Badge
} from "#/components";
import { Tiptap } from "#/components/custom/sundry/tip-tap";

// Form schema for POC creation/editing
const formSchema = z.object({
  name: z.string().min(1, "POC名称不能为空"),
  content: z.string().min(1, "POC内容不能为空"),
  level: z.string().min(1, "风险等级不能为空"),
  tags: z.array(z.string()).default([])
});

// Risk level options
const riskLevelOptions = [
  { value: "高危", label: "高危" },
  { value: "中危", label: "中危" },
  { value: "低危", label: "低危" },
  { value: "信息", label: "信息" }
];

// Placeholder loader function
export async function loader({ request, params }: LoaderFunctionArgs) {
  const token = await getToken(request);
  const pocId = params.pocId;

  // If editing, fetch POC data
  if (pocId) {
    try {
      const [pocDetail] = await Promise.all([getPocDetail({ token, id: pocId })]);

      return {
        pocData: (pocDetail as any).data,
        isEditMode: true
      };
    } catch (error) {
      console.error("Failed to load POC data:", error);
      return {
        pocData: null,
        isEditMode: true,
        error: "加载POC数据失败"
      };
    }
  }

  return {
    pocData: null,
    isEditMode: false
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const [token, rawData] = await Promise.all([getToken(request), request.json()]);
  const { data, error: parseError } = formSchema.safeParse(rawData);

  if (parseError) {
    return { success: false, message: parseError.message };
  }

  try {
    const pocId = params.pocId;

    if (pocId) {
      // Update existing POC
      await updatePocData({
        ...data,
        id: pocId,
        token
      });
    } else {
      // Create new POC
      await addPocData({
        ...data,
        token
      });
    }
  } catch (error: any) {
    return { success: false, message: error?.message || "未知错误" };
  }

  return redirect(POCS_ROUTE);
}

export default function PocCreateEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const fetcher = useFetcher();
  const { pocData, isEditMode, error } = useLoaderData<typeof loader>();
  const { success, message } = useActionData<typeof action>() || {};
  const submit = useSubmit();

  // Initialize form with data (if editing) or defaults (if creating)
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: pocData?.name || "",
      content: pocData?.content || "",
      level: pocData?.level || "高危",
      tags: pocData?.tags || []
    }
  });

  // Handle tag input
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() === "") return;

    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index)
    );
  };

  const pageTitle = isEditMode ? "编辑POC" : "新建POC";

  return (
    <div className="flex flex-col h-full">
      <Header
        routes={[{ name: "仪表盘", href: DASHBOARD_ROUTE }, { name: "POC管理", href: POCS_ROUTE }, { name: pageTitle }]}
      >
        <div className="flex items-center">
          <Button onClick={() => navigate(-1)} variant="ghost" size="icon" className="mr-4 hover:cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">{isEditMode ? "编辑现有POC" : "创建新的漏洞POC"}</p>
          </div>
        </div>
      </Header>

      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>POC配置</CardTitle>
            <CardDescription>配置POC的基本信息和内容</CardDescription>
          </CardHeader>
          <CardContent>
            {(message || error) && (
              <Alert variant="destructive" className="mb-4 sticky top-0">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{message || error}</AlertDescription>
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
                <CustomFormField name="name" label="POC名称" required>
                  <Input
                    placeholder="请输入POC名称，例如：CVE-2022-1040.yaml"
                    name="name"
                    defaultValue={form.getValues("name")}
                    onChange={e => form.setValue("name", e.target.value)}
                  />
                </CustomFormField>

                <CustomFormField name="level" label="风险等级" required>
                  <div className="flex gap-3">
                    {riskLevelOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={form.watch("level") === option.value ? "default" : "outline"}
                        onClick={() => form.setValue("level", option.value)}
                        className="flex-1"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </CustomFormField>
              </div>

              <CustomFormField name="tags" label="标签">
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.watch("tags").map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {tag}
                      <button
                        type="button"
                        className="ml-2 text-xs hover:text-destructive"
                        onClick={() => removeTag(index)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="输入标签，按添加或回车键确认"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    添加
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">常用标签：cve, rce, xss, sqli, lfi, fingerprint</p>
              </CustomFormField>

              <CustomFormField name="content" label="POC内容" required className="overflow-auto">
                <Tiptap
                  content={form.getValues("content")}
                  onChange={value => form.setValue("content", value)}
                  className="min-h-[400px] overflow-auto"
                />
              </CustomFormField>

              <Button type="submit" className="w-full">
                {isEditMode ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    保存POC
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    创建POC
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
