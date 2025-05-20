import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function StatsTabs() {
  const [activeTab, setActiveTab] = useState("severity")

  const severityData = [
    { name: "严重", value: 42, color: "#FF5252" },
    { name: "高危", value: 95, color: "#FFA726" },
    { name: "中危", value: 138, color: "#4CAF50" },
    { name: "低危", value: 65, color: "#2196F3" },
  ]

  const typeData = [
    { name: "SQL注入", value: 48, color: "#9C27B0" },
    { name: "XSS", value: 72, color: "#FF5252" },
    { name: "弱密码", value: 85, color: "#FFA726" },
    { name: "配置错误", value: 65, color: "#4CAF50" },
    { name: "权限问题", value: 42, color: "#2196F3" },
    { name: "其他", value: 28, color: "#607D8B" },
  ]

  const statusData = [
    { name: "已修复", value: 38, color: "#4CAF50" },
    { name: "修复中", value: 45, color: "#FFA726" },
    { name: "未修复", value: 193, color: "#FF5252" },
  ]

  const discoveryData = [
    { day: "周一", count: 28 },
    { day: "周二", count: 35 },
    { day: "周三", count: 42 },
    { day: "周四", count: 38 },
    { day: "周五", count: 52 },
    { day: "周六", count: 25 },
    { day: "周日", count: 18 },
  ]

  return (
    <Tabs defaultValue="severity" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 bg-[#0c2d4d]">
        <TabsTrigger value="severity">严重程度</TabsTrigger>
        <TabsTrigger value="type">漏洞类型</TabsTrigger>
        <TabsTrigger value="status">修复状态</TabsTrigger>
        <TabsTrigger value="discovery">发现时间</TabsTrigger>
      </TabsList>

      <TabsContent value="severity" className="mt-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [`${value} 个漏洞`, props.payload.name]}
                contentStyle={{ backgroundColor: "#0a2540", borderColor: "#1e3a8a" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="type" className="mt-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={typeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                formatter={(value) => [`${value} 个漏洞`]}
                contentStyle={{ backgroundColor: "#0a2540", borderColor: "#1e3a8a" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="status" className="mt-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [`${value} 个漏洞`, props.payload.name]}
                contentStyle={{ backgroundColor: "#0a2540", borderColor: "#1e3a8a" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="discovery" className="mt-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={discoveryData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                formatter={(value) => [`${value} 个漏洞`]}
                contentStyle={{ backgroundColor: "#0a2540", borderColor: "#1e3a8a" }}
              />
              <Bar dataKey="count" fill="#2196F3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
