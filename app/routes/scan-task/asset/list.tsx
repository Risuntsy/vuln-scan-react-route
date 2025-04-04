import {
  useLoaderData,
  type LoaderFunctionArgs,
  redirect,
  useSearchParams,
  type SetURLSearchParams
} from "react-router";
import {
  AssetListItem,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  PortServiceList,
  ScrollArea,
  ServiceIconGrid,
  ServiceTypeList,
  StatisticsList
} from "#/components";
import { getSearchParams, getToken } from "#/lib";
import {
  getTaskDetail,
  getAssetData,
  getAssetStatistics,
  type AssetData,
  type StatisticsItem,
  type IconStatisticsItem
} from "#/api";
import { ScanTaskHeader } from "#/components";
import { ChevronLeft, ChevronRight, RotateCcw, Search, HelpCircle, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "#/components";
import { useState } from "react";
import React from "react";

// 搜索帮助内容配置
const searchHelpContent = {
  operators: [
    { name: "=", description: "匹配，表示查询包含关键词资产（支持正则输入）" },
    { name: "!=", description: "剔除，表示剔除包含关键词资产" },
    { name: "==", description: "精准匹配，表示仅查询关键词资产" },
    { name: "&&", description: "与条件" },
    { name: "||", description: "或条件" },
    { name: "()", description: "括号内容优先级最高" }
  ],
  keywords: [
    { name: "app", example: 'app="Nginx"', description: "检索指定组件" },
    { name: "body", example: 'body="bootstrap.min.css"', description: "检索HTTP响应体" },
    { name: "header", example: 'header="rememberMe"', description: "检索HTTP请求头" },
    { name: "title", example: 'title="admin console"', description: "检测网站标题" },
    { name: "statuscode", example: 'statuscode=="403"', description: "检索响应码，不支持模糊查找" },
    { name: "icon", example: 'icon="54256234"', description: "根据网站图标hash检索" },
    { name: "ip", example: 'ip="192.168.2.1"', description: "检索IP" },
    { name: "port", example: 'port="3306"', description: "检索端口" },
    { name: "domain", example: 'domain="example.com"', description: "检索域名" },
    { name: "service", example: 'service="ssh"', description: "根据服务检索" },
    { name: "banner", example: 'banner="SSH-2.0-OpenSSH"', description: "检索非HTTP资产的Banner" },
    { name: "project", example: 'project="Hackerone"', description: "根据项目名称检索" },
    { name: "type", example: 'type="http"', description: "根据服务检索" },
    { name: "task", example: 'task=="test"', description: "根据任务名称检索，仅支持精确查找" },
    { name: "tag", example: 'tag=="test"', description: "find tags" }
  ]
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const {
    search,
    pageIndex,
    pageSize,
    tags: tagsJson
  } = getSearchParams(request, {
    search: "",
    pageIndex: 1,
    pageSize: 20,
    tags: "{}"
  });
  const tags = JSON.parse(tagsJson);
  const token = await getToken(request);
  const { taskId } = params;

  if (!taskId) {
    return redirect("/404", {
      status: 404
    });
  }

  const taskDetail = await getTaskDetail({ id: taskId, token });

  const taskFilter = { task: [taskDetail.name], ...tags };

  const [assetList, assetStatistics] = await Promise.all([
    getAssetData({ filter: taskFilter, search, pageIndex, pageSize, token }),
    getAssetStatistics({ filter: taskFilter, token })
  ]);

  return {
    taskId,
    taskDetail,
    assetList,
    search,
    pageIndex,
    pageSize,
    assetStatistics
  };
}

export default function ScanTaskAssetPage() {
  const { taskDetail, assetList, taskId, assetStatistics, pageIndex, pageSize } = useLoaderData<typeof loader>();
  const { list = [], total = 0 } = assetList || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function selectTag(type: string, value: string | number) {
    setSearchParams(prev => {
      const currentTags = JSON.parse(prev.get("tags") || "{}");
      const existingValues = currentTags[type] || [];
      prev.set(
        "tags",
        JSON.stringify({
          ...currentTags,
          [type]: [...existingValues, value]
        })
      );
      return prev;
    });
  }

  function removeTag(type: string, value: string | number) {
    setSearchParams(prev => {
      const currentTags = JSON.parse(prev.get("tags") || "{}");
      const existingValues = currentTags[type] || [];
      prev.set(
        "tags",
        JSON.stringify({
          ...currentTags,
          [type]: existingValues.filter((v: string | number) => v !== value)
        })
      );
      return prev;
    });
  }

  return (
    <div className="flex flex-col gap-4 max-h-screen">
      <ScanTaskHeader taskId={taskId} taskDetail={taskDetail} routes={[{ name: "资产列表" }]} />

      <div className="flex-1 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 max-h-[calc(100vh-9rem)] overflow-y-auto">
          <FilterBar
            search={search}
            setSearch={setSearch}
            pageIndex={pageIndex}
            setSearchParams={setSearchParams}
            hasNextPage={list.length >= pageSize}
            selectedTags={JSON.parse(searchParams.get("tags") || "{}")}
            totalPage={Math.ceil(total / pageSize)}
            total={total}
            removeTag={removeTag}
          />
          <AssetListSection list={list} />
        </div>

        <div className="lg:w-80 max-h-[calc(100vh-10rem)] lg:max-h-[calc(100vh-9rem)]">
          <StatisticsSidebar selectTag={selectTag} removeTag={removeTag} assetStatistics={assetStatistics} />
        </div>
      </div>
    </div>
  );
}

function SearchHelpPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="font-medium">
            筛选条件
            <br />
            如: domain="example.com", port="80"
          </div>
          <div>
            <h4 className="font-medium mb-2">运算符</h4>
            <div className="space-y-1">
              {searchHelpContent.operators.map(op => (
                <div key={op.name} className="text-sm">
                  <span className="font-mono bg-muted px-1 rounded">{op.name}</span> - {op.description}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">关键字</h4>
            <div className="space-y-1">
              {searchHelpContent.keywords.map(kw => (
                <div key={kw.name} className="text-sm">
                  <span className="font-mono bg-muted px-1 rounded">{kw.name}</span> - {kw.description}
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">例: {kw.example}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// 搜索过滤栏组件
function FilterBar({
  search,
  setSearch,
  pageIndex,
  totalPage,
  setSearchParams,
  hasNextPage,
  selectedTags,
  total,
  removeTag
}: {
  search: string;
  setSearch: (value: string) => void;
  pageIndex: number;
  totalPage: number;
  setSearchParams: SetURLSearchParams;
  hasNextPage: boolean;
  selectedTags: { [key: string]: string[] };
  total: number;
  removeTag: (type: string, value: string) => void;
}) {
  const [isPageInputOpen, setIsPageInputOpen] = useState(false);
  const [pageInput, setPageInput] = useState(pageIndex.toString());

  return (
    <div className="space-y-2 sticky top-0 bg-background p-2 z-10">
      <div className="flex flex-row gap-2">
        <div className="flex-1 relative">
          <Input
            className="pr-10"
            placeholder={`筛选条件 (例如: domain="example.com", port="80")`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <SearchHelpPopover />
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            title="筛选"
            onClick={() => {
              setSearchParams(prev => {
                prev.set("search", search);
                return prev;
              });
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="重置"
            onClick={() => {
              setSearchParams(prev => {
                prev.delete("search");
                prev.delete("tags");
                return prev;
              });
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {isPageInputOpen ? (
            <>
              <Input
                type="number"
                value={pageInput}
                onChange={e => setPageInput(e.target.value)}
                className="w-20"
                min={1}
                max={totalPage}
              />
              <Button
                size="sm"
                onClick={() => {
                  setSearchParams(prev => {
                    prev.set("pageIndex", pageInput);
                    return prev;
                  });
                  setIsPageInputOpen(false);
                }}
              >
                确定
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="w-16" onClick={() => setIsPageInputOpen(true)}>
                第 {pageIndex} 页
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Button
            variant="outline"
            size="sm"
            disabled={pageIndex <= 1}
            onClick={() =>
              setSearchParams(prev => {
                prev.set("pageIndex", (pageIndex - 1).toString());
                return prev;
              })
            }
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNextPage}
            onClick={() =>
              setSearchParams(prev => {
                prev.set("pageIndex", (pageIndex + 1).toString());
                return prev;
              })
            }
          >
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <span>共 {total} 条结果</span>
        </div>
      </div>
      {Object.keys(selectedTags).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(selectedTags).map(([type, values]) =>
            values.map(value => (
              <Badge key={`${type}-${value}`} variant="secondary" className="flex items-center gap-1">
                {value}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-transparent"
                  onClick={() => removeTag(type, value)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function AssetListSection({ list }: { list: AssetData[] }) {
  return (
    <Card className="mt-4 p-2">
      <CardContent>
        <h3 className="text-lg font-medium mb-4">资产列表</h3>
        {list.length === 0 ? (
          <p className="text-muted-foreground">暂无资产数据</p>
        ) : (
          <div className="space-y-2">
            {list.map((asset, index) => (
              <AssetListItem key={index} {...asset} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatisticsSidebar({
  selectTag,
  removeTag,
  assetStatistics
}: {
  selectTag: (type: string, value: string | number) => void;
  removeTag: (type: string, value: string | number) => void;
  assetStatistics: {
    Port: StatisticsItem[];
    Service: StatisticsItem[];
    Icon: IconStatisticsItem[];
    Product: StatisticsItem[];
  };
}) {
  return (
    <ScrollArea className="flex flex-col gap- h-full">
      <PortServiceList data={assetStatistics.Port} compact selectTag={selectTag} removeTag={removeTag} />
      <ServiceTypeList data={assetStatistics.Service} compact selectTag={selectTag} removeTag={removeTag} />
      <StatisticsList data={assetStatistics.Product} compact selectTag={selectTag} removeTag={removeTag} />
      <ServiceIconGrid data={assetStatistics.Icon} compact selectTag={selectTag} removeTag={removeTag} />
    </ScrollArea>
  );
}
