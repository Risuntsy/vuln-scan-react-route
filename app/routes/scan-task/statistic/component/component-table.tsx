import { componentData } from "../mock-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components"
import { Badge } from "#/components"
import { memo } from "react"

const ComponentTableComponent = () => {
  const topComponents = componentData.slice(0, 5)

  return (
    <div className="overflow-x-auto h-full">
      <Table className="min-w-full">
        <TableHeader className="bg-[#0c2d4d]">
          <TableRow>
            <TableHead className="text-sky-300 px-3 py-2">应用/组件</TableHead>
            <TableHead className="text-sky-300 text-right px-3 py-2">数量</TableHead>
            <TableHead className="text-sky-300 text-right px-3 py-2">漏洞</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-blue-800">
          {topComponents.map((component, index) => (
            <TableRow key={index} className={index % 2 === 0 ? "bg-[#071e36] hover:bg-[#0a2540] transition-colors duration-150" : "hover:bg-[#0a2540] transition-colors duration-150"}>
              <TableCell className="font-medium text-slate-200 px-3 py-2">{component.name}</TableCell>
              <TableCell className="text-right text-slate-300 px-3 py-2">{component.count}</TableCell>
              <TableCell className="text-right px-3 py-2">
                <Badge
                  variant="outline"
                  className={`px-2 py-0.5 text-xs rounded-sm border ${
                    component.vulnerabilities > 20
                      ? "border-red-600 text-red-400 bg-red-900/30"
                      : component.vulnerabilities > 10
                        ? "border-orange-600 text-orange-400 bg-orange-900/30"
                        : "border-green-600 text-green-400 bg-green-900/30"
                  }`}
                >
                  {component.vulnerabilities}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export const ComponentTable = memo(ComponentTableComponent)
