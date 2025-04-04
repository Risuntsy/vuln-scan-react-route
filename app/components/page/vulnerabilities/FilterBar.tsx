import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "#/libs/utils/index.ts";
interface FilterBarProps {
  onFilterChange: (key: string, value: string) => void;
  onSearch: (value: string) => void;
  className?: string;
}

export function FilterBar({ onFilterChange, onSearch, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <div className="relative flex-1 min-w-[250px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="搜索漏洞..." className="pl-8" onChange={e => onSearch(e.target.value)} />
      </div>

      <Select onValueChange={value => onFilterChange("network", value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="IP类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="internal">内网</SelectItem>
          <SelectItem value="external">外网</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={value => onFilterChange("status", value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="修复状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="unfixed">未修复</SelectItem>
          <SelectItem value="fixed">已修复</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={value => onFilterChange("severity", value)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="漏洞等级" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="critical">严重</SelectItem>
          <SelectItem value="high">高危</SelectItem>
          <SelectItem value="medium">中危</SelectItem>
          <SelectItem value="low">低危</SelectItem>
          <SelectItem value="info">提示</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
