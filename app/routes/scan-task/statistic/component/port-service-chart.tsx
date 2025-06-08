import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { memo } from "react";
import React from "react";

interface PortServiceChartProps {
  data: {
    Port: { value: string | number; number: number }[];
    Service: { value: string | number; number: number }[];
    Icon: { icon_hash: string; value: string | number; number: number }[];
    Product: { value: string | number; number: number }[];
  };
}

const PortServiceChartComponent = ({ data }: PortServiceChartProps) => {
  const BAR_COLOR = "#00A9E0"

  // 转换数据格式
  const portServiceData = React.useMemo(() => {
    return data.Port.slice(0, 7).map(item => ({
      port: Number(item.value) || item.value,
      service: String(item.value),
      count: item.number
    }));
  }, [data.Port]);

  if (!portServiceData.length) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        暂无端口数据
      </div>
    );
  }

  return (
    <div className="h-[calc(100%-2rem)] w-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={portServiceData}
          margin={{
            top: 5,
            right: 20,
            left: 45,
            bottom: 5,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" horizontal={false} />
          <XAxis 
            type="number" 
            stroke="#7dd3fc" 
            fontSize={9}
          />
          <YAxis
            dataKey="service"
            type="category"
            stroke="#7dd3fc"
            tick={{ fontSize: 9 }}
            width={60}
            tickFormatter={(value) => String(value).length > 6 ? `${String(value).substring(0,6)}...` : String(value)}
          />
          <Tooltip
            formatter={(value, name, props) => [`${value} 资产`, `端口 ${props.payload.port}`]}
            contentStyle={{ 
              backgroundColor: "#071e36", 
              borderColor: BAR_COLOR, 
              borderRadius: "8px",
              border: "1px solid #00A9E0",
              boxShadow: "0 4px 12px rgba(0, 169, 224, 0.2)",
              fontSize: "12px"
            }}
            itemStyle={{ color: "#e0e0e0", fontSize: "12px" }}
            cursor={{ fill: "rgba(0, 169, 224, 0.1)" }}
          />
          <Bar 
            dataKey="count" 
            fill={BAR_COLOR} 
            radius={[0, 4, 4, 0]} 
            barSize={10}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const PortServiceChart = memo(PortServiceChartComponent);
