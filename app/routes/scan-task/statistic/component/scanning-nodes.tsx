import { useState, useEffect, useRef, memo } from "react"
import { nodeData } from "../mock-data"
// import { Card, CardContent } from "#/components" // Card and CardContent no longer used for individual items
import { Progress } from "#/components"

const ScanningNodesComponent = () => {
  const [currentNodes, setCurrentNodes] = useState(nodeData)
  const itemsContainerRef = useRef<HTMLDivElement>(null) // The inner div that gets translated
  const [itemScrollHeight, setItemScrollHeight] = useState(0)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const transitionEndTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (itemsContainerRef.current && itemsContainerRef.current.children.length > 0 && nodeData.length > 0) {
      const firstChild = itemsContainerRef.current.children[0] as HTMLElement
      let height = firstChild.offsetHeight
      if (nodeData.length > 1 && itemsContainerRef.current.children.length > 1) {
        const secondChild = itemsContainerRef.current.children[1] as HTMLElement
        height = secondChild.offsetTop - firstChild.offsetTop
      } else if (nodeData.length === 1) {
        // If only one actual item, space-y doesn't apply in the same way for scrolling purpose
        // but we still need its own height correctly.
        // The gap is only relevant if there are items to scroll between.
      } else {
        // Fallback for single item rendered in list initially for measurement, add typical gap
        height += 8 // Assuming space-y-2 implies an 8px gap
      }
      setItemScrollHeight(height)
    } else {
      setItemScrollHeight(0)
    }
  }, [nodeData]) // Calculate height based on nodeData, assuming item structure is consistent

  useEffect(() => {
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current)
    if (transitionEndTimeoutRef.current) clearTimeout(transitionEndTimeoutRef.current)

    if (nodeData.length <= 1 || itemScrollHeight === 0) {
      if (itemsContainerRef.current) {
        itemsContainerRef.current.style.transition = "none"
        itemsContainerRef.current.style.transform = "translateY(0px)"
      }
      return
    }

    animationIntervalRef.current = setInterval(() => {
      if (!itemsContainerRef.current) return
      itemsContainerRef.current.style.transition = "transform 0.8s ease-in-out"
      itemsContainerRef.current.style.transform = `translateY(-${itemScrollHeight}px)`

      transitionEndTimeoutRef.current = setTimeout(() => {
        setCurrentNodes(prevNodes => {
          const newNodes = [...prevNodes]
          const firstNode = newNodes.shift()
          if (firstNode) newNodes.push(firstNode)
          return newNodes
        })
      }, 800)
    }, 3000)

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current)
      if (transitionEndTimeoutRef.current) clearTimeout(transitionEndTimeoutRef.current)
    }
  }, [nodeData, itemScrollHeight]) // Added nodeData to deps as it influences loop condition

  useEffect(() => {
    if (itemsContainerRef.current && nodeData.length > 1 && itemScrollHeight > 0) {
      requestAnimationFrame(() => {
        if (itemsContainerRef.current) {
          itemsContainerRef.current.style.transition = "none"
          itemsContainerRef.current.style.transform = "translateY(0px)"
        }
      })
    }
  }, [currentNodes, nodeData.length, itemScrollHeight])

  const nodesToRender = [...currentNodes]
  if (nodeData.length > 1 && itemScrollHeight > 0 && currentNodes.length > 0) {
    nodesToRender.push(currentNodes[0]) // Add buffer item
  }

  return (
    <div className="h-full overflow-hidden relative">
      <div ref={itemsContainerRef} className="space-y-2">
        {nodesToRender.map((node, index) => {
          // Key strategy: actual items use node.id, buffer item gets a distinct key.
          const isBufferItem = index === currentNodes.length
          const key = isBufferItem ? `${node.id}-buffer` : node.id
          return (
            <div
              key={key}
              className="bg-[#0c2d4d] p-3 rounded-sm shadow-md border border-transparent hover:border-blue-600 transition-all duration-150"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-sky-300">{node.id}</div>
                <div
                  className={`text-xs px-2 py-0.5 rounded-sm ${node.status === "online" ? "bg-green-700 text-green-300" : "bg-red-700 text-red-300"}`}
                >
                  {node.status === "online" ? "在线" : "离线"}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 text-xs text-slate-300">
                <div>任务: {node.tasks}</div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs mb-0.5 text-sky-300">
                  <span>CPU</span>
                  <span>{node.cpu}%</span>
                </div>
                <Progress value={node.cpu} className="h-1.5 bg-sky-950/50 border border-sky-700 rounded-full" indicatorClassName="bg-sky-400 rounded-full" />

                <div className="flex justify-between text-xs mb-0.5 text-sky-300">
                  <span>内存</span>
                  <span>{node.memory}%</span>
                </div>
                <Progress value={node.memory} className="h-1.5 bg-sky-950/50 border border-sky-700 rounded-full" indicatorClassName="bg-sky-400 rounded-full" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ScanningNodes = memo(ScanningNodesComponent)
