
import { nodeData } from "../mock-data";
import { Progress } from "#/components";
import { Carousel, CarouselContent, CarouselItem } from "#/components";
import { cn } from "#/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { memo, useRef } from "react";

interface ScanningNodesProps {
  className?: string;
}

const ScanningNodesComponent = ({ className }: ScanningNodesProps) => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

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
        // onMouseEnter={plugin.current.stop}
        // onMouseLeave={plugin.current.reset}
        opts={{
          loop: nodeData.length > 1,
        }}
        orientation="vertical"
      >
        <CarouselContent className="max-h-full">
          {nodeData.map((node, index) => (
            <CarouselItem key={node.id || index} className="basis-auto">
              <div className="p-1">
                <div className="bg-gradient-to-br from-[#0a2a47] to-[#0c2d4d] p-4 rounded-lg shadow-lg border border-sky-600/30 hover:border-sky-500/50 transition-colors duration-200">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-semibold text-sky-300 truncate pr-2 text-sm">
                      {node.id}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${
                        node.status === "online" 
                          ? "bg-green-600/20 text-green-300 border border-green-500/30" 
                          : "bg-red-600/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {node.status === "online" ? "在线" : "离线"}
                    </div>
                  </div>

                  {/* Tasks Info */}
                  <div className="mb-4">
                    <div className="text-xs text-slate-300">
                      <span className="text-sky-300">任务数:</span> {node.tasks}
                    </div>
                  </div>

                  {/* Resource Usage */}
                  <div className="space-y-3">
                    {/* CPU */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-sky-300 font-medium">CPU</span>
                        <span className="text-slate-300">{node.cpu}%</span>
                      </div>
                      <Progress
                        value={node.cpu}
                        className="h-2 bg-slate-800/50 border border-sky-700/50 rounded-full overflow-hidden"
                        indicatorClassName={cn(
                          "rounded-full transition-all duration-300",
                          node.cpu > 80 ? "bg-red-400" : 
                          node.cpu > 60 ? "bg-yellow-400" : "bg-sky-400"
                        )}
                      />
                    </div>

                    {/* Memory */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-sky-300 font-medium">内存</span>
                        <span className="text-slate-300">{node.memory}%</span>
                      </div>
                      <Progress
                        value={node.memory}
                        className="h-2 bg-slate-800/50 border border-sky-700/50 rounded-full overflow-hidden"
                        indicatorClassName={cn(
                          "rounded-full transition-all duration-300",
                          node.memory > 80 ? "bg-red-400" : 
                          node.memory > 60 ? "bg-yellow-400" : "bg-sky-400"
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
