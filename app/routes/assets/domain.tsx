// "use client";

// import { Button } from "#/components/ui/button";
// import { Card, CardContent } from "#/components/ui/card";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger
// } from "#/components/ui/dropdown-menu";
// import { Input } from "#/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
// import { Badge } from "#/components/ui/badge";
// import {
//     ChevronDown,
//     ChevronRight,
//     Download,
//     ExternalLink,
//     Eye,
//     Filter,
//     MoreHorizontal,
//     Plus,
//     Search,
//     X
// } from "lucide-react";
// import { useState } from "react";
// import Link from "next/link";
// // import { useFilterStore } from "#/hooks/use-filter-store";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogFooter,
//     DialogClose
// } from "#/components/ui/dialog";
// import { Label } from "#/components/ui/label";
// import React from "react";
// import Header from "#/components/main/header";
// import { DASHBOARD_ROUTE } from "#/routes";

// // import { domains } from "#/api/mock-data";

// export default function DomainsPage() {
//     const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});
//     const { filters, updateFilters, clearFilters, filterData, isOpen, setIsOpen } = useFilterStore({
//         storageKey: "domains-filters"
//     });

//     const toggleDomain = (domain: string) => {
//         setExpandedDomains((prev) => ({
//             ...prev,
//             [domain]: !prev[domain]
//         }));
//     };

//     // // 过滤域名数据
//     // const filteredDomains = filterData(domains, {
//     //     domain: (item) => !filters.domain || item.domain.toLowerCase().includes(filters.domain.toLowerCase()),
//     //     ip: (item) => {
//     //         if (!filters.ip) return true;
//     //         const ipFilters = filters.ip.split(",").map((ip) => ip.trim());
//     //         return item.ips.some((ip) => ipFilters.some((filter) => ip.ip.includes(filter)));
//     //     },
//     //     port: (item) => {
//     //         if (!filters.port) return true;
//     //         const portFilters = filters.port.split(",").map((port) => port.trim());
//     //         return item.ips.some((ip) =>
//     //             ip.ports.some((port) => portFilters.some((filter) => port.toString() === filter))
//     //         );
//     //     }
//     // });

//     // 计算活跃状态
//     const activeFilters = Object.values(filters).filter(Boolean).length;

//     return (
//         <>
//             <Header routes={[{ name: "仪表盘", href: DASHBOARD_ROUTE }, { name: "域名资产" }]}>
//                 <div>
//                     <h1 className="text-2xl font-bold">域名资产</h1>
//                     <p className="text-muted-foreground text-sm">管理所有发现的域名资产</p>
//                 </div>
//             </Header>

//             <div className="p-6">
//                 <Card>
//                     <CardContent className="p-6">
//                         <div className="flex items-center justify-between mb-6">
//                             <div className="flex items-center gap-2">
//                                 <div className="relative">
//                                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                                     <Input
//                                         type="search"
//                                         placeholder="搜索域名..."
//                                         className="pl-8 w-[250px]"
//                                         value={filters.domain || ""}
//                                         onChange={(e) => updateFilters({ ...filters, domain: e.target.value })}
//                                     />
//                                     {filters.domain && (
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             className="absolute right-1 top-1 h-6 w-6"
//                                             onClick={() => updateFilters({ ...filters, domain: "" })}
//                                         >
//                                             <X className="h-4 w-4" />
//                                         </Button>
//                                     )}
//                                 </div>
//                                 <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                                     <DialogTrigger asChild>
//                                         <Button variant="outline" size="sm" className="relative">
//                                             <Filter className="w-4 h-4 mr-2" />
//                                             高级筛选
//                                             {activeFilters > 0 && (
//                                                 <Badge
//                                                     variant="secondary"
//                                                     className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
//                                                 >
//                                                     {activeFilters}
//                                                 </Badge>
//                                             )}
//                                         </Button>
//                                     </DialogTrigger>
//                                     <DialogContent>
//                                         <DialogHeader>
//                                             <DialogTitle>高级筛选</DialogTitle>
//                                         </DialogHeader>
//                                         <div className="grid gap-4 py-4">
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="domain-filter">域名关键字</Label>
//                                                 <Input
//                                                     id="domain-filter"
//                                                     placeholder="输入域名关键字"
//                                                     value={filters.domain || ""}
//                                                     onChange={(e) =>
//                                                         updateFilters({
//                                                             ...filters,
//                                                             domain: e.target.value
//                                                         })
//                                                     }
//                                                 />
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="ip-filter">IP地址 (多个用逗号分隔)</Label>
//                                                 <Input
//                                                     id="ip-filter"
//                                                     placeholder="如: 192.168.1, 10.0.0"
//                                                     value={filters.ip || ""}
//                                                     onChange={(e) => updateFilters({ ...filters, ip: e.target.value })}
//                                                 />
//                                             </div>
//                                             <div className="grid gap-2">
//                                                 <Label htmlFor="port-filter">端口 (多个用逗号分隔)</Label>
//                                                 <Input
//                                                     id="port-filter"
//                                                     placeholder="如: 80, 443, 8080"
//                                                     value={filters.port || ""}
//                                                     onChange={(e) =>
//                                                         updateFilters({ ...filters, port: e.target.value })
//                                                     }
//                                                 />
//                                             </div>
//                                         </div>
//                                         <DialogFooter>
//                                             <Button variant="outline" onClick={clearFilters}>
//                                                 清除筛选
//                                             </Button>
//                                             <DialogClose asChild>
//                                                 <Button type="submit">应用筛选</Button>
//                                             </DialogClose>
//                                         </DialogFooter>
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <Select defaultValue="10">
//                                     <SelectTrigger className="w-[80px]">
//                                         <SelectValue placeholder="每页行数" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="10">10</SelectItem>
//                                         <SelectItem value="20">20</SelectItem>
//                                         <SelectItem value="50">50</SelectItem>
//                                         <SelectItem value="100">100</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                                 <Button variant="outline" size="icon">
//                                     <Download className="w-4 h-4" />
//                                 </Button>
//                             </div>
//                         </div>

//                         {activeFilters > 0 && (
//                             <div className="mb-4 flex items-center gap-2 text-sm">
//                                 <span className="text-muted-foreground">筛选条件:</span>
//                                 {filters.domain && (
//                                     <Badge variant="secondary" className="gap-1">
//                                         域名: {filters.domain}
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             className="h-4 w-4 ml-1 p-0"
//                                             onClick={() => updateFilters({ ...filters, domain: "" })}
//                                         >
//                                             <X className="h-3 w-3" />
//                                         </Button>
//                                     </Badge>
//                                 )}
//                                 {filters.ip && (
//                                     <Badge variant="secondary" className="gap-1">
//                                         IP: {filters.ip}
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             className="h-4 w-4 ml-1 p-0"
//                                             onClick={() => updateFilters({ ...filters, ip: "" })}
//                                         >
//                                             <X className="h-3 w-3" />
//                                         </Button>
//                                     </Badge>
//                                 )}
//                                 {filters.port && (
//                                     <Badge variant="secondary" className="gap-1">
//                                         端口: {filters.port}
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             className="h-4 w-4 ml-1 p-0"
//                                             onClick={() => updateFilters({ ...filters, port: "" })}
//                                         >
//                                             <X className="h-3 w-3" />
//                                         </Button>
//                                     </Badge>
//                                 )}
//                                 <Button variant="ghost" size="sm" className="h-6 px-2" onClick={clearFilters}>
//                                     清除全部
//                                 </Button>
//                             </div>
//                         )}

//                         <div className="rounded-md border">
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead className="w-[30px]"></TableHead>
//                                         <TableHead>域名</TableHead>
//                                         <TableHead>所属项目</TableHead>
//                                         <TableHead>状态</TableHead>
//                                         <TableHead>IP数量</TableHead>
//                                         <TableHead>发现时间</TableHead>
//                                         <TableHead className="text-right">操作</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {filteredDomains.length > 0 ? (
//                                         filteredDomains.map((domain, index) => (
//                                             <React.Fragment key={`domain-${index}`}>
//                                                 <TableRow key={`domain-${index}`}>
//                                                     <TableCell>
//                                                         <Button
//                                                             variant="ghost"
//                                                             size="icon"
//                                                             onClick={() => toggleDomain(domain.domain)}
//                                                         >
//                                                             {expandedDomains[domain.domain] ? (
//                                                                 <ChevronDown className="h-4 w-4" />
//                                                             ) : (
//                                                                 <ChevronRight className="h-4 w-4" />
//                                                             )}
//                                                         </Button>
//                                                     </TableCell>
//                                                     <TableCell className="font-medium">{domain.domain}</TableCell>
//                                                     <TableCell>
//                                                         <Link
//                                                             href={`/projects/${domain.project}`}
//                                                             className="text-primary hover:underline"
//                                                         >
//                                                             {domain.project}
//                                                         </Link>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         {domain.status === "active" ? (
//                                                             <Badge>活跃</Badge>
//                                                         ) : (
//                                                             <Badge variant="outline">未活跃</Badge>
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell>{domain.ips.length}</TableCell>
//                                                     <TableCell>{domain.discoveredAt}</TableCell>
//                                                     <TableCell className="text-right">
//                                                         <div className="flex items-center justify-end space-x-1">
//                                                             <Button variant="ghost" size="icon" asChild>
//                                                                 <a
//                                                                     href={`http://${domain.domain}`}
//                                                                     target="_blank"
//                                                                     rel="noopener noreferrer"
//                                                                 >
//                                                                     <ExternalLink className="w-4 h-4" />
//                                                                 </a>
//                                                             </Button>
//                                                             <DropdownMenu>
//                                                                 <DropdownMenuTrigger asChild>
//                                                                     <Button variant="ghost" size="icon">
//                                                                         <MoreHorizontal className="w-4 h-4" />
//                                                                     </Button>
//                                                                 </DropdownMenuTrigger>
//                                                                 <DropdownMenuContent align="end">
//                                                                     <DropdownMenuItem>查看详情</DropdownMenuItem>
//                                                                     <DropdownMenuItem>重新扫描</DropdownMenuItem>
//                                                                     <DropdownMenuItem>添加标签</DropdownMenuItem>
//                                                                 </DropdownMenuContent>
//                                                             </DropdownMenu>
//                                                         </div>
//                                                     </TableCell>
//                                                 </TableRow>
//                                                 {expandedDomains[domain.domain] && (
//                                                     <TableRow key={`domain-details-${index}`} className="bg-muted/50">
//                                                         <TableCell colSpan={7} className="p-4">
//                                                             <div>
//                                                                 <h4 className="text-sm font-medium mb-2">
//                                                                     关联的IP地址
//                                                                 </h4>
//                                                                 <div className="rounded-md border bg-background">
//                                                                     <Table>
//                                                                         <TableHeader>
//                                                                             <TableRow>
//                                                                                 <TableHead>IP地址</TableHead>
//                                                                                 <TableHead>开放端口</TableHead>
//                                                                                 <TableHead>服务</TableHead>
//                                                                                 <TableHead className="text-right">
//                                                                                     操作
//                                                                                 </TableHead>
//                                                                             </TableRow>
//                                                                         </TableHeader>
//                                                                         <TableBody>
//                                                                             {domain.ips.map((ip, ipIndex) => (
//                                                                                 <TableRow key={`ip-${ipIndex}`}>
//                                                                                     <TableCell className="font-medium">
//                                                                                         {ip.ip}
//                                                                                     </TableCell>
//                                                                                     <TableCell>
//                                                                                         {ip.ports.join(", ")}
//                                                                                     </TableCell>
//                                                                                     <TableCell>
//                                                                                         {ip.services.join(", ")}
//                                                                                     </TableCell>
//                                                                                     <TableCell className="text-right">
//                                                                                         <Button
//                                                                                             variant="ghost"
//                                                                                             size="sm"
//                                                                                             asChild
//                                                                                         >
//                                                                                             <Link
//                                                                                                 href={`/assets/ips?ip=${ip.ip}`}
//                                                                                             >
//                                                                                                 <Eye className="w-4 h-4 mr-2" />
//                                                                                                 查看详情
//                                                                                             </Link>
//                                                                                         </Button>
//                                                                                     </TableCell>
//                                                                                 </TableRow>
//                                                                             ))}
//                                                                         </TableBody>
//                                                                     </Table>
//                                                                 </div>
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 )}
//                                             </React.Fragment>
//                                         ))
//                                     ) : (
//                                         <TableRow>
//                                             <TableCell colSpan={7} className="h-24 text-center">
//                                                 无匹配数据
//                                             </TableCell>
//                                         </TableRow>
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </div>

//                         <div className="flex items-center justify-between mt-4">
//                             <div className="text-sm text-muted-foreground">
//                                 显示 1-{filteredDomains.length} 共 {filteredDomains.length} 条记录
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <Button variant="outline" size="sm" disabled>
//                                     上一页
//                                 </Button>
//                                 <Button variant="outline" size="sm" disabled>
//                                     下一页
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         </>
//     );
// }


export default function DomainsPage() {
    return <div>DomainsPage</div>;
}
