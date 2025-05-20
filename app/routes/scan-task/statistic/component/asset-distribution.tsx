import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { assetData } from "../mock-data"
import { memo } from "react";

const AssetDistributionComponent = () => {
  const COLORS = ["#00A9E0", "#6A0DAD", "#E0004C", "#00E079", "#0073E0", "#B800E0"]

  return (
    <div className="h-[calc(100%-2rem)] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={assetData}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
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
            contentStyle={{ backgroundColor: "#071e36", borderColor: "#00A9E0", borderRadius: "3px" }}
            itemStyle={{ color: "#e0e0e0" }}
            cursor={{ fill: "rgba(0, 169, 224, 0.1)" }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconSize={10}
            iconType="square"
            formatter={(categoryName, entry) => {
              return <span style={{ color: "#cbd5e1" }}>{`${categoryName}: ${entry.payload?.value}`}</span>;
            }}
            wrapperStyle={{ paddingLeft: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const AssetDistribution = memo(AssetDistributionComponent);
