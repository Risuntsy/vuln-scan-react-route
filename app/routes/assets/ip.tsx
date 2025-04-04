"use client";

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
import { ChevronDown, ChevronRight, Download, Eye, Filter, MoreHorizontal, Search, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useFilterStore } from "#/hooks/use-filter-store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "#/components/ui/dialog";
import { Label } from "#/components/ui/label";
import React from "react";
import { DASHBOARD_ROUTE } from "#/routes";
import Header from "#/components/main/header";

import { ips } from "#/api/mock-data";

export default function IPsPage() {
    const [expandedIPs, setExpandedIPs] = useState<Record<string, boolean>>({});
    const { filters, updateFilters, clearFilters, filterData, isOpen, setIsOpen } = useFilterStore({
        storageKey: "ips-filters"
    });

    const toggleIP = (ip: string) => {
        setExpandedIPs((prev) => ({
            ...prev,
            [ip]: !prev[ip]
        }));
    };

    // 过滤IP数据
    const filteredIPs = filterData(ips, {
        domain: (item) => {
            if (!filters.domain) return true;
            const domainFilters = filters.domain.split(",").map((d) => d.trim().toLowerCase());
            return item.domains.some((domain) => domainFilters.some((filter) => domain.toLowerCase().includes(filter)));
        },
        ip: (item) => !filters.ip || item.ip.includes(filters.ip) || item.cidr.includes(filters.ip),
        port: (item) => {
            if (!filters.port) return true;
            const portFilters = filters.port.split(",").map((port) => port.trim());
            return item.ports.some((port) => portFilters.some((filter) => port.number.toString() === filter));
        }
    });

    // 计算活跃状态
    const activeFilters = Object.values(filters).filter(Boolean).length;

    return (
        <>
            <Header routes={[{ name: "仪表盘", href: DASHBOARD_ROUTE }, { name: "IP资产" }]}>
                <div>
                    <h1 className="text-2xl font-bold">IP资产</h1>
                    <p className="text-muted-foreground text-sm">管理所有发现的IP资产</p>
                </div>
            </Header>

            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="搜索IP..."
                                        className="pl-8 w-[250px]"
                                        value={filters.ip || ""}
                                        onChange={(e) =>
                                            updateFilters({
                                                ...filters,
                                                ip: e.target.value
                                            })
                                        }
                                    />
                                    {filters.ip && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1 h-6 w-6"
                                            onClick={() =>
                                                updateFilters({
                                                    ...filters,
                                                    ip: ""
                                                })
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="relative">
                                            <Filter className="w-4 h-4 mr-2" />
                                            高级筛选
                                            {activeFilters > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                                                >
                                                    {activeFilters}
                                                </Badge>
                                            )}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>高级筛选</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="domain-filter">域名关键字 (多个用逗号分隔)</Label>
                                                <Input
                                                    id="domain-filter"
                                                    placeholder="输入域名关键字"
                                                    value={filters.domain || ""}
                                                    onChange={(e) =>
                                                        updateFilters({
                                                            ...filters,
                                                            domain: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="ip-filter">IP地址/CIDR</Label>
                                                <Input
                                                    id="ip-filter"
                                                    placeholder="如: 192.168.1, 10.0.0.0/24"
                                                    value={filters.ip || ""}
                                                    onChange={(e) =>
                                                        updateFilters({
                                                            ...filters,
                                                            ip: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="port-filter">端口 (多个用逗号分隔)</Label>
                                                <Input
                                                    id="port-filter"
                                                    placeholder="如: 80, 443, 8080"
                                                    value={filters.port || ""}
                                                    onChange={(e) =>
                                                        updateFilters({
                                                            ...filters,
                                                            port: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={clearFilters}>
                                                清除筛选
                                            </Button>
                                            <DialogClose asChild>
                                                <Button type="submit">应用筛选</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
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

                        {activeFilters > 0 && (
                            <div className="mb-4 flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">筛选条件:</span>
                                {filters.domain && (
                                    <Badge variant="secondary" className="gap-1">
                                        域名: {filters.domain}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1 p-0"
                                            onClick={() =>
                                                updateFilters({
                                                    ...filters,
                                                    domain: ""
                                                })
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}
                                {filters.ip && (
                                    <Badge variant="secondary" className="gap-1">
                                        IP: {filters.ip}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1 p-0"
                                            onClick={() =>
                                                updateFilters({
                                                    ...filters,
                                                    ip: ""
                                                })
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}
                                {filters.port && (
                                    <Badge variant="secondary" className="gap-1">
                                        端口: {filters.port}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1 p-0"
                                            onClick={() =>
                                                updateFilters({
                                                    ...filters,
                                                    port: ""
                                                })
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                )}
                                <Button variant="ghost" size="sm" className="h-6 px-2" onClick={clearFilters}>
                                    清除全部
                                </Button>
                            </div>
                        )}

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[30px]"></TableHead>
                                        <TableHead>IP地址</TableHead>
                                        <TableHead>CIDR</TableHead>
                                        <TableHead>关联域名</TableHead>
                                        <TableHead>端口数量</TableHead>
                                        <TableHead>所属项目</TableHead>
                                        <TableHead>发现时间</TableHead>
                                        <TableHead className="text-right">操作</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredIPs.length > 0 ? (
                                        filteredIPs.map((ip, index) => (
                                            <React.Fragment key={`ip-${index}`}>
                                                <TableRow key={`ip-${index}`}>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => toggleIP(ip.ip)}
                                                        >
                                                            {expandedIPs[ip.ip] ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{ip.ip}</TableCell>
                                                    <TableCell>{ip.cidr}</TableCell>
                                                    <TableCell>{ip.domains.join(", ")}</TableCell>
                                                    <TableCell>{ip.ports.length}</TableCell>
                                                    <TableCell>
                                                        <Link
                                                            href={`/projects/${ip.project}`}
                                                            className="text-primary hover:underline"
                                                        >
                                                            {ip.project}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{ip.discoveredAt}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>查看详情</DropdownMenuItem>
                                                                <DropdownMenuItem>重新扫描</DropdownMenuItem>
                                                                <DropdownMenuItem>添加标签</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                                {expandedIPs[ip.ip] && (
                                                    <TableRow key={`ip-details-${index}`} className="bg-muted/50">
                                                        <TableCell colSpan={8} className="p-4">
                                                            <div>
                                                                <h4 className="text-sm font-medium mb-2">
                                                                    开放端口和服务
                                                                </h4>
                                                                <div className="rounded-md border bg-background">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead>端口</TableHead>
                                                                                <TableHead>服务</TableHead>
                                                                                <TableHead>Web应用</TableHead>
                                                                                <TableHead className="text-right">
                                                                                    操作
                                                                                </TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {ip.ports.map((port, portIndex) => (
                                                                                <TableRow key={`port-${portIndex}`}>
                                                                                    <TableCell className="font-medium">
                                                                                        {port.number}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {port.service}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {port.web ? (
                                                                                            <div>
                                                                                                <div className="font-medium">
                                                                                                    {port.web.title}
                                                                                                </div>
                                                                                                <div className="text-xs text-muted-foreground">
                                                                                                    {port.web.server}
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <span className="text-muted-foreground">
                                                                                                -
                                                                                            </span>
                                                                                        )}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right">
                                                                                        {port.web && (
                                                                                            <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                asChild
                                                                                            >
                                                                                                <a
                                                                                                    href={port.web.url}
                                                                                                    target="_blank"
                                                                                                    rel="noopener noreferrer"
                                                                                                >
                                                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                                                    查看
                                                                                                </a>
                                                                                            </Button>
                                                                                        )}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                无匹配数据
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                显示 1-{filteredIPs.length} 共 {filteredIPs.length} 条记录
                            </div>
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
