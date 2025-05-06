import { useLoaderData, type LoaderFunctionArgs, type ActionFunctionArgs, useFetcher } from "react-router";
import { getToken } from "#/lib";
import {
  getDeduplicationConfig,
  updateDeduplicationConfig,
  getSystemConfiguration,
  saveSystemConfiguration,
  getNotificationSettings,
  updateNotificationSettings
} from "#/api/configuration/api";
import { DASHBOARD_ROUTE } from "#/routes";
import {
  Button,
  Card,
  CustomFormField,
  Header,
  Alert,
  Input,
  Switch,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "#/components";
import { Tiptap } from "#/components/custom/tip-tap";
import { useEffect, useState } from "react";
import { successToast, errorToast } from "#/components/custom/toast";

interface SystemConfig {
  timezone: string;
  ModulesConfig: string;
}

interface ActionResponse {
  success: boolean;
  message?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request);

  try {
    const [deduplicationConfig, systemConfig, notificationConfig] = await Promise.all([
      getDeduplicationConfig({ token }),
      getSystemConfiguration({ token }),
      getNotificationSettings({ token })
    ]);

    const parsedSystemConfig: SystemConfig = {
      timezone: systemConfig.timezone || "Asia/Shanghai",
      ModulesConfig: systemConfig.ModulesConfig || ""
    };

    return {
      success: true,
      deduplicationConfig,
      systemConfig: parsedSystemConfig,
      notificationConfig,
      message: "ok"
    };
  } catch (error) {
    console.error("Failed to load configurations:", error);
    return {
      success: false,
      deduplicationConfig: null,
      systemConfig: null,
      notificationConfig: null,
      message: "无法加载配置"
    };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const [token, formData] = await Promise.all([getToken(request), request.json()]);
  const { type, ...data } = formData;

  try {
    switch (type) {
      case "deduplication":
        await updateDeduplicationConfig({ ...data, token });
        return { success: true, message: "去重配置更新成功" };
      case "system":
        await saveSystemConfiguration({ ...data, token });
        return { success: true, message: "系统配置更新成功" };
      case "notification":
        await updateNotificationSettings({ ...data, token });
        return { success: true, message: "通知配置更新成功" };
      default:
        throw new Error("未知的配置类型");
    }
  } catch (error) {
    console.error("Failed to update configuration:", error);
    return { success: false, message: "更新配置失败" };
  }
}

export default function SystemConfigurationPage() {
  const { deduplicationConfig, systemConfig, notificationConfig, success, message } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        successToast(fetcher.data?.message || "操作成功");
      } else {
        errorToast(fetcher.data?.message || "操作失败");
      }
    }
  }, [fetcher.data]);
  const [deduplication, setDeduplication] = useState({
    asset: deduplicationConfig?.asset || false,
    subdomain: deduplicationConfig?.subdomain || false,
    SubdoaminTakerResult: deduplicationConfig?.SubdoaminTakerResult || false,
    UrlScan: deduplicationConfig?.UrlScan || false,
    crawler: deduplicationConfig?.crawler || false,
    SensitiveResult: deduplicationConfig?.SensitiveResult || false,
    DirScanResult: deduplicationConfig?.DirScanResult || false,
    vulnerability: deduplicationConfig?.vulnerability || false,
    PageMonitoring: deduplicationConfig?.PageMonitoring || false,
    hour: deduplicationConfig?.hour || 3,
    flag: deduplicationConfig?.flag || false,
    runNow: false
  });

  const [system, setSystem] = useState({
    timezone: systemConfig?.timezone || "Asia/Shanghai",
    ModulesConfig: systemConfig?.ModulesConfig || ""
  });

  const [notification, setNotification] = useState({
    dirScanNotification: notificationConfig?.dirScanNotification || false,
    portScanNotification: notificationConfig?.portScanNotification || false,
    sensitiveNotification: notificationConfig?.sensitiveNotification || false,
    subdomainNotification: notificationConfig?.subdomainNotification || false,
    subdomainTakeoverNotification: notificationConfig?.subdomainTakeoverNotification || false,
    pageMonNotification: notificationConfig?.pageMonNotification || false,
    vulNotification: notificationConfig?.vulNotification || false
  });

  const handleDeduplicationSubmit = async () => {
    await fetcher.submit({ type: "deduplication", ...deduplication }, { method: "post", encType: "application/json" });
  };

  const handleSystemSubmit = async () => {
    await fetcher.submit({ type: "system", ...system }, { method: "post", encType: "application/json" });
  };

  const handleNotificationSubmit = async () => {
    await fetcher.submit({ type: "notification", ...notification }, { method: "post", encType: "application/json" });
  };

  const handleModuleSubmit = async () => {
    const ModulesConfig = JSON.stringify(module);
    await fetcher.submit(
      { type: "system", timezone: system.timezone, ModulesConfig },
      { method: "post", encType: "application/json" }
    );
  };

  if (!success) {
    return <Alert variant="destructive">{message || "无法加载配置"}</Alert>;
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <Header routes={[{ name: "仪表盘", href: DASHBOARD_ROUTE }, { name: "系统配置" }]}>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">系统配置</h1>
            <p className="text-muted-foreground text-sm">配置系统参数和功能</p>
          </div>
        </div>
      </Header>

      <Card className="flex flex-1 overflow-auto m-6 p-6">
        <Tabs defaultValue="deduplication" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deduplication">去重配置</TabsTrigger>
            <TabsTrigger value="system">系统配置</TabsTrigger>
            <TabsTrigger value="notification">通知配置</TabsTrigger>
          </TabsList>

          <TabsContent value="deduplication" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CustomFormField name="flag" label="去重开关">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flag"
                    checked={deduplication.flag}
                    onCheckedChange={checked => setDeduplication(prev => ({ ...prev, flag: checked }))}
                  />
                  <Label htmlFor="flag">{deduplication.flag ? "开启" : "关闭"}</Label>
                </div>
              </CustomFormField>

              {deduplication.flag && (
                <>
                  <CustomFormField name="runNow" label="立即运行">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="runNow"
                        checked={deduplication.runNow}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, runNow: checked }))}
                      />
                      <Label htmlFor="runNow">{deduplication.runNow ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>

                  <CustomFormField name="hour" label="去重时间间隔">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min={1}
                        value={deduplication.hour}
                        onChange={e => setDeduplication(prev => ({ ...prev, hour: parseInt(e.target.value) || 1 }))}
                        className="w-20"
                      />
                      <Label>小时</Label>
                    </div>
                  </CustomFormField>
                </>
              )}
            </div>

            {deduplication.flag && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CustomFormField name="asset" label="资产去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="asset"
                        checked={deduplication.asset}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, asset: checked }))}
                      />
                      <Label htmlFor="asset">{deduplication.asset ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>

                  <CustomFormField name="subdomain" label="子域名去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="subdomain"
                        checked={deduplication.subdomain}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, subdomain: checked }))}
                      />
                      <Label htmlFor="subdomain">{deduplication.subdomain ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>

                  <CustomFormField name="SubdoaminTakerResult" label="子域名接管去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="SubdoaminTakerResult"
                        checked={deduplication.SubdoaminTakerResult}
                        onCheckedChange={checked =>
                          setDeduplication(prev => ({ ...prev, SubdoaminTakerResult: checked }))
                        }
                      />
                      <Label htmlFor="SubdoaminTakerResult">
                        {deduplication.SubdoaminTakerResult ? "开启" : "关闭"}
                      </Label>
                    </div>
                  </CustomFormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CustomFormField name="UrlScan" label="URL扫描去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="UrlScan"
                        checked={deduplication.UrlScan}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, UrlScan: checked }))}
                      />
                      <Label htmlFor="UrlScan">{deduplication.UrlScan ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>

                  <CustomFormField name="crawler" label="爬虫去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="crawler"
                        checked={deduplication.crawler}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, crawler: checked }))}
                      />
                      <Label htmlFor="crawler">{deduplication.crawler ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>

                  <CustomFormField name="SensitiveResult" label="敏感信息去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="SensitiveResult"
                        checked={deduplication.SensitiveResult}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, SensitiveResult: checked }))}
                      />
                      <Label htmlFor="SensitiveResult">{deduplication.SensitiveResult ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CustomFormField name="DirScanResult" label="目录扫描去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="DirScanResult"
                        checked={deduplication.DirScanResult}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, DirScanResult: checked }))}
                      />
                      <Label htmlFor="DirScanResult">{deduplication.DirScanResult ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>

                  <CustomFormField name="vulnerability" label="漏洞去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="vulnerability"
                        checked={deduplication.vulnerability}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, vulnerability: checked }))}
                      />
                      <Label htmlFor="vulnerability">{deduplication.vulnerability ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>

                  <CustomFormField name="PageMonitoring" label="页面监控去重">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="PageMonitoring"
                        checked={deduplication.PageMonitoring}
                        onCheckedChange={checked => setDeduplication(prev => ({ ...prev, PageMonitoring: checked }))}
                      />
                      <Label htmlFor="PageMonitoring">{deduplication.PageMonitoring ? "开启" : "关闭"}</Label>
                    </div>
                  </CustomFormField>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button onClick={handleDeduplicationSubmit} disabled={fetcher.state !== "idle"}>
                {fetcher.state !== "idle" ? "保存中..." : "保存配置"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <CustomFormField name="timezone" label="时区">
                  <Input
                    type="text"
                    value={system.timezone}
                    onChange={e => setSystem(prev => ({ ...prev, timezone: e.target.value }))}
                  />
                </CustomFormField>

                <CustomFormField name="ModulesConfig" label="模块配置">
                  <Tiptap
                    content={system.ModulesConfig}
                    onChange={content => setSystem(prev => ({ ...prev, ModulesConfig: content }))}
                    className="h-[600px]"
                  />
                </CustomFormField>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button onClick={handleSystemSubmit} disabled={fetcher.state !== "idle"}>
                  {fetcher.state !== "idle" ? "保存中..." : "保存配置"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notification">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomFormField name="dirScanNotification" label="目录扫描通知">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dirScanNotification"
                      checked={notification.dirScanNotification}
                      onCheckedChange={checked => setNotification(prev => ({ ...prev, dirScanNotification: checked }))}
                    />
                    <Label htmlFor="dirScanNotification">开启</Label>
                  </div>
                </CustomFormField>

                <CustomFormField name="portScanNotification" label="端口扫描通知">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="portScanNotification"
                      checked={notification.portScanNotification}
                      onCheckedChange={checked => setNotification(prev => ({ ...prev, portScanNotification: checked }))}
                    />
                    <Label htmlFor="portScanNotification">开启</Label>
                  </div>
                </CustomFormField>

                <CustomFormField name="sensitiveNotification" label="敏感信息通知">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sensitiveNotification"
                      checked={notification.sensitiveNotification}
                      onCheckedChange={checked =>
                        setNotification(prev => ({ ...prev, sensitiveNotification: checked }))
                      }
                    />
                    <Label htmlFor="sensitiveNotification">开启</Label>
                  </div>
                </CustomFormField>

                <CustomFormField name="subdomainNotification" label="子域名通知">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="subdomainNotification"
                      checked={notification.subdomainNotification}
                      onCheckedChange={checked =>
                        setNotification(prev => ({ ...prev, subdomainNotification: checked }))
                      }
                    />
                    <Label htmlFor="subdomainNotification">开启</Label>
                  </div>
                </CustomFormField>

                <CustomFormField name="subdomainTakeoverNotification" label="子域名接管通知">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="subdomainTakeoverNotification"
                      checked={notification.subdomainTakeoverNotification}
                      onCheckedChange={checked =>
                        setNotification(prev => ({ ...prev, subdomainTakeoverNotification: checked }))
                      }
                    />
                    <Label htmlFor="subdomainTakeoverNotification">开启</Label>
                  </div>
                </CustomFormField>

                <CustomFormField name="pageMonNotification" label="页面监控通知">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pageMonNotification"
                      checked={notification.pageMonNotification}
                      onCheckedChange={checked => setNotification(prev => ({ ...prev, pageMonNotification: checked }))}
                    />
                    <Label htmlFor="pageMonNotification">开启</Label>
                  </div>
                </CustomFormField>

                <CustomFormField name="vulNotification" label="漏洞通知">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="vulNotification"
                      checked={notification.vulNotification}
                      onCheckedChange={checked => setNotification(prev => ({ ...prev, vulNotification: checked }))}
                    />
                    <Label htmlFor="vulNotification">开启</Label>
                  </div>
                </CustomFormField>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button onClick={handleNotificationSubmit} disabled={fetcher.state !== "idle"}>
                  {fetcher.state !== "idle" ? "保存中..." : "保存配置"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
