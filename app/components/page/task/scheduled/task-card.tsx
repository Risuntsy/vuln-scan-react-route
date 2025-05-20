import { Clock, Pencil, Trash } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent } from "#/components/ui/card";
import { Button } from "#/components/ui/button";
import { type ScheduledTaskData } from "#/api";
import { CustomTooltip } from "#/components/custom/sundry/tooltip";
import { AlertAction } from "#/components/custom";
import type { FetcherWithComponents } from "react-router";

interface TaskCardProps {
  task: ScheduledTaskData;
  onEdit: (data: ScheduledTaskData) => void;
  onDelete?: (id: string) => void;
  fetcher: FetcherWithComponents<any>;
}

function formatTime(time: string): string {
  if (!time) return "未设置";
  return new Date(time).toISOString().replace("T", " ").slice(0, 19);
}

export function TaskCard(props: TaskCardProps) {
  const { task, onEdit, fetcher } = props;
  const { id, name, type, lastTime, nextTime, state, cycle } = task;
  return (
    <Card className="hover:bg-accent/5 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate">{name}</h3>
              <Badge variant={state ? "default" : "outline"} className={`${state ? "bg-green-500" : ""} text-xs`}>
                <Clock className="w-3 h-3 mr-1" />
                {state ? "已启用" : "已禁用"}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-0.5">
              <div className="truncate">类型：{type}</div>
              <div className="truncate">周期：{cycle}</div>
              <div className="truncate">上次：{formatTime(lastTime)}</div>
              <div className="truncate">下次：{formatTime(nextTime)}</div>
            </div>
          </div>

          {id !== "page_monitoring" && (
            <div className="flex items-center gap-1 shrink-0 w-16">
              <CustomTooltip description="编辑">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 p-0"
                  onClick={() => onEdit(task)}
                >
                  <Pencil className="w-4 h-4" />
                  <span className="sr-only">编辑</span>
                </Button>
              </CustomTooltip>

              <CustomTooltip description="删除">
                <AlertAction
                  confirmTitle="确认删除"
                  confirmDescription={`您确定要删除定时任务 "${name}" 吗？此操作无法撤销。`}
                  confirmText="删除"
                  cancelText="取消"
                  isDestructive={true}
                  onConfirm={async () =>
                    await fetcher.submit(
                      { _action: "delete", ids: [id] },
                      { method: "POST", encType: "application/json" }
                    )
                  }
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash className="w-4 h-4" />
                    <span className="sr-only">删除</span>
                  </Button>
                </AlertAction>
              </CustomTooltip>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
