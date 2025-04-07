import { type RouteConfig, layout, route } from "@react-router/dev/routes";
import { LayoutDashboard, FolderKanban, ClipboardList, Scan, CalendarClock, File, ScanSearch } from "lucide-react";

export const HOME_ROUTE = "/";
export const DASHBOARD_ROUTE = "/dashboard";
export const LOGIN_ROUTE = "/login";
export const LOGOUT_ROUTE = "/logout";
export const ABOUT_ROUTE = "/about";
export const ASSET_ROUTE = "/asset/:assetId";
export const ASSET_SENSITIVE_INFORMATION_ROUTE = ASSET_ROUTE + "/sensitive-information";
export const ASSET_PORT_SERVICE_ROUTE = ASSET_ROUTE + "/port-service";
export const SCAN_TASKS_ROUTE = "/tasks";
export const SCAN_TASK_CREATE_ROUTE = "/task/create";
export const SCAN_TASK_ROUTE = "/task/:taskId";
export const SCAN_TASK_REPORT_ROUTE = SCAN_TASK_ROUTE + "/report";
export const SCAN_TASK_EDIT_ROUTE = SCAN_TASK_ROUTE + "/edit";
export const SCAN_TASK_STATISTICS_ROUTE = SCAN_TASK_ROUTE + "/statistics";
export const SCAN_TASK_ASSETS_ROUTE = SCAN_TASK_ROUTE + "/assets";
export const SCHEDULED_TASKS_ROUTE = "/scheduled-tasks";
export const SCHEDULED_TASK_ROUTE = "/scheduled-task/:taskId";
export const SCHEDULED_TASK_EDIT_ROUTE = SCHEDULED_TASK_ROUTE + "/edit";
export const TEMPLATES_ROUTE = "/templates";
export const TEMPLATE_EDIT_ROUTE = "/template/:templateId/edit";
export const TEMPLATE_CREATE_ROUTE = "/template/create";

const mainRoutes = [
  route(DASHBOARD_ROUTE, "routes/home/dashboard.tsx"),
  route(SCAN_TASKS_ROUTE, "routes/scan-task/list.tsx"),
  route(SCAN_TASK_ROUTE, "routes/scan-task/detail.tsx"),
  route(SCAN_TASK_CREATE_ROUTE, "routes/scan-task/create-and-edit.tsx", { id: "create-scan-task" }),
  route(SCAN_TASK_EDIT_ROUTE, "routes/scan-task/create-and-edit.tsx", { id: "edit-scan-task" }),
  route(SCAN_TASK_ASSETS_ROUTE, "routes/scan-task/asset/list.tsx"),
  route(ASSET_ROUTE, "routes/scan-task/asset/detail.tsx"),
  route(SCHEDULED_TASKS_ROUTE, "routes/scheduled-task/list.tsx"),
  route(SCHEDULED_TASK_EDIT_ROUTE, "routes/scheduled-task/create-and-edit.tsx", { id: "edit-scheduled-task" }),
  route(TEMPLATES_ROUTE, "routes/scan-task/template.tsx"),
  route(TEMPLATE_EDIT_ROUTE, "routes/scan-task/template/create-and-edit.tsx", { id: "edit-template" }),
  route(TEMPLATE_CREATE_ROUTE, "routes/scan-task/template/create-and-edit.tsx", { id: "create-template" })
];

const navLayoutRoutes = layout("layouts/nav-layout.tsx", mainRoutes);
const authLayoutRoutes = layout("layouts/auth-layout.tsx", [navLayoutRoutes]);

const routes: RouteConfig = [
  route("/temp", "routes/temp.tsx"),
  route(HOME_ROUTE, "routes/home/home.tsx"),
  route(LOGIN_ROUTE, "routes/home/login.tsx"),
  route(ABOUT_ROUTE, "routes/home/about.tsx"),
  route(LOGOUT_ROUTE, "routes/home/logout.tsx"),
  layout("layouts/provider-layout.tsx", [authLayoutRoutes])
];

export default routes;

export interface SideBarItem {
  name: string;
  href?: string;
  Icon: React.ElementType;
  subMenu?: SideBarItem[];
}

export const menuItems: SideBarItem[] = [
  { name: "概览", href: DASHBOARD_ROUTE, Icon: LayoutDashboard },
  {
    name: "任务管理",
    Icon: ClipboardList,
    subMenu: [
      { name: "扫描任务", href: SCAN_TASKS_ROUTE, Icon: ScanSearch },
      { name: "计划任务", href: SCHEDULED_TASKS_ROUTE, Icon: CalendarClock },
      { name: "扫描模板", href: TEMPLATES_ROUTE, Icon: File }
    ]
  }
  // { name: "插件管理", href: PLUGINS_ROUTE, Icon: Plug },
  // { name: "节点管理", href: NODES_ROUTE, Icon: Server },
  // { name: "项目管理", href: PROJECTS_ROUTE, Icon: FolderGit2 }, // Updated href
  // { name: "POC管理", href: POCS_ROUTE, Icon: FileCode },
  // { name: "指纹管理", href: FINGERPRINTS_ROUTE, Icon: Fingerprint },
  // {
  //   name: "规则管理",
  //   Icon: FileText,
  //   subMenu: [{ name: "敏感信息规则", href: RULES_SENSITIVE_ROUTE, Icon: FileText }]
  // },
  // { name: "字典管理", href: DICTIONARIES_ROUTE, Icon: BookOpen },
  // { name: "配置", href: SETTINGS_ROUTE, Icon: Settings },
  // { name: "About", href: ABOUT_ROUTE, Icon: Info }
];
