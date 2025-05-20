import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { portServiceData } from "../mock-data"
import { memo } from "react";

const PortServiceChartComponent = () => {
  const topPorts = portServiceData.slice(0, 7)
  const BAR_COLOR = "#00A9E0"

  return (
    <div className="h-[calc(100%-2rem)] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={topPorts}
          margin={{
            top: 5,
            right: 25,
            left: 50,
            bottom: 5,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" horizontal={false} />
          <XAxis type="number" stroke="#7dd3fc" fontSize={10} />
          <YAxis
            dataKey="service"
            type="category"
            stroke="#7dd3fc"
            tick={{ fontSize: 10 }}
            width={70}
            tickFormatter={(value) => value.length > 8 ? `${value.substring(0,8)}...` : value}
          />
          <Tooltip
            formatter={(value, name, props) => [`${value} assets`, `${props.payload.service} (Port ${props.payload.port})`]}
            contentStyle={{ backgroundColor: "#071e36", borderColor: BAR_COLOR, borderRadius: "3px" }}
            itemStyle={{ color: "#e0e0e0" }}
            cursor={{ fill: "rgba(0, 169, 224, 0.1)" }}
          />
          <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 3, 3, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const PortServiceChart = memo(PortServiceChartComponent);
