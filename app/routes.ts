import { type RouteConfig, layout, route } from "@react-router/dev/routes";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  File,
  ScanSearch,
  Plug,
  Server,
  FileCode,
  Fingerprint,
  FileText,
  Settings
} from "lucide-react";

export const HOME_ROUTE = "/";
export const DASHBOARD_ROUTE = "/dashboard";
export const LOGIN_ROUTE = "/login";
export const LOGOUT_ROUTE = "/logout";
export const ABOUT_ROUTE = "/about";
export const NOT_FOUND_ROUTE = "/not-found";
export const ASSET_ROUTE = "/asset/:assetId";
export const ASSET_SENSITIVE_INFORMATION_ROUTE = ASSET_ROUTE + "/sensitive-information";
export const ASSET_PORT_SERVICE_ROUTE = ASSET_ROUTE + "/port-service";
export const SCAN_TASKS_ROUTE = "/tasks";
export const SCAN_TASK_CREATE_ROUTE = "/task/create";
export const SCAN_TASK_ROUTE = "/task/:taskId";
export const SCAN_TASK_STATISTICS_ROUTE = SCAN_TASK_ROUTE + "/statistics";
export const SCAN_TASK_REPORT_ROUTE = SCAN_TASK_ROUTE + "/report";
export const SCAN_TASK_ASSETS_ROUTE = SCAN_TASK_ROUTE + "/assets";
export const SCHEDULED_TASKS_ROUTE = "/scheduled-tasks";
export const SCHEDULED_TASK_ROUTE = "/scheduled-task/:taskId";
export const SCHEDULED_TASK_EDIT_ROUTE = SCHEDULED_TASK_ROUTE + "/edit";
export const TEMPLATES_ROUTE = "/templates";
export const TEMPLATE_EDIT_ROUTE = "/template/:templateId/edit";
export const TEMPLATE_CREATE_ROUTE = "/template/create";
export const PLUGINS_ROUTE = "/plugins";
export const PLUGIN_EDIT_ROUTE = "/plugin/:hash/edit";
export const PLUGIN_LOG_ROUTE = "/plugin/:module/:hash/log";
export const PLUGIN_CREATE_ROUTE = "/plugin/create";
export const POCS_ROUTE = "/pocs";
export const POC_EDIT_ROUTE = "/poc/:pocId/edit";
export const POC_CREATE_ROUTE = "/poc/create";
export const FINGERPRINTS_ROUTE = "/fingerprints";
export const SENSITIVE_INFORMATION_RULE_ROUTE = "/sensitive-information-rules";
export const NODES_ROUTE = "/nodes";
export const NODE_PLUGINS_ROUTE = "/node/:nodeName/plugins";
export const NODE_LOG_ROUTE = "/node/:nodeName/log";
export const CONFIGURATION_ROUTE = "/configuration";
export const SYSTEM_CONFIGURATION_ROUTE = CONFIGURATION_ROUTE + "/system";
export const SUBFINDER_CONFIGURATION_ROUTE = CONFIGURATION_ROUTE + "/subfinder";
export const RAD_CONFIGURATION_ROUTE = CONFIGURATION_ROUTE + "/rad";

const mainRoutes = [
  route(DASHBOARD_ROUTE, "routes/home/dashboard.tsx"),
  route(SCAN_TASKS_ROUTE, "routes/scan-task/list.tsx"),
  route(SCAN_TASK_ROUTE, "routes/scan-task/detail.tsx"),
  route(SCAN_TASK_CREATE_ROUTE, "routes/scan-task/create-and-edit.tsx", { id: "create-scan-task" }),
  route(SCAN_TASK_ASSETS_ROUTE, "routes/scan-task/asset/list.tsx"),
  route(SCAN_TASK_STATISTICS_ROUTE, "routes/scan-task/statistic.tsx"),
  route(ASSET_ROUTE, "routes/scan-task/asset/detail.tsx"),
  route(SCHEDULED_TASKS_ROUTE, "routes/scheduled-task/list.tsx"),
  route(SCHEDULED_TASK_EDIT_ROUTE, "routes/scheduled-task/create-and-edit.tsx", { id: "edit-scheduled-task" }),
  route(TEMPLATES_ROUTE, "routes/scan-task/template/list.tsx"),
  route(TEMPLATE_EDIT_ROUTE, "routes/scan-task/template/create-and-edit.tsx", { id: "edit-template" }),
  route(TEMPLATE_CREATE_ROUTE, "routes/scan-task/template/create-and-edit.tsx", { id: "create-template" }),
  route(PLUGINS_ROUTE, "routes/plugin/list.tsx"),
  route(PLUGIN_EDIT_ROUTE, "routes/plugin/create-and-edit.tsx", { id: "edit-plugin" }),
  route(PLUGIN_CREATE_ROUTE, "routes/plugin/create-and-edit.tsx", { id: "create-plugin" }),
  route(PLUGIN_LOG_ROUTE, "routes/plugin/log.tsx"),
  route(NODES_ROUTE, "routes/node/list.tsx"),
  route(NODE_PLUGINS_ROUTE, "routes/node/plugins.tsx"),
  route(NODE_LOG_ROUTE, "routes/node/log.tsx"),
  route(POCS_ROUTE, "routes/poc/list.tsx"),
  route(POC_EDIT_ROUTE, "routes/poc/create-and-edit.tsx", { id: "edit-poc" }),
  route(POC_CREATE_ROUTE, "routes/poc/create-and-edit.tsx", { id: "create-poc" }),
  route(FINGERPRINTS_ROUTE, "routes/fingerprint/list.tsx"),
  route(SENSITIVE_INFORMATION_RULE_ROUTE, "routes/sensitive-information-rule/list.tsx"),
  route(SYSTEM_CONFIGURATION_ROUTE, "routes/configuration/system.tsx"),
  route(SUBFINDER_CONFIGURATION_ROUTE, "routes/configuration/subfinder.tsx"),
  route(RAD_CONFIGURATION_ROUTE, "routes/configuration/rad.tsx")
];

const navLayoutRoutes = layout("layouts/nav-layout.tsx", mainRoutes);
const authLayoutRoutes = layout("layouts/auth-layout.tsx", [navLayoutRoutes]);

const routes: RouteConfig = [
  route("/temp", "routes/temp.tsx"),
  route(HOME_ROUTE, "routes/home/home.tsx"),
  route(LOGIN_ROUTE, "routes/home/login.tsx"),
  route(ABOUT_ROUTE, "routes/home/about.tsx"),
  route(LOGOUT_ROUTE, "routes/home/logout.tsx"),
  route("/health", "routes/home/health.tsx"),
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
  },
  { name: "插件管理", href: PLUGINS_ROUTE, Icon: Plug },
  { name: "节点管理", href: NODES_ROUTE, Icon: Server },
  { name: "POC管理", href: POCS_ROUTE, Icon: FileCode },
  { name: "指纹管理", href: FINGERPRINTS_ROUTE, Icon: Fingerprint },
  { name: "敏感信息规则", href: SENSITIVE_INFORMATION_RULE_ROUTE, Icon: FileText },
  {
    name: "配置",
    subMenu: [
      { name: "系统配置", href: SYSTEM_CONFIGURATION_ROUTE, Icon: Settings },
      { name: "Subfinder配置", href: SUBFINDER_CONFIGURATION_ROUTE, Icon: Settings },
      { name: "Rad配置", href: RAD_CONFIGURATION_ROUTE, Icon: Settings }
    ],
    Icon: Settings
  }
];
