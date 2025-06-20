import gsap from "gsap"
import { useRef,useEffect } from "react"

const StatCard = ({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  highlight?: boolean
}) => {
  const valueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (valueRef.current) {
      gsap.fromTo(
        valueRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      )
    }
  }, [value])

  return (
    <div
      ref={valueRef}
      className={`flex flex-col items-center justify-center bg-white dark:bg-muted rounded-xl shadow-md border p-6 min-h-[160px] ${
        highlight ? "border-primary" : "border-gray-100 dark:border-gray-800"
      }`}
    >
      <div className="mb-2 text-primary text-3xl">{icon}</div>
      <div className="text-center text-base font-semibold text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </div>
      <div
        className={`font-bold text-black dark:text-white ${
          typeof value === "string" && value.length > 25
            ? "text-lg md:text-xl"
            : "text-3xl md:text-4xl"
        } text-center break-words w-full`}
      >
        {value}
      </div>
    </div>
  )
}

export default StatCard