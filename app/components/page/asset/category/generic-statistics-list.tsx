import { Badge } from "#/components";
import { type StatisticsItem } from "#/api";
import { StatisticsCard } from "./statistics-card";
import { EmptyPlaceholder } from "#/components/custom/empty-placeholder";
import { Link } from "react-router";

export interface GenericStatisticsListProps {
  title: string;
  data: StatisticsItem[];
  tagType: string;
  compact?: boolean;
  className?: string;
  selectTag?: (type: string, value: string | number) => void;
  removeTag?: (type: string, value: string | number) => void;
  renderItem?: (item: StatisticsItem) => React.ReactNode;
  taskId: string;
}

export function GenericStatisticsList({
  title,
  data,
  tagType,
  compact,
  className,
  selectTag,
  renderItem,
  taskId
}: GenericStatisticsListProps) {
  const defaultRenderItem = (item: StatisticsItem) => (
    <>
      <span className="text-sm">{item.value}</span>
      <Badge variant="secondary" className="text-xs">
        {item.number.toLocaleString()}
      </Badge>
    </>
  );

  const itemRenderer = renderItem || defaultRenderItem;

  return (
    <StatisticsCard title={title} compact={compact} className={className}>
      {data && data.length > 0 ? (
        <div className="space-y-2">
          {data
            .sort((a, b) => b.number - a.number)
            .map(item =>
              item.href ? (
                <Link
                  to={item.href}
                  key={item.value}
                  className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/50 transition-colors px-2 rounded-sm cursor-pointer"
                >
                  {itemRenderer(item)}
                </Link>
              ) : (
                <div
                  key={item.value}
                  className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/50 transition-colors px-2 rounded-sm cursor-pointer"
                  onClick={() => selectTag && selectTag(tagType, item.value)}
                >
                  {itemRenderer(item)}
                </div>
              )
            )}
        </div>
      ) : (
        <EmptyPlaceholder title={`没有 ${title} 数据`} description="当前任务没有统计到相关信息。" />
      )}
    </StatisticsCard>
  );
}
