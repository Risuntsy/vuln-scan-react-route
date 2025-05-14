import { Badge } from "#/components";
import { type IconStatisticsItem } from "#/api";
import { StatisticsCard } from "./statistics-card";
import { EmptyPlaceholder } from "#/components/custom/sundry/empty-placeholder";
import { Image } from "lucide-react";
import { Link } from "react-router";

interface ServiceIconGridProps {
  data: IconStatisticsItem[];
  compact?: boolean;
  className?: string;
  selectTag?: (type: string, value: string | number) => void;
  removeTag?: (type: string, value: string | number) => void;
  taskId: string;
}

export function ServiceIconGrid({ data, compact, className, selectTag, removeTag }: ServiceIconGridProps) {
  return (
    <StatisticsCard title="服务图标" compact={compact} className={className}>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {data.map(({ icon_hash, value, number, href }) =>
            href ? (
              <Link
                key={icon_hash}
                to={href}
                className="flex flex-col items-center justify-center py-2 hover:bg-muted/50 transition-colors px-2 rounded-sm cursor-pointer"
              >
                <span className={compact ? "w-6 h-6" : "w-10 h-10"}>
                  <img
                    src={`data:image/png;base64,${value}`}
                    alt={`Icon ${icon_hash}`}
                    className="object-contain w-full h-full"
                  />
                </span>
                <Badge variant="secondary" className="text-xs mt-1">
                  {number.toLocaleString()}
                </Badge>
              </Link>
            ) : (
              <div
                key={icon_hash}
                className="flex flex-col items-center justify-center py-2 hover:bg-muted/50 transition-colors px-2 rounded-sm cursor-pointer"
                onClick={() => selectTag && selectTag("icon", icon_hash)}
              >
                <div className={compact ? "w-6 h-6" : "w-10 h-10"}>
                  <img
                    src={`data:image/png;base64,${value}`}
                    alt={`Icon ${icon_hash}`}
                    className="object-contain w-full h-full"
                  />
                </div>
                <Badge variant="secondary" className="text-xs mt-1">
                  {number.toLocaleString()}
                </Badge>
              </div>
            )
          )}
        </div>
      ) : (
        <EmptyPlaceholder icon={<Image className="h-12 w-12 text-muted-foreground" />} title="没有服务图标数据" />
      )}
    </StatisticsCard>
  );
}
