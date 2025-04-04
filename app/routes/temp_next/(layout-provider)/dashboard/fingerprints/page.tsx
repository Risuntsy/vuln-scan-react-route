import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { Badge } from "#/components/ui/badge";
import { ChevronDown, Download, Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { DASHBOARD_ROUTE, NEW_FINGERPRINT_ROUTE } from "#/routes";
import Header from "#/components/main/header";
import Link from "next/link";

// 模拟数据
const fingerprints = [
    {
        id: "FP-001",
        name: "Apache",
        type: "web_server",
        pattern: "Apache/[0-9\\.]+",
        examples: ["Apache/2.4.41"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-002",
        name: "Nginx",
        type: "web_server",
        pattern: "nginx/[0-9\\.]+",
        examples: ["nginx/1.18.0", "nginx/1.20.0"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-003",
        name: "IIS",
        type: "web_server",
        pattern: "IIS/[0-9\\.]+",
        examples: ["IIS/10.0"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-004",
        name: "jQuery",
        type: "javascript_library",
        pattern: "jquery-[0-9\\.]+\\.min\\.js",
        examples: ["jquery-3.6.0.min.js"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-005",
        name: "Bootstrap",
        type: "css_framework",
        pattern: "bootstrap-[0-9\\.]+\\.min\\.css",
        examples: ["bootstrap-5.1.3.min.css"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-006",
        name: "WordPress",
        type: "cms",
        pattern: "wp-content|wp-includes",
        examples: ["wp-content/themes", "wp-includes/js"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-007",
        name: "Drupal",
        type: "cms",
        pattern: "Drupal [0-9\\.]+",
        examples: ["Drupal 9.3.0"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-008",
        name: "PHP",
        type: "programming_language",
        pattern: "X-Powered-By: PHP/[0-9\\.]+",
        examples: ["X-Powered-By: PHP/8.1.0"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-009",
        name: "ASP.NET",
        type: "framework",
        pattern: "X-AspNet-Version: [0-9\\.]+",
        examples: ["X-AspNet-Version: 4.0.30319"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    },
    {
        id: "FP-010",
        name: "React",
        type: "javascript_framework",
        pattern: "react\\.production\\.min\\.js|react-dom\\.production\\.min\\.js",
        examples: ["react.production.min.js"],
        createdAt: "2023-01-15",
        updatedAt: "2023-05-10"
    }
];

export default function FingerprintsPage() {
    return (
        <>
            <Header routes={[{ name: "仪表盘", href: DASHBOARD_ROUTE }, { name: "指纹库" }]}>
                <div className="flex items-center gap-2 justify-between w-full">
                    <div>
                        <h1 className="text-2xl font-bold">指纹库</h1>
                        <p className="text-muted-foreground text-sm">管理系统指纹识别规则</p>
                    </div>
                    <Link href={NEW_FINGERPRINT_ROUTE}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            添加指纹规则
                        </Button>
                    </Link>
                </div>
            </Header>

            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="search" placeholder="搜索指纹..." className="pl-8 w-[250px]" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Filter className="w-4 h-4 mr-2" />
                                            筛选
                                            <ChevronDown className="w-4 h-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[200px]">
                                        <DropdownMenuItem>全部指纹</DropdownMenuItem>
                                        <DropdownMenuItem>Web服务器</DropdownMenuItem>
                                        <DropdownMenuItem>编程语言</DropdownMenuItem>
                                        <DropdownMenuItem>框架</DropdownMenuItem>
                                        <DropdownMenuItem>CMS系统</DropdownMenuItem>
                                        <DropdownMenuItem>JavaScript库</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select defaultValue="10">
                                    <SelectTrigger className="w-[80px]">
                                        <SelectValue placeholder="每页行数" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>名称</TableHead>
                                        <TableHead>类型</TableHead>
                                        <TableHead>匹配模式</TableHead>
                                        <TableHead>示例</TableHead>
                                        <TableHead>创建时间</TableHead>
                                        <TableHead>更新时间</TableHead>
                                        <TableHead className="text-right">操作</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fingerprints.map((fingerprint, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{fingerprint.id}</TableCell>
                                            <TableCell>{fingerprint.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {fingerprint.type === "web_server"
                                                        ? "Web服务器"
                                                        : fingerprint.type === "javascript_library"
                                                          ? "JavaScript库"
                                                          : fingerprint.type === "css_framework"
                                                            ? "CSS框架"
                                                            : fingerprint.type === "cms"
                                                              ? "CMS系统"
                                                              : fingerprint.type === "programming_language"
                                                                ? "编程语言"
                                                                : fingerprint.type === "framework"
                                                                  ? "框架"
                                                                  : fingerprint.type === "javascript_framework"
                                                                    ? "JavaScript框架"
                                                                    : fingerprint.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs max-w-[200px] truncate">
                                                {fingerprint.pattern}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {fingerprint.examples.join(", ")}
                                            </TableCell>
                                            <TableCell>{fingerprint.createdAt}</TableCell>
                                            <TableCell>{fingerprint.updatedAt}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>编辑指纹</DropdownMenuItem>
                                                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                                                        <DropdownMenuItem>删除指纹</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">显示 1-10 共 10 条记录</div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" disabled>
                                    上一页
                                </Button>
                                <Button variant="outline" size="sm" disabled>
                                    下一页
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
