import { Clock } from "./component/clock";
import { AssetDistribution } from "./component/asset-distribution";
import { VulnerabilityStats } from "./component/vulnerability-stats";
import { VulnerabilityTrend } from "./component/vulnerability-trend";
import { PortServiceChart } from "./component/port-service-chart";
import { ScanningNodes } from "./component/scanning-nodes";
import { ComponentTable } from "./component/component-table";
import { PluginList } from "./component/plugin-list";
import { SidebarTrigger, useSidebar } from "#/components";
import { useEffect } from "react";
import { Panel } from "#/routes/scan-task/statistic/component/panel";

export default function Dashboard() {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, []);

  const cardTitleClass = "text-base font-semibold mb-2 text-sky-300";

  return (
    <div className="min-h-dvh w-full bg-[#051527] text-slate-200 p-3 flex flex-col overflow-y-auto md:overflow-hidden md:h-dvh">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 p-3 flex-shrink-0 bg-gradient-to-r from-sky-800/70 via-blue-900/70 to-sky-800/70 border border-sky-600/70 rounded-lg shadow-xl shadow-sky-900/30">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Clock />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-center text-sky-300 px-2 tracking-wider">
          漏洞扫描系统数据分析平台
        </h1>
        <div className="w-[120px] flex-shrink-0">&nbsp;</div>
      </header>

      {/* Dashboard Grid - Allow content to determine height on small screens, remove overflow-hidden from grid and columns */}
      <div className="flex-1 flex flex-col md:flex-row gap-3 md:overflow-hidden">
        {/* Left Column */}
        <div className="md:w-1/4 space-y-3 flex flex-col">
          <Panel className="flex-1 min-h-0">
            <h2 className={cardTitleClass}>资产分布分析</h2>
            <AssetDistribution />
          </Panel>
          <Panel className="flex-1 min-h-0">
            <h2 className={cardTitleClass}>端口分布</h2>
            <PortServiceChart />
          </Panel>
          <Panel className="flex-1 min-h-0">
            <h2 className={cardTitleClass}>插件列表</h2>
            <PluginList />
          </Panel>
        </div>

        {/* Middle Column - Main Content */}
        <div className="md:w-1/2 space-y-3 flex flex-col">
          <Panel className="flex-[0.6] min-h-0">
            <h2 className={cardTitleClass}>漏洞总量统计</h2>
            <VulnerabilityStats />
          </Panel>
          <Panel className="flex-1 min-h-0">
            <h2 className={cardTitleClass}>漏洞趋势分析</h2>
            <VulnerabilityTrend />
          </Panel>
        </div>

        {/* Right Column */}
        <div className="md:w-1/4 space-y-3 flex flex-col">
          <Panel className="flex-[2] min-h-0 max-h-[66vh] flex flex-col">
            <h2 className={cardTitleClass}>扫描节点状态</h2>
            <ScanningNodes />
          </Panel>
          <Panel className="flex-1 min-h-0">
            <h2 className={cardTitleClass}>应用/组件分析</h2>
            <ComponentTable />
          </Panel>
        </div>
      </div>
    </div>
  );
}
