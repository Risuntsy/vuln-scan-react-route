import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Badge } from "#/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

export default function StatisticsPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b">
                <div>
                    <h1 className="text-2xl font-bold">统计分析</h1>
                    <p className="text-muted-foreground">查看系统数据统计和趋势分析</p>
                </div>
                <Select defaultValue="30">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="选择时间范围" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">最近7天</SelectItem>
                        <SelectItem value="30">最近30天</SelectItem>
                        <SelectItem value="90">最近90天</SelectItem>
                        <SelectItem value="365">最近一年</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">总扫描任务</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">128</div>
                            <p className="text-xs text-muted-foreground">
                                较上月 <span className="text-green-500">+12.5%</span>
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">已发现漏洞</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">356</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Badge variant="destructive" className="mr-1">
                                    高危 24
                                </Badge>
                                <Badge className="bg-yellow-500 text-white hover:bg-yellow-400 mr-1">中危 78</Badge>
                                <Badge variant="outline">低危 254</Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">已发现资产</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,892</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <span className="mr-2">域名: 245</span>
                                <span className="mr-2">IP: 1,024</span>
                                <span>Web: 623</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">平均扫描时间</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">42分钟</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <span>
                                    较上月 <span className="text-green-500">-15%</span>
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="vulnerabilities">
                    <TabsList className="mb-4">
                        <TabsTrigger value="vulnerabilities">漏洞趋势</TabsTrigger>
                        <TabsTrigger value="assets">资产趋势</TabsTrigger>
                        <TabsTrigger value="scans">扫描任务</TabsTrigger>
                    </TabsList>

                    <TabsContent value="vulnerabilities" className="m-0">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>漏洞严重程度分布</CardTitle>
                                    <CardDescription>按严重程度统计漏洞数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示漏洞严重程度分布饼图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>漏洞发现趋势</CardTitle>
                                    <CardDescription>按时间统计漏洞发现数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示漏洞发现趋势折线图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>漏洞类型分布</CardTitle>
                                    <CardDescription>按漏洞类型统计数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示漏洞类型分布柱状图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="assets" className="m-0">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>资产类型分布</CardTitle>
                                    <CardDescription>按资产类型统计数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示资产类型分布饼图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>资产发现趋势</CardTitle>
                                    <CardDescription>按时间统计资产发现数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示资产发现趋势折线图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Web技术分布</CardTitle>
                                    <CardDescription>按Web技术类型统计数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示Web技术分布柱状图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="scans" className="m-0">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>扫描任务状态分布</CardTitle>
                                    <CardDescription>按状态统计扫描任务数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示扫描任务状态分布饼图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>扫描任务趋势</CardTitle>
                                    <CardDescription>按时间统计扫描任务数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示扫描任务趋势折线图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>扫描时间分布</CardTitle>
                                    <CardDescription>按扫描时长统计任务数量</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            此处显示扫描时间分布柱状图
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
