import { Form, Link, type SetURLSearchParams } from "react-router";
import {
  Input,
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Header,
  CustomPagination
} from "#/components";
import { Download, Search, Plus } from "lucide-react";

// 页面大小选项
const PAGE_SIZES = [10, 20, 50, 100];

// 任务列表布局组件的props类型
export interface TaskListLayoutProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  routes: Array<{ name: string; href?: string }>; 
  createRoute?: string;
  createButtonText?: string;
  searchValue: string;
  setSearchParams: SetURLSearchParams;
  pageSize: number;
  pageIndex: number;
  total: number;
  children: React.ReactNode;
  showDownload?: boolean;
}

// 任务列表过滤栏组件
export function TaskListFilterBar({
  searchValue,
  searchPlaceholder = "搜索...",
  setSearchParams,
  pageSize,
  showDownload = true
}: {
  searchValue: string;
  searchPlaceholder?: string;
  setSearchParams: SetURLSearchParams;
  pageSize: number;
  showDownload?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 border-b pb-4">
      {/* 搜索框 */}
      <div className="relative w-full sm:w-auto flex-1 max-w-sm">
        <Form role="search" method="get">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder={searchPlaceholder}
            className="pl-8"
            defaultValue={searchValue}
            onChange={e => {
              if (e.target.value === "") {
                setSearchParams(prev => {
                  prev.delete("search");
                  return prev;
                });
              }
            }}
          />
        </Form>
      </div>

      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {/* 页面大小选择器 */}
        <div className="flex items-center gap-1">
          <Select
            defaultValue={pageSize.toString()}
            onValueChange={value =>
              setSearchParams(prev => {
                prev.set("pageSize", value);
                prev.set("pageIndex", "1");
                return prev;
              })
            }
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="每页行数" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(s => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* 下载按钮 */}
          {showDownload && (
            <Button variant="outline" size="icon" className="ml-1">
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// 主任务列表布局组件
export function TaskListLayout({
  title,
  subtitle,
  searchPlaceholder,
  routes,
  createRoute,
  createButtonText = "新建任务",
  searchValue,
  setSearchParams,
  pageSize,
  pageIndex,
  total,
  children,
  showDownload
}: TaskListLayoutProps) {
  return (
    <div className="space-y-2 max-w-screen h-full p-2">
      <Header routes={routes}>
        <div className="flex items-center gap-2 justify-between w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
          {createRoute && (
            <Link to={createRoute}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {createButtonText}
              </Button>
            </Link>
          )}
        </div>
      </Header>

      <Card className="h-full">
        <CardContent className="p-6">
          {/* 过滤栏 */}
          <TaskListFilterBar
            searchValue={searchValue}
            searchPlaceholder={searchPlaceholder}
            setSearchParams={setSearchParams}
            pageSize={pageSize}
            showDownload={showDownload}
          />

          {/* 任务列表内容 */}
          {children}

          {/* 分页 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sticky bottom-0 bg-background py-3 border-t">
            <div className="text-sm text-muted-foreground">
              显示 {total > 0 ? (pageIndex - 1) * pageSize + 1 : 0}-{Math.min(pageIndex * pageSize, total)}{" "}
              共 {total} 条记录
            </div>
            <CustomPagination
              total={total}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setSearchParams={setSearchParams}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 