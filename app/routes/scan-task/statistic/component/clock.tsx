import { useEffect, useState } from "react"

export function Clock() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      setTime(`${hours}<span class="animate-pulse">:</span>${minutes}<span class="animate-pulse">:</span>${seconds}`)

      const year = now.getFullYear()
      const month = (now.getMonth() + 1).toString().padStart(2, "0")
      const day = now.getDate().toString().padStart(2, "0")

      const weekDays = ["日", "一", "二", "三", "四", "五", "六"]
      const weekDay = weekDays[now.getDay()]

      setDate(`${year}年${month}月${day}日 星期${weekDay}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-sky-300 font-mono select-none">
      <div className="text-xl tracking-wider" dangerouslySetInnerHTML={{ __html: time }} />
      <div className="text-xs text-slate-400">{date}</div>
    </div>
  )
}
