import { Link } from "react-router";
import { type LucideIcon, MoreHorizontal } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge
} from "#/components";

export interface TaskAction {
  key: string;
  icon: LucideIcon;
  title: string;
  route?: (id: string) => string;
  action?: string;
  isDestructive?: boolean;
  onClick?: (id: string) => void;
  showWhen?: (status: string) => boolean;
}

export interface TaskStatusBadge {
  icon: LucideIcon;
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  animate?: boolean;
}

export interface TaskCardItem {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export interface TaskCardProps {
  key: string;
  id: string;
  title: string;
  statusKey: string;
  statusBadge: TaskStatusBadge;
  actions: TaskAction[];
  items: TaskCardItem[];
  colorBar?: string;
  onClick?: () => void;
  className?: string;
  titleHref?: string;
}

export function TaskCard({
  id,
  title,
  statusKey,
  statusBadge,
  actions,
  items,
  colorBar,
  onClick,
  className = "",
  titleHref
}: TaskCardProps) {
  const defaultColorBar =
    statusKey === "enabled" || statusKey === "completed"
      ? "bg-primary"
      : statusKey === "pending" || statusKey === "in-progress"
      ? "bg-blue-500"
      : "bg-gray-300";

  return (
    <Card className={`overflow-hidden border hover:shadow-md transition-shadow ${className}`}>
      <div className={`h-1.5 ${colorBar || defaultColorBar}`} />
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          {/* 左侧信息区域 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {titleHref ? (
                <Link to={titleHref} className="text-primary font-medium truncate" title={title} onClick={onClick}>
                  {title}
                </Link>
              ) : (
                <div className="text-primary font-medium truncate" title={title} onClick={onClick}>
                  {title}
                </div>
              )}
              {statusBadge && (
                <Badge variant={statusBadge.variant} className={statusBadge.className}>
                  <div className="flex items-center">
                    <div className={statusBadge.animate ? "animate-spin mr-1" : "mr-1"}>
                      <statusBadge.icon className="w-3 h-3" />
                    </div>
                    <span>{statusBadge.label}</span>
                  </div>
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span className="text-muted-foreground">{item.label}:</span>
                  <span className="font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧操作按钮 */}
          {actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map(
                  ({ key, title, icon: Icon, showWhen, action, route, isDestructive, onClick: handleClick }) => {
                    if (showWhen && !showWhen(statusKey)) {
                      return null;
                    }

                    const itemContent = (
                      <>
                        <Icon className="w-4 h-4 mr-2" />
                        {title}
                      </>
                    );

                    if (handleClick) {
                      return (
                        <DropdownMenuItem
                          key={key}
                          className={isDestructive ? "text-destructive cursor-pointer" : "cursor-pointer"}
                          onClick={() => handleClick(id)}
                        >
                          {itemContent}
                        </DropdownMenuItem>
                      );
                    }

                    if (route) {
                      return (
                        <DropdownMenuItem key={key} asChild>
                          <Link to={route(id)}>{itemContent}</Link>
                        </DropdownMenuItem>
                      );
                    }

                    return null;
                  }
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
