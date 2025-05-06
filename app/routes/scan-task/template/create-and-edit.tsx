import {
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  useFetcher,
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
  VulnerabilityScan: [],
  PassiveScan: []
};

const parametersDefaultValue: Record<ModuleType, Record<string, string>> = {
  TargetHandler: {},
  SubdomainScan: {},
  SubdomainSecurity: {},
  PortScanPreparation: {},
  PortScan: {},
  PortFingerprint: {},
  AssetMapping: {},
  AssetHandle: {},
  URLScan: {},
  WebCrawler: {},
  URLSecurity: {},
  DirScan: {},
  VulnerabilityScan: {},
  PassiveScan: {}
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
      templateDetail: templateDetail as {
        id?: string;
        name: string;
        Parameters: Record<ModuleType, Record<string, string>>;
        TargetHandler: string[];
        SubdomainScan: string[];
        SubdomainSecurity: string[];
        PortScanPreparation: string[];
        PortScan: string[];
        PortFingerprint: string[];
        AssetMapping: string[];
        AssetHandle: string[];
        URLScan: string[];
        WebCrawler: string[];
        URLSecurity: string[];
        DirScan: string[];
        VulnerabilityScan: string[];
        PassiveScan: string[];
      } | null
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
  const [token, formData] = await Promise.all([getToken(request), request.json()]);

  try {
    const templateData = {
      id: formData.id || "",
      name: formData.name,
      Parameters: formData.parameters,
      ...formData.selectedModules,
      vullist: []
    };

    await saveTemplateDetail({ result: templateData, token });
    return redirect(TEMPLATES_ROUTE);
  } catch (error) {
    console.error("Failed to create template:", error);
    return { success: false, message: "创建模板失败" };
  }
}

export default function CreateTemplatePage() {
  const { plugins, success, message, templateDetail } = useLoaderData<typeof loader>() || {
    success: false,
    plugins: null
  };

  const [selectedModules, setSelectedModules] = useState<Record<ModuleType, string[]>>(() => {
    if (!templateDetail) return { ...formDefaultValue };

    // 从模板中提取已选模块
    const modules: Record<ModuleType, string[]> = { ...formDefaultValue };
    for (const key of Object.keys(modules) as ModuleType[]) {
      if (Array.isArray(templateDetail?.[key])) {
        modules[key] = [...templateDetail[key]];
      }
    }
    return modules;
  });

  const [parameters, setParameters] = useState<Record<ModuleType, Record<string, string>>>(
    templateDetail?.Parameters ? { ...templateDetail.Parameters } : { ...parametersDefaultValue }
  );
  const [templateName, setTemplateName] = useState(templateDetail?.name || "");
  const fetcher = useFetcher();
  const isEditMode = !!templateDetail;

  if (!success || !plugins) {
    return <Alert variant="destructive">{message || "无法加载插件列表"}</Alert>;
  }

  const handlePluginToggle = (moduleName: ModuleType, pluginId: string, checked: boolean) => {
    setSelectedModules(prev => {
      const current = [...(prev[moduleName] || [])];
      if (checked) {
        if (!current.includes(pluginId)) {
          current.push(pluginId);
        }
      } else {
        const index = current.indexOf(pluginId);
        if (index !== -1) {
          current.splice(index, 1);
        }
      }
      return {
        ...prev,
        [moduleName]: current
      };
    });
  };

  const handleParameterChange = (moduleName: ModuleType, pluginHash: string, value: string) => {
    setParameters(prev => {
      const moduleParams = { ...(prev[moduleName] || {}) };
      if (value) {
        moduleParams[pluginHash] = value;
      } else {
        delete moduleParams[pluginHash];
      }
      return {
        ...prev,
        [moduleName]: moduleParams
      };
    });
  };

  const handleSubmit = () => {
    const formData = {
      id: templateDetail?.id || "",
      name: templateName,
      parameters,
      selectedModules
    };

    fetcher.submit(formData, { method: "post", encType: "application/json" });
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header
        routes={[
          { name: "Dashboard", href: DASHBOARD_ROUTE },
          { name: "扫描模板", href: TEMPLATES_ROUTE },
          { name: isEditMode ? "编辑模板" : "新建模板" }
        ]}
      >
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{isEditMode ? "编辑扫描模板" : "新建扫描模板"}</h1>
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

        <div className="space-y-6 w-full">
          <CustomFormField name="name" label="模板名称">
            <Input name="name" value={templateName} onChange={e => setTemplateName(e.target.value)} />
          </CustomFormField>

          {Object.entries(plugins).map(([moduleNameString, modulePlugins]) => {
            const moduleName = moduleNameString as ModuleType;
            return modulePlugins.length === 0 ? null : (
              <div key={moduleName} className="space-y-3">
                <h3 className="text-lg font-medium">{moduleName}</h3>
                <div className="space-y-4 pl-2">
                  {modulePlugins.map(plugin => {
                    const isSelected = selectedModules[plugin.module as ModuleType]?.includes(plugin.hash);
                    const pluginParam = parameters[moduleName]?.[plugin.hash] || plugin.parameter || "";

                    return (
                      <div key={plugin.id} className="space-y-2">
                        <CustomSwitchOption
                          name={`plugin-${moduleName}-${plugin.hash}`}
                          label={`${plugin.name}`}
                          checked={isSelected}
                          onChange={checked => handlePluginToggle(moduleName, plugin.hash, checked)}
                        />
                        {isSelected && (
                          <Input
                            name={`param-${moduleName}-${plugin.id}`}
                            placeholder={`${plugin.name} 参数`}
                            defaultValue={pluginParam}
                            onChange={e => handleParameterChange(moduleName, plugin.hash, e.target.value)}
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
            <Button onClick={handleSubmit}>{isEditMode ? "保存模板" : "创建模板"}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
