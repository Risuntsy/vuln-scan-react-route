import { useState } from "react";
import type { AssetData } from "#/api";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Card, CardContent } from "#/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/components/ui/tooltip";
import { PlusCircle, X, ExternalLink, Server, Globe, Clock, Shield, Info } from "lucide-react";
import { Link } from "react-router";
import { ScrollArea } from "#/components";
import { r } from "#/lib";
import { ASSET_ROUTE } from "#/routes";

type AssetListItemProps = AssetData;

// 资产标签组件
function AssetTags({
  tags,
  onRemove,
  onAdd
}: {
  tags: string[];
  onRemove: (tag: string) => void;
  onAdd: (tag: string) => void;
}) {
  const [newTag, setNewTag] = useState("");

  const handleAdd = () => {
    if (newTag && !tags.includes(newTag)) {
      onAdd(newTag);
      setNewTag("");
    }
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map(tag => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs py-0.5">
          {tag}
          <button onClick={() => onRemove(tag)} className="ml-1 hover:text-destructive">
            <X className="h-2.5 w-2.5" />
          </button>
        </Badge>
      ))}
      <div className="flex items-center">
        <Input
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="添加标签"
          className="h-5 w-20 text-xs"
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={handleAdd}>
          <PlusCircle className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// 资产信息组件
function AssetInfo({ type, host, domain, ip, port, id, statuscode, status, title, service, time }: Partial<AssetData> ) {
  if (!id) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().replace("T", " ").replace("Z", "").slice(0, 19);
  };

  const getStatusVariant = (status: number) => {
    if (status === 1) return "default";
    if (status === 0) return "secondary";
    return "outline";
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {type === "domain" ? (
                <Globe className="h-4 w-4 text-blue-500" />
              ) : (
                <Server className="h-4 w-4 text-green-500" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>类型: {type === "domain" ? "域名" : "IP"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h3 className="font-medium truncate">
          <Link to={r(ASSET_ROUTE, { variables: { assetId: id } })} className="hover:underline">
            {host || domain || ip}
            {port && port !== 80 && port !== 443 && `:${port}`}
          </Link>
        </h3>

        {statuscode && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={statuscode < 400 ? "default" : "destructive"} className="px-1.5 py-0">
                  {statuscode}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>HTTP状态码: {statuscode}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {status !== undefined && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={getStatusVariant(status)} className="px-1.5 py-0">
                  {status === 1 ? "活跃" : status === 0 ? "未知" : "离线"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>资产状态: {status === 1 ? "活跃" : status === 0 ? "未知" : "离线"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {title && <p className="text-xs text-muted-foreground truncate mt-0.5">{title}</p>}

      <div className="flex items-center flex-wrap gap-1 text-xs text-muted-foreground mt-1">
        {service && (
          <Badge variant="outline" className="py-0 h-5">
            {service}
          </Badge>
        )}
        {ip && (
          <span className="flex items-center gap-0.5">
            <Server className="h-3 w-3" />
            {ip}
          </span>
        )}
        {time && (
          <span className="flex items-center gap-0.5">
            <Clock className="h-3 w-3" />
            {formatDate(time)}
          </span>
        )}
      </div>
    </>
  );
}

// 操作按钮组件
function ActionButtons({ url, id }: { url?: string; id: string }) {
  return (
    <div className="flex gap-1 mt-1">
      {url && (
        <Button variant="outline" size="sm" className="text-xs h-6 px-2" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3 w-3 mr-1" />
            访问
          </a>
        </Button>
      )}

      <Button variant="outline" size="sm" className="text-xs h-6 px-2" asChild>
        <Link to={`/asset/${id}`}>
          <Info className="h-3 w-3 mr-1" />
          详情
        </Link>
      </Button>
    </div>
  );
}

export function AssetListItem({
  id,
  domain,
  host,
  ip,
  port,
  service,
  title,
  products,
  url,
  statuscode,
  type,
  time,
  status,
  banner,
  screenshot
}: AssetListItemProps) {
  const [tags, setTags] = useState<string[]>(products || []);

  const addTag = (newTag: string) => {
    setTags([...tags, newTag]);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card className="hover:shadow-sm py-2">
      <CardContent className="p-3">
        <div className="flex gap-3 flex-col lg:flex-row">
          {/* 左侧信息区域 */}
          <div className="flex-1 min-w-0 max-h-[10rem] overflow-auto">
            <AssetInfo
              type={type}
              host={host}
              domain={domain}
              ip={ip}
              port={port}
              id={id}
              statuscode={statuscode}
              status={status}
              title={title}
              service={service}
              time={time}
            />

            <AssetTags tags={tags} onRemove={removeTag} onAdd={addTag} />

            <ActionButtons url={url} id={id} />
          </div>

          {/* 右侧Banner和截图区域 */}
          <div className=" w-full lg:w-3/5 flex flex-col gap-1 min-w-0 max-h-[10rem] overflow-hidden">
            <div className="text-sm font-medium">原始请求:</div>
            <ScrollArea className="h-full">
              {banner && (
                <pre className="text-sm bg-muted p-1.5 rounded-md whitespace-pre-wrap break-all overflow-hidden leading-tight h-full">
                  {banner}
                </pre>
              )}
            </ScrollArea>

            {/* TODO 查看图片按钮 */}
            {/* {screenshot && (
              <div className="hidden md:block mt-auto ml-auto">
                <img
                  src={screenshot}
                  alt={`Screenshot of ${host || domain || ip}`}
                  className="w-28 h-20 object-cover rounded-md border hover:w-40 hover:h-28 transition-all"
                />
              </div>
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
