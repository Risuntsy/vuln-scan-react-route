"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "#/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Switch } from "#/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { useState } from "react";
import { successToast, errorToast } from "#/components/toast";

const generalFormSchema = z.object({
    systemName: z.string().min(1, "系统名称不能为空"),
    adminEmail: z.string().email("请输入有效的邮箱地址"),
    maxConcurrentScans: z.string().min(1, "请输入最大并发扫描数"),
    defaultScanTimeout: z.string().min(1, "请输入默认扫描超时时间")
});

const scanFormSchema = z.object({
    subdomainWordlist: z.string().optional(),
    portScanRange: z.string().min(1, "请输入端口扫描范围"),
    scanThreads: z.string().min(1, "请输入扫描线程数"),
    requestTimeout: z.string().min(1, "请输入请求超时时间"),
    userAgent: z.string().min(1, "请输入User-Agent")
});

const notificationFormSchema = z.object({
    emailNotifications: z.boolean().default(false),
    emailServer: z.string().optional(),
    emailPort: z.string().optional(),
    emailUsername: z.string().optional(),
    emailPassword: z.string().optional(),
    webhookNotifications: z.boolean().default(false),
    webhookUrl: z.string().optional()
});

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");

    const generalForm = useForm<z.infer<typeof generalFormSchema>>({
        resolver: zodResolver(generalFormSchema),
        defaultValues: {
            systemName: "漏洞扫描系统",
            adminEmail: "admin@example.com",
            maxConcurrentScans: "5",
            defaultScanTimeout: "3600"
        }
    });

    const scanForm = useForm<z.infer<typeof scanFormSchema>>({
        resolver: zodResolver(scanFormSchema),
        defaultValues: {
            subdomainWordlist: "common-subdomains.txt",
            portScanRange: "1-1000,3306,8080-8090",
            scanThreads: "10",
            requestTimeout: "10",
            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    });

    const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
        resolver: zodResolver(notificationFormSchema),
        defaultValues: {
            emailNotifications: false,
            emailServer: "",
            emailPort: "",
            emailUsername: "",
            emailPassword: "",
            webhookNotifications: false,
            webhookUrl: ""
        }
    });

    function onGeneralSubmit(values: z.infer<typeof generalFormSchema>) {
        console.log(values);
        // TODO
        successToast("保存成功");
    }

    function onScanSubmit(values: z.infer<typeof scanFormSchema>) {
        console.log(values);
        // TODO
        successToast("保存成功");
    }

    function onNotificationSubmit(values: z.infer<typeof notificationFormSchema>) {
        console.log(values);
        // TODO
        successToast("保存成功");
    }

    return (
        <div className="flex flex-col h-full">
            {/* <Header className="mb-6">
        <div>
          <h1 className="text-2xl font-bold">系统设置</h1>
          <p className="text-muted-foreground">配置系统参数和扫描选项</p>
        </div>
      </Header> */}

            <div className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="general">通用设置</TabsTrigger>
                        <TabsTrigger value="scan">扫描设置</TabsTrigger>
                        <TabsTrigger value="notification">通知设置</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="m-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>通用设置</CardTitle>
                                <CardDescription>配置系统基本参数</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...generalForm}>
                                    <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                                        <FormField
                                            control={generalForm.control}
                                            name="systemName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>系统名称</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        显示在浏览器标题和系统界面上的名称
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={generalForm.control}
                                            name="adminEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>管理员邮箱</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormDescription>用于接收系统通知和警报的邮箱地址</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <FormField
                                                control={generalForm.control}
                                                name="maxConcurrentScans"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>最大并发扫描数</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min="1" {...field} />
                                                        </FormControl>
                                                        <FormDescription>系统同时执行的最大扫描任务数</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={generalForm.control}
                                                name="defaultScanTimeout"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>默认扫描超时时间（秒）</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min="1" {...field} />
                                                        </FormControl>
                                                        <FormDescription>扫描任务的默认超时时间</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button type="submit">保存设置</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="scan" className="m-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>扫描设置</CardTitle>
                                <CardDescription>配置扫描参数和选项</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...scanForm}>
                                    <form onSubmit={scanForm.handleSubmit(onScanSubmit)} className="space-y-6">
                                        <FormField
                                            control={scanForm.control}
                                            name="subdomainWordlist"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>子域名字典</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormDescription>用于子域名爆破的字典文件路径</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={scanForm.control}
                                            name="portScanRange"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>端口扫描范围</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                        要扫描的端口范围，例如：1-1000,3306,8080-8090
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <FormField
                                                control={scanForm.control}
                                                name="scanThreads"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>扫描线程数</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min="1" {...field} />
                                                        </FormControl>
                                                        <FormDescription>每个扫描任务使用的线程数</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={scanForm.control}
                                                name="requestTimeout"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>请求超时时间（秒）</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" min="1" {...field} />
                                                        </FormControl>
                                                        <FormDescription>HTTP请求的超时时间</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={scanForm.control}
                                            name="userAgent"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>User-Agent</FormLabel>
                                                    <FormControl>
                                                        <Textarea className="resize-none" {...field} />
                                                    </FormControl>
                                                    <FormDescription>扫描请求使用的User-Agent</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit">保存设置</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notification" className="m-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>通知设置</CardTitle>
                                <CardDescription>配置系统通知和警报</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...notificationForm}>
                                    <form
                                        onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <FormField
                                                control={notificationForm.control}
                                                name="emailNotifications"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">邮件通知</FormLabel>
                                                            <FormDescription>
                                                                通过邮件发送系统通知和警报
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {notificationForm.watch("emailNotifications") && (
                                                <div className="space-y-4 rounded-lg border p-4">
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <FormField
                                                            control={notificationForm.control}
                                                            name="emailServer"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>SMTP服务器</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={notificationForm.control}
                                                            name="emailPort"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>SMTP端口</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <FormField
                                                            control={notificationForm.control}
                                                            name="emailUsername"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>SMTP用户名</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={notificationForm.control}
                                                            name="emailPassword"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>SMTP密码</FormLabel>
                                                                    <FormControl>
                                                                        <Input type="password" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <FormField
                                                control={notificationForm.control}
                                                name="webhookNotifications"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">Webhook通知</FormLabel>
                                                            <FormDescription>
                                                                通过Webhook发送系统通知和警报
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {notificationForm.watch("webhookNotifications") && (
                                                <div className="space-y-4 rounded-lg border p-4">
                                                    <FormField
                                                        control={notificationForm.control}
                                                        name="webhookUrl"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Webhook URL</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormDescription>接收通知的Webhook URL</FormDescription>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <Button type="submit">保存设置</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
