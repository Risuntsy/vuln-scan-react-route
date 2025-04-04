import { AssetCard } from "./asset-card";

interface AssetListProps {
  taskId: string;
  filter: string;
  page: number;
}

export function AssetList({ taskId, filter, page }: AssetListProps) {
  // 这里后续实现获取资产数据的逻辑
  return (
    <div className="grid gap-4">
      {/* 临时放置一个示例卡片 */}
      <AssetCard
        asset={{
          id: "example",
          domain: "example.com",
          host: "example.com",
          ip: "1.1.1.1",
          port: 80,
          service: "http",
          title: "Example Website",
          status: 1,
          banner: "",
          products: ["nginx"],
          time: "2024-03-20",
          icon: "",
          screenshot: "",
          type: "domain",
          statuscode: 200,
          url: "http://example.com"
        }}
      />
    </div>
  );
}
