import * as React from "react";
import { pluginData } from "../mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type CarouselApi } from "#/components"
import { Badge } from "#/components"
import { Carousel, CarouselContent, CarouselItem } from "#/components"
import { memo } from "react"
import { cn } from "#/lib/utils"

const CommonPluginTableHeader = (): React.ReactNode => (
  <TableHeader className="bg-[#0c2d4d] sticky top-0 z-10">
    <TableRow>
      <TableHead className="text-sky-300 px-3 py-2">插件名称</TableHead>
      <TableHead className="text-sky-300 text-right px-3 py-2">状态</TableHead>
    </TableRow>
  </TableHeader>
);

const ITEMS_THRESHOLD_FOR_CAROUSEL = 5;

const PluginListComponent = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api || pluginData.length <= ITEMS_THRESHOLD_FOR_CAROUSEL) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [api, pluginData.length]);

  if (!pluginData || pluginData.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full text-slate-400")}>
        暂无插件数据
      </div>
    );
  }

  if (pluginData.length <= ITEMS_THRESHOLD_FOR_CAROUSEL) {
    return (
      <div className="h-full overflow-y-auto">
        <Table className="min-w-full">
          <CommonPluginTableHeader />
          <TableBody className="divide-y divide-blue-800">
            {pluginData.map((plugin) => (
              <TableRow key={plugin.id} className="hover:bg-[#0a2540] transition-colors duration-150">
                <TableCell className="font-medium text-slate-200 px-3 py-2 whitespace-nowrap">{plugin.name}</TableCell>
                <TableCell className="text-right px-3 py-2">
                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-xs rounded-sm border ${
                      plugin.status === "active"
                        ? "border-teal-500 text-teal-300 bg-teal-900/30"
                        : "border-slate-600 text-slate-400 bg-slate-800/30"
                    }`}
                  >
                    {plugin.status === "active" ? "活跃" : "停用"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Table className="min-w-full">
        <CommonPluginTableHeader />
      </Table>
      
      <div className="flex-1 overflow-y-auto">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start"
          }}
          orientation="vertical"
          className="w-full h-full"
        >
          <CarouselContent className="h-full -mt-0 divide-y divide-blue-800">
            {pluginData.map((plugin) => (
              <CarouselItem key={plugin.id} className="basis-auto p-0">
                <Table className="min-w-full">
                  <TableBody>
                    <TableRow className="hover:bg-[#0a2540] transition-colors duration-150">
                      <TableCell className="font-medium text-slate-200 px-3 py-2 whitespace-nowrap">{plugin.name}</TableCell>
                      <TableCell className="text-right px-3 py-2">
                        <Badge
                          variant="outline"
                          className={`px-2 py-0.5 text-xs rounded-sm border ${
                            plugin.status === "active"
                              ? "border-teal-500 text-teal-300 bg-teal-900/30"
                              : "border-slate-600 text-slate-400 bg-slate-800/30"
                          }`}
                        >
                          {plugin.status === "active" ? "活跃" : "停用"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}

export const PluginList = memo(PluginListComponent)
