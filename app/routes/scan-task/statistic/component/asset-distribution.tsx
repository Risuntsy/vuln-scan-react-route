import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { memo } from "react";
import React from "react";

interface AssetDistributionProps {
  data: {
    Port: { value: string | number; number: number }[];
    Service: { value: string | number; number: number }[];
    Icon: { icon_hash: string; value: string | number; number: number }[];
    Product: { value: string | number; number: number }[];
  };
}

const AssetDistributionComponent = ({ data }: AssetDistributionProps) => {
  const COLORS = ["#00A9E0", "#6A0DAD", "#E0004C", "#00E079", "#0073E0", "#B800E0"]

  // 转换数据格式
  const assetData = React.useMemo(() => {
    const serviceData = data.Service.slice(0, 6); // 取前6个服务类型
    const total = serviceData.reduce((sum, item) => sum + item.number, 0);
    
    return serviceData.map((item, index) => ({
      category: String(item.value),
      count: item.number,
      percentage: total > 0 ? (item.number / total) * 100 : 0
    }));
  }, [data.Service]);

  if (!assetData.length) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        暂无资产数据
      </div>
    );
  }

  return (
    <div className="h-[calc(100%-2rem)] w-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={assetData}
            cx="40%"
            cy="50%"
            innerRadius="35%"
            outerRadius="65%"
            fill="#8884d8"
            paddingAngle={2}
            dataKey="count"
            nameKey="category"
            labelLine={false}
          >
            {assetData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value} (${props.payload?.percentage?.toFixed(1)}%)`,
              props.payload?.category,
            ]}
            contentStyle={{ 
              backgroundColor: "#071e36", 
              borderColor: "#00A9E0", 
              borderRadius: "8px",
              border: "1px solid #00A9E0",
              boxShadow: "0 4px 12px rgba(0, 169, 224, 0.2)",
              fontSize: "12px"
            }}
            itemStyle={{ color: "#e0e0e0", fontSize: "12px" }}
            cursor={{ fill: "rgba(0, 169, 224, 0.1)" }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconSize={12}
            iconType="square"
            formatter={(categoryName, entry) => {
              return (
                <span className="text-slate-300 text-sm block max-w-[120px] truncate">
                  {`${categoryName}: ${entry.payload?.value}`}
                </span>
              );
            }}
            wrapperStyle={{ 
              paddingLeft: "10px",
              fontSize: "14px",
              lineHeight: "1.6"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const AssetDistribution = memo(AssetDistributionComponent);
