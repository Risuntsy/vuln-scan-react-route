import * as React from "react";
import { Badge, Progress, type CarouselApi } from "#/components";
import { Carousel, CarouselContent, CarouselItem } from "#/components";
import { cn } from "#/lib/utils";

interface ComponentTableProps {
  className?: string;
  data: {
    Port: { value: string | number; number: number }[];
    Service: { value: string | number; number: number }[];
    Icon: { icon_hash: string; value: string | number; number: number }[];
    Product: { value: string | number; number: number }[];
  };
}

const ComponentTableComponent = ({ className, data }: ComponentTableProps) => {
  const [api, setApi] = React.useState<CarouselApi>();

  // 转换数据格式
  const componentData = React.useMemo(() => {
    return data.Product.slice(0, 15).map(product => {
      const productName = String(product.value);
      const count = product.number;
      
      // 基于产品类型和使用数量估算漏洞数量
      let baseVulnRate = 0.1; // 基础漏洞率10%
      
      // 某些产品类型可能有更高的漏洞率
      if (productName.toLowerCase().includes('wordpress') || 
          productName.toLowerCase().includes('apache') ||
          productName.toLowerCase().includes('mysql') ||
          productName.toLowerCase().includes('php')) {
        baseVulnRate = 0.3; // 30%
      } else if (productName.toLowerCase().includes('nginx') ||
                 productName.toLowerCase().includes('docker') ||
                 productName.toLowerCase().includes('redis')) {
        baseVulnRate = 0.15; // 15%
      }
      
      const vulnerabilities = Math.max(0, Math.round(count * baseVulnRate + Math.random() * 10));
      
      return {
        name: productName,
        count,
        vulnerabilities
      };
    });
  }, [data.Product]);

  React.useEffect(() => {
    if (!api || componentData.length <= 1) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [api]);

  if (!componentData || componentData.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full text-slate-400", className)}>
        暂无组件数据
      </div>
    );
  }

  const itemsToShow = Math.min(5, componentData.length);
  const basisClass = itemsToShow > 0 ? `basis-1/${itemsToShow}` : "basis-full";

  return (
    <div className={cn("w-full flex-1 flex flex-col min-h-0", className)}>
      <div className="grid grid-cols-3 bg-gradient-to-br from-[#0a2a47] to-[#0c2d4d] p-2 rounded-t-lg border-b border-sky-600/30">
        <div className="font-semibold text-sky-300 text-xs">应用/组件</div>
        <div className="font-semibold text-sky-300 text-xs text-right">数量</div>
        <div className="font-semibold text-sky-300 text-xs text-right">漏洞</div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          loop: componentData.length > itemsToShow,
          align: "start",
        }}
        orientation="vertical"
        className="w-full flex-1 overflow-hidden rounded-b-lg"
      >
        <CarouselContent className="h-full -mt-0">
          {componentData.map((component, index) => (
            <CarouselItem key={index} className={cn("py-0", basisClass)}>
              <div className="p-0.5 h-full">
                <div className={cn(
                  "grid grid-cols-3 items-center p-2 h-full",
                  index % 2 === 0 ? "bg-[#071e36]/70" : "bg-[#0c2d4d]/70",
                  "hover:bg-sky-700/20 transition-colors duration-150"
                )}>
                  <div className="font-medium text-slate-200 text-xs truncate pr-2">{component.name}</div>
                  <div className="text-right text-slate-300 text-xs">{component.count}</div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={`px-1.5 py-0.5 text-xs rounded-sm border font-medium ${
                        component.vulnerabilities > 20
                          ? "border-red-500 text-red-300 bg-red-700/30"
                          : component.vulnerabilities > 10
                            ? "border-orange-500 text-orange-300 bg-orange-700/30"
                            : "border-green-500 text-green-300 bg-green-700/30"
                      }`}
                    >
                      {component.vulnerabilities}
                    </Badge>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export const ComponentTable = React.memo(ComponentTableComponent);
