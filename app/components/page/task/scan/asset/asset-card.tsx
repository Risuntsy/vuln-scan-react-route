"use client";

import { useState } from "react";
import { Badge } from "#/components/ui/badge";
import { Card } from "#/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/components/ui/tabs";
import type { AssetData } from "#/actions";

interface AssetCardProps {
  asset: AssetData;
}

export function AssetCard({ asset }: AssetCardProps) {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{asset.domain || asset.ip}</h3>
            <Badge variant="outline">{asset.type}</Badge>
            <Badge variant={asset.status === 1 ? "default" : "secondary"}>{asset.statuscode}</Badge>
          </div>

          <div className="text-sm text-muted-foreground mt-2">
            <div>端口: {asset.port}</div>
            <div>服务: {asset.service}</div>
            {asset.title && <div>标题: {asset.title}</div>}
          </div>
        </div>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="mt-2">
              <div className="text-sm space-y-1">
                <div>扫描时间: {asset.time}</div>
                <div className="flex gap-1 flex-wrap">
                  {asset.products.map(product => (
                    <Badge key={product} variant="secondary">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="headers" className="mt-2">
              <pre className="text-xs whitespace-pre-wrap">{asset.banner}</pre>
            </TabsContent>
            <TabsContent value="response" className="mt-2">
              {/* Response content will be added here */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
}
