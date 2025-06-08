import { Progress } from "#/components";
import { Carousel, CarouselContent, CarouselItem } from "#/components";
import { cn } from "#/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { memo, useRef } from "react";

interface ScanningNodesProps {
  className?: string;
  data: {
    list: {
      state: string;
      version: string;
      updateTime: string;
      cpuNum: string;
      memNum: string;
      maxTaskNum: string;
      running: number;
      finished: string;
      name: string;
      modulesConfig?: string;
      TotleMem?: string;
    }[];
    total: number;
  };
}

const ScanningNodesComponent = ({ className, data }: ScanningNodesProps) => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  // 转换数据格式
  const nodeData = data.list.map(node => {
    return {
      id: node.name,
      status: node.state === "1" ? "online" : "offline",
      tasks: node.running,
      cpu: Math.round(Number(node.cpuNum) || 0),
      memory: Math.round(Number(node.memNum) || 0)
    };
  });

  if (!nodeData || nodeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        暂无节点数据
      </div>
    );
  }

  return (
    <div className={cn("w-full flex-1 flex flex-col min-h-0", className)}>
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          loop: nodeData.length > 1,
        }}
        orientation="vertical"
      >
        <CarouselContent className="max-h-full">
          {nodeData.map((node, index) => (
            <CarouselItem key={node.id || index} className="basis-auto">
              <div className="p-1">
                <div className="bg-gradient-to-br from-[#0a2a47] via-[#0b2b48] to-[#0c2d4d] p-3 sm:p-4 rounded-lg shadow-lg border border-sky-600/30 hover:border-sky-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-sky-900/20">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-semibold text-sky-300 truncate pr-2 text-sm sm:text-base">
                      {node.id}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium border transition-all duration-200 ${
                        node.status === "online" 
                          ? "bg-green-600/20 text-green-300 border-green-500/40 shadow-sm shadow-green-500/20" 
                          : "bg-red-600/20 text-red-300 border-red-500/40 shadow-sm shadow-red-500/20"
                      }`}
                    >
                      {node.status === "online" ? "在线" : "离线"}
                    </div>
                  </div>

                  {/* Tasks Info */}
                  <div className="mb-4">
                    <div className="text-xs sm:text-sm text-slate-300">
                      <span className="text-sky-300 font-medium">任务数:</span> 
                      <span className="ml-1 font-semibold">{node.tasks}</span>
                    </div>
                  </div>

                  {/* Resource Usage */}
                  <div className="space-y-3">
                    {/* CPU */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-sky-300 font-medium">CPU</span>
                        <span className="text-slate-300 font-semibold">{node.cpu}%</span>
                      </div>
                      <Progress
                        value={node.cpu}
                        className="h-2 bg-slate-800/50 border border-sky-700/50 rounded-full overflow-hidden"
                        indicatorClassName={cn(
                          "rounded-full transition-all duration-300 shadow-sm",
                          node.cpu > 80 ? "bg-gradient-to-r from-red-400 to-red-500 shadow-red-500/30" : 
                          node.cpu > 60 ? "bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-yellow-500/30" : 
                          "bg-gradient-to-r from-sky-400 to-sky-500 shadow-sky-500/30"
                        )}
                      />
                    </div>

                    {/* Memory */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-sky-300 font-medium">内存</span>
                        <span className="text-slate-300 font-semibold">{node.memory}%</span>
                      </div>
                      <Progress
                        value={node.memory}
                        className="h-2 bg-slate-800/50 border border-sky-700/50 rounded-full overflow-hidden"
                        indicatorClassName={cn(
                          "rounded-full transition-all duration-300 shadow-sm",
                          node.memory > 80 ? "bg-gradient-to-r from-red-400 to-red-500 shadow-red-500/30" : 
                          node.memory > 60 ? "bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-yellow-500/30" : 
                          "bg-gradient-to-r from-sky-400 to-sky-500 shadow-sky-500/30"
                        )}
                      />
                    </div>
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

export const ScanningNodes = memo(ScanningNodesComponent);
