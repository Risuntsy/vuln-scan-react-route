import { useLoaderData, type LoaderFunctionArgs, type ActionFunctionArgs, useFetcher } from "react-router";
import { getToken } from "#/lib";
import { getRadConfiguration, saveRadConfiguration } from "#/api/configuration/api";
import { DASHBOARD_ROUTE } from "#/routes";
import { Button, Card, CustomFormField, Header, Alert } from "#/components";
import { Tiptap } from "#/components/custom/sundry/tip-tap";
import { useEffect, useState } from "react";
import { successToast, errorToast } from "#/components/custom/toast";

interface ActionResponse {
  success: boolean;
  message?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);

  try {
    const config = await getRadConfiguration({ token });
    return {
      success: true,
      config,
      message: "ok"
    };
  } catch (error) {
    console.error("Failed to load rad configuration:", error);
    return {
      success: false,
      config: null,
      message: "无法加载配置"
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const [token, formData] = await Promise.all([getToken(request), request.json()]);
  const { content } = formData;

  try {
    await saveRadConfiguration({ token, content });
    return { success: true, message: "配置更新成功" };
  } catch (error) {
    console.error("Failed to update configuration:", error);
    return { success: false, message: "更新配置失败" };
  }
}

export default function RadConfigurationPage() {
  const { config, success, message } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [content, setContent] = useState(config?.content || "");

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        successToast(fetcher.data?.message || "操作成功");
      } else {
        errorToast(fetcher.data?.message || "操作失败");
      }
    }
  }, [fetcher.data]);

  const handleSubmit = async () => {
    await fetcher.submit({ content }, { method: "post", encType: "application/json" });
  };

  if (!success) {
    return <Alert variant="destructive">{message || "无法加载配置"}</Alert>;
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "仪表盘", href: DASHBOARD_ROUTE }, { name: "Rad配置" }]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Rad配置</h1>
            <p className="text-muted-foreground text-sm">配置Rad参数</p>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-auto m-6 p-6">
        <div className="space-y-6">
          <CustomFormField name="content" label="配置内容">
            <Tiptap
              content={content}
              onChange={setContent}
              className="h-[600px]"
            />
          </CustomFormField>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={handleSubmit} disabled={fetcher.state !== "idle"}>
              {fetcher.state !== "idle" ? "保存中..." : "保存配置"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
