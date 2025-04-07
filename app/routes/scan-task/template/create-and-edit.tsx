import {
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useFetcher,
  Form
} from "react-router";
import { getToken } from "#/lib";
import { getPluginDataByModule, getTemplateDetail, saveTemplateDetail, type PluginData } from "#/api";
import { DASHBOARD_ROUTE, TEMPLATES_ROUTE } from "#/routes";
import { Button, Input, Card, Alert, Header, CustomFormField, CustomSwitchOption } from "#/components";
import { useState } from "react";

const formDefaultValue = {
  TargetHandler: [],
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
  VulnerabilityScan: []
};

export type ModuleType = keyof typeof formDefaultValue;

export const modules = Object.keys(formDefaultValue) as ModuleType[];

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { templateId } = params;
  const token = await getToken(request);

  try {
    const plugins: Record<ModuleType, PluginData[]> = {} as Record<ModuleType, PluginData[]>;

    const [moduleWithPlugins, templateDetail] = await Promise.all([
      Promise.all(
        modules.map(async module => ({
          module,
          pluginList: (await getPluginDataByModule({ module, token })).list
        }))
      ),
      templateId ? getTemplateDetail({ id: templateId, token }) : null
    ]);

    moduleWithPlugins.forEach(({ module, pluginList }) => (plugins[module] = pluginList));

    return {
      success: true,
      plugins,
      message: "ok",
      templateDetail
    };
  } catch (error) {
    console.error("Failed to load plugins:", error);
    return {
      success: false,
      message: "无法加载插件列表"
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const [token, templateData] = await Promise.all([getToken(request), request.json()]);

  console.log(templateData);

  try {
    await saveTemplateDetail({ result: templateData, token });
    return redirect(TEMPLATES_ROUTE);
  } catch (error) {
    console.error("Failed to create template:", error);
    return { success: false, message: "创建模板失败" };
  }
}

export default function CreateTemplatePage() {
  const { plugins, success, message } = useLoaderData<typeof loader>() || { success: false, plugins: null };
  const [selectedPlugins, setSelectedPlugins] = useState<Record<ModuleType, string[]>>(formDefaultValue);
  const fetcher = useFetcher();

  if (!success || !plugins) {
    return <Alert variant="destructive">{message || "无法加载插件列表"}</Alert>;
  }

  const handlePluginToggle = (moduleName: ModuleType, pluginId: string, checked: boolean) => {
    setSelectedPlugins(prev => {
      const current = prev[moduleName] || [];
      return {
        ...prev,
        [moduleName]: checked ? [...current, pluginId] : current.filter(id => id !== pluginId)
      };
    });
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header
        routes={[
          { name: "Dashboard", href: DASHBOARD_ROUTE },
          { name: "扫描模板", href: TEMPLATES_ROUTE },
          { name: "新建模板" }
        ]}
      >
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">新建扫描模板</h1>
            <p className="text-muted-foreground text-sm">配置扫描模板的名称和包含的模块及插件参数</p>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-auto m-6 p-6">
        {fetcher.data && !fetcher.data.success && (
          <div className="sticky top-0 z-10 bg-background pb-4">
            <Alert variant="destructive">{fetcher.data.message || "操作失败"}</Alert>
          </div>
        )}
        
        <Form method="post" className="space-y-6 w-full">
          <CustomFormField name="name" label="模板名称" required>
            <Input name="name" required />
          </CustomFormField>

          {Object.entries(plugins).map(([moduleNameString, modulePlugins]) => {
            const moduleName = moduleNameString as ModuleType;
            return modulePlugins.length === 0 ? null : (
              <div key={moduleName} className="space-y-3">
                <h3 className="text-lg font-medium">{moduleName}</h3>
                <div className="space-y-4 pl-2">
                  {modulePlugins.map(plugin => {
                    const isSelected = (selectedPlugins[moduleName] || []).includes(plugin.id);
                    return (
                      <div key={plugin.id} className="space-y-2">
                        <CustomSwitchOption
                          name={`plugin-${moduleName}-${plugin.id}`}
                          label={`${plugin.name}`}
                          checked={isSelected}
                          onChange={checked => handlePluginToggle(moduleName, plugin.id, checked)}
                        />
                        {isSelected && (
                          <Input
                            name={`param-${moduleName}-${plugin.id}`}
                            placeholder={`${plugin.name} 参数`}
                            defaultValue={plugin.parameter || ""}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button onClick={() => fetcher.submit({
              name:

            }, { method: "post", encType: "application/json" })}>
              创建模板
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
