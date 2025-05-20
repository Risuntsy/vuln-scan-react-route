import { useLoaderData, type LoaderFunctionArgs, Link, useParams } from "react-router";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Treemap,
} from "recharts";

import { getToken, r } from "#/lib";
import { getAssetStatistics, getTaskDetail } from "#/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ScanTaskHeader, Alert, Button, Badge } from "#/components";
import { SCAN_TASK_ASSETS_ROUTE, SCAN_TASK_ROUTE } from "#/routes";
import { PieChartIcon, BarChartIcon, LineChartIcon, TreesIcon, ShieldAlertIcon } from "lucide-react";
import { EmptyPlaceholder } from "#/components/custom/sundry/empty-placeholder";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];
const RISK_COLORS: { [key: string]: string } = {
  高危: "#ef4444",
  中危: "#f97316",
  低危: "#eab308",
  信息: "#3b82f6"
};

interface ChartDataItem {
  name: string;
  value: number;
}

const MOCK_DATA = {
  Port: [
    { value: "80", number: 150 },
    { value: "443", number: 120 },
    { value: "22", number: 80 },
    { value: "3389", number: 50 },
    { value: "其他", number: 200 }
  ],
  Service: [
    { value: "HTTP", number: 180 },
    { value: "HTTPS", number: 150 },
    { value: "SSH", number: 90 },
    { value: "RDP", number: 60 },
    { value: "其他", number: 120 }
  ],
  Product: [
    { value: "Apache", number: 100 },
    { value: "Nginx", number: 80 },
    { value: "IIS", number: 60 },
    { value: "其他", number: 70 }
  ],
  RiskLevel: [
    { value: "高危", number: 20 },
    { value: "中危", number: 45 },
    { value: "低危", number: 85 },
    { value: "信息", number: 120 }
  ],
  ScanProgress: [
    { name: "0%", value: 0 },
    { name: "25%", value: 25 },
    { name: "50%", value: 50 },
    { name: "75%", value: 75 },
    { name: "100%", value: 100 }
  ],
  VulnerabilityTypes: [
    { name: "SQL注入", value: 15 },
    { name: "XSS", value: 25 },
    { name: "文件包含", value: 10 },
    { name: "命令执行", value: 5 },
    { name: "信息泄露", value: 30 },
    { name: "其他", value: 15 }
  ],
  AssetDistribution: [
    { name: "Web应用", size: 400 },
    { name: "数据库", size: 300 },
    { name: "服务器", size: 300 },
    { name: "网络设备", size: 200 },
    { name: "IoT设备", size: 100 }
  ],
  VulnerabilityTrend: [
    { name: "1月", 高危: 4, 中危: 10, 低危: 20 },
    { name: "2月", 高危: 3, 中危: 8, 低危: 15 },
    { name: "3月", 高危: 5, 中危: 12, 低危: 25 },
    { name: "4月", 高危: 2, 中危: 7, 低危: 18 },
    { name: "5月", 高危: 6, 中危: 15, 低危: 30 },
  ]
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const taskId = params.taskId;
  if (!taskId) {
    throw new Response("Task ID not found", { status: 404 });
  }

  const token = await getToken(request);
  try {
    const [taskDetail, assetStatistics] = await Promise.all([
      getTaskDetail({ id: taskId, token }),
      getAssetStatistics({ filter: { taskId }, token })
    ]);

    if (!taskDetail) {
      throw new Response("Task Detail not found", { status: 404 });
    }

    const statsData = {
      ...MOCK_DATA,
      Port: assetStatistics.Port || MOCK_DATA.Port,
      Service: assetStatistics.Service || MOCK_DATA.Service,
      Product: assetStatistics.Product || MOCK_DATA.Product,
    };

    return {
      success: true,
      taskId,
      taskDetail,
      stats: statsData
    };
  } catch (error: any) {
    console.error("Failed to load task statistics:", error);
    return {
      success: false,
      taskId,
      taskDetail: null,
      stats: MOCK_DATA,
      error: error.message || "无法加载统计数据，显示模拟数据"
    };
  }
}

const aggregateTopNData = (data: { value: string | number; number: number }[], topN: number = 4): ChartDataItem[] => {
  if (!Array.isArray(data) || data.length === 0) return [];
  const sortedData = [...data].sort((a, b) => b.number - a.number);
  const topItems = sortedData.slice(0, topN);
  const otherSum = sortedData.slice(topN).reduce((sum, item) => sum + item.number, 0);
  const mappedTopItems = topItems.map(item => ({
    name: String(item.value),
    value: item.number
  }));

  if (otherSum > 0) {
    mappedTopItems.push({ name: "其他", value: otherSum });
  }

  return mappedTopItems;
};

const renderPieChartCard = (title: string, data: ChartDataItem[], description?: string, useRiskColors = false) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <PieChartIcon className="w-5 h-5 text-muted-foreground" />
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    useRiskColors
                      ? RISK_COLORS[entry.name] || COLORS[index % COLORS.length]
                      : COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <EmptyPlaceholder title="无数据" description={`没有找到 ${title} 数据。`} className="h-[300px]" />
      )}
    </CardContent>
  </Card>
);

const renderBarChartCard = (title: string, data: ChartDataItem[], description?: string) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChartIcon className="w-5 h-5 text-muted-foreground" />
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyPlaceholder title="无数据" description={`没有找到 ${title} 数据。`} className="h-[300px]" />
      )}
    </CardContent>
  </Card>
);

const renderLineChartCard = (title: string, data: any[], description?: string) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <LineChartIcon className="w-5 h-5 text-muted-foreground" />
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="高危" stroke="#ef4444" />
            <Line type="monotone" dataKey="中危" stroke="#f97316" />
            <Line type="monotone" dataKey="低危" stroke="#eab308" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <EmptyPlaceholder title="无数据" description={`没有找到 ${title} 数据。`} className="h-[300px]" />
      )}
    </CardContent>
  </Card>
);

const renderTreeMapCard = (title: string, data: any[], description?: string) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TreesIcon className="w-5 h-5 text-muted-foreground" />
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={data}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip />
          </Treemap>
        </ResponsiveContainer>
      ) : (
        <EmptyPlaceholder title="无数据" description={`没有找到 ${title} 数据。`} className="h-[300px]" />
      )}
    </CardContent>
  </Card>
);

const renderVulnerabilitySummary = (data: ChartDataItem[]) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ShieldAlertIcon className="w-5 h-5 text-muted-foreground" />
        漏洞风险概览
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-4">
        {data.map((item, index) => (
          <Badge key={index} variant={item.name === "高危" ? "destructive" : item.name === "中危" ? "secondary" : "default"}>
            {item.name}: {item.value}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function ScanTaskStatisticsPage() {
  const { taskId, taskDetail, stats, success, error } = useLoaderData<typeof loader>();
  const params = useParams();

  const showErrorAlert = !taskDetail && !success;

  if (!taskId) {
    return <Alert variant="destructive">无效的任务 ID</Alert>;
  }

  // Generic mapper for data that doesn't need aggregation
  const mapDataForChart = (data: { value: string | number; number: number }[]): ChartDataItem[] => {
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
      name: String(item.value),
      value: item.number
    }));
  };

  // Use the new aggregation function for Port and Service
  const portChartData = aggregateTopNData(stats.Port, 4);
  const serviceChartData = aggregateTopNData(stats.Service, 4);
  // Use simple mapping for others for now
  const productChartData = mapDataForChart(stats.Product);
  const riskLevelData = mapDataForChart(stats.RiskLevel);
  const scanProgressData = stats.ScanProgress;
  const vulnerabilityTypesData = stats.VulnerabilityTypes;
  const assetDistributionData = stats.AssetDistribution;
  const vulnerabilityTrendData = stats.VulnerabilityTrend;

  return (
    <div className="flex flex-col h-full">
      {taskDetail && (
        <ScanTaskHeader
          taskId={taskId}
          taskDetail={taskDetail}
          routes={[{ name: "任务概览", href: r(SCAN_TASK_ROUTE, { variables: { taskId } }) }, { name: "统计信息" }]}
        >
          <Link to={r(SCAN_TASK_ASSETS_ROUTE, { variables: { taskId } })}>
            <Button variant="default">所有资产</Button>
          </Link>
        </ScanTaskHeader>
      )}

      <div className="p-4 space-y-4 flex-1 overflow-auto">
        {showErrorAlert && <Alert variant="default">{error}</Alert>}

        {renderVulnerabilitySummary(riskLevelData)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderPieChartCard("端口分布 (Top 4 + 其他)", portChartData, "任务扫描到的主要端口分布")}
          {renderPieChartCard("服务分布 (Top 4 + 其他)", serviceChartData, "识别到的主要网络服务类型分布")}
          {renderPieChartCard("风险等级分布", riskLevelData, "资产风险等级统计", true)}
          {renderBarChartCard("产品分布", productChartData, "识别到的软件产品或组件分布")}
          {renderPieChartCard("漏洞类型分布", vulnerabilityTypesData, "发现的主要漏洞类型")}
          {renderTreeMapCard("资产分布", assetDistributionData, "不同类型资产的分布情况")}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {renderLineChartCard("漏洞趋势", vulnerabilityTrendData, "近期漏洞发现趋势")}
          {renderLineChartCard("扫描进度", scanProgressData, "任务扫描进度或阶段")}
        </div>
      </div>
    </div>
  );
}
