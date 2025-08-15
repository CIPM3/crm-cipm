import { ReactNode } from "react"

interface ContentCountProps {
  icon: ReactNode
  label: string
  count: number
}

export default function ContentCount({ icon, label, count }: ContentCountProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full bg-primary/10 p-1">
        {icon}
      </div>
      <span>{count} {label}</span>
    </div>
  )
}