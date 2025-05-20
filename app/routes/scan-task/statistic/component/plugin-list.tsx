import { pluginData } from "../mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components"
import { Badge } from "#/components"
import { memo } from "react"

const PluginListComponent = () => {
  const topPlugins = pluginData.slice(0, 5)

  return (
    <div className="overflow-x-auto h-full">
      <Table className="min-w-full">
        <TableHeader className="bg-[#0c2d4d] sticky top-0 z-10">
          <TableRow>
            <TableHead className="text-sky-300 px-3 py-2">插件名称</TableHead>
            <TableHead className="text-sky-300 text-right px-3 py-2">状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-blue-800">
          {topPlugins.map((plugin) => (
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

export const PluginList = memo(PluginListComponent)
