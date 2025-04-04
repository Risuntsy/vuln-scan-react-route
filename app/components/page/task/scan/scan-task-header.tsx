import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { type TaskDetail } from "#/api";
import { Header, Badge, Button } from "#/components";
import { DASHBOARD_ROUTE, SCAN_TASKS_ROUTE, SCAN_TASK_ROUTE } from "#/routes";
import { r } from "#/lib";

interface ScanTaskHeaderProps {
  taskId: string;
  taskDetail: TaskDetail & Partial<{ id: string }>;
  routes?: Array<{
    name: string;
    href?: string;
  }>;
  children?: React.ReactNode;
}

export function ScanTaskHeader({ taskId, taskDetail, routes = [], children }: ScanTaskHeaderProps) {
  const defaultRoutes = [
    { name: "Dashboard", href: DASHBOARD_ROUTE },
    { name: "扫描任务", href: SCAN_TASKS_ROUTE },
    ...(taskDetail.id ? [
      {
        name: "任务详情",
        href: r(SCAN_TASK_ROUTE, {
          variables: { taskId: taskDetail.id }
        })
      }
    ] : []),
    ...routes
  ];

  return (
    <Header routes={defaultRoutes}>
      <div className="flex flex-col md:flex-row w-full gap-2 justify-between">
        <div className="flex items-center">
          <Link to={r(SCAN_TASKS_ROUTE)}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold">{taskDetail.name}</h1>
            <Badge variant="outline" className="font-normal">
              {taskDetail.template}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {taskDetail.allNode ? "所有节点" : `${taskDetail.node?.length ?? 0} 个节点`}{" "}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:ml-auto">{children}</div>
      </div>
    </Header>
  );
}
