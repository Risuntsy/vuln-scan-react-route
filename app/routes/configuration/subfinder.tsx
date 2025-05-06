import { useLoaderData, type LoaderFunctionArgs, type ActionFunctionArgs, useActionData, useSubmit } from "react-router";
import { getToken } from "#/lib";
import { getSubfinderConfiguration, saveSubfinderConfiguration } from "#/api/configuration/api";
import { DASHBOARD_ROUTE } from "#/routes";
import { Button, Card, CustomFormField, Header, Alert, Tiptap } from "#/components";
import { useEffect, useState } from "react";
import { successToast, errorToast } from "#/components/custom/toast";

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);

  try {
    const config = await getSubfinderConfiguration({ token });
    return {
      success: true,
      config,
      message: "ok"
    };
  } catch (error) {
    console.error("Failed to load subfinder configuration:", error);
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
    await saveSubfinderConfiguration({ token, content });
    return { success: true, message: "配置更新成功" };
  } catch (error) {
    console.error("Failed to update configuration:", error);
    return { success: false, message: "更新配置失败" };
  }
}

export default function SubfinderConfigurationPage() {
  const { config } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [content, setContent] = useState(config?.content || "");
  const submit = useSubmit();

  const handleSubmit = async () => {
    await submit({ content }, { method: "post", encType: "application/json" });
  };

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        successToast(actionData.message || "操作成功");
      } else {
        errorToast(actionData.message || "操作失败");
      }
    }
  }, [actionData]);

  if(!config) {
    return <Alert variant="destructive">无法加载配置</Alert>;
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "仪表盘", href: DASHBOARD_ROUTE }, { name: "Subfinder配置" }]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Subfinder配置</h1>
            <p className="text-muted-foreground text-sm">配置Subfinder参数</p>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-auto m-6 p-6">
        <div className="space-y-6">
          <CustomFormField name="content" label="配置内容">
            <Tiptap content={config?.content || ""} onChange={content => setContent(content)} className="h-[600px]" />
          </CustomFormField>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={handleSubmit}>
              保存配置
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
