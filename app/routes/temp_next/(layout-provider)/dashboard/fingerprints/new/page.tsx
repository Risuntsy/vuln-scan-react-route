"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Header, successToastWithTitle } from "#/components";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "#/components";
import { Input } from "#/components";
import { Textarea } from "#/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DASHBOARD_ROUTE } from "#/routes";

const formSchema = z.object({
    name: z.string().min(1, "指纹名称不能为空"),
    type: z.string().min(1, "请选择指纹类型"),
    pattern: z.string().min(1, "匹配模式不能为空"),
    examples: z.string().optional(),
    description: z.string().optional()
});

export default function NewFingerprintPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
            pattern: "",
            examples: "",
            description: ""
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        console.log(values);

        // 模拟API请求
        setTimeout(() => {
            setIsSubmitting(false);
            successToastWithTitle("指纹规则已创建", `成功创建指纹规则 "${values.name}"`);
            router.push("/fingerprints");
        }, 1500);
    }

    return (
        <div>
            <Header routes={[{ name: "仪表盘", href: DASHBOARD_ROUTE }, { name: "指纹库" }, { name: "添加指纹规则" }]}>
                <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">添加指纹规则</h1>
                    <p className="text-muted-foreground">创建新的应用或服务指纹识别规则</p>
                </div>
            </Header>

            <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>指纹规则信息</CardTitle>
                        <CardDescription>配置指纹识别的基本信息和匹配规则</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>指纹名称</FormLabel>
                                            <FormControl>
                                                <Input placeholder="如：Apache、Nginx、WordPress" {...field} />
                                            </FormControl>
                                            <FormDescription>输入要识别的应用、服务或技术的名称</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>指纹类型</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="选择指纹类型" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="web_server">Web服务器</SelectItem>
                                                    <SelectItem value="cms">CMS系统</SelectItem>
                                                    <SelectItem value="programming_language">编程语言</SelectItem>
                                                    <SelectItem value="framework">框架</SelectItem>
                                                    <SelectItem value="javascript_library">JavaScript库</SelectItem>
                                                    <SelectItem value="css_framework">CSS框架</SelectItem>
                                                    <SelectItem value="javascript_framework">JavaScript框架</SelectItem>
                                                    <SelectItem value="database">数据库</SelectItem>
                                                    <SelectItem value="operating_system">操作系统</SelectItem>
                                                    <SelectItem value="other">其他</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>选择指纹的类型分类</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pattern"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>匹配模式</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="输入正则表达式或匹配规则，如：Apache/[0-9\\.]+、wp-content|wp-includes"
                                                    className="font-mono h-20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                输入用于识别该指纹的正则表达式或匹配规则，支持正则表达式语法
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="examples"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>示例匹配</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="输入示例匹配字符串，多个示例用换行分隔，如：Apache/2.4.41"
                                                    className="h-20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                输入一些能够匹配上述规则的示例字符串，有助于验证规则的正确性
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>描述</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="输入关于此指纹的描述信息（可选）"
                                                    className="h-20"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                可选的描述信息，如版本识别方法、安全风险等
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" type="button" onClick={() => router.back()}>
                                        取消
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Save className="w-4 h-4 mr-2 animate-pulse" />
                                                保存中...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                保存规则
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
