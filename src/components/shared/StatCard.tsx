import { useEffect, useState, useRef } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  sublabel?: string
  trend?: number
  color?: 'blue' | 'green' | 'yellow' | 'red'
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const startTime = useRef<number>(0)
  const duration = 1500

  useEffect(() => {
    startTime.current = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.round(eased * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [value])

  return <span>{display.toLocaleString()}{suffix}</span>
}

export function StatCard({ label, value, suffix, sublabel, trend, color: _color = 'blue' }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        backgroundColor: '#111D2E',
        border: '1px solid #2A3A52',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#8A95A5]">
          {label}
        </span>
        {trend !== undefined && (
          <span
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: trend >= 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: trend >= 0 ? '#4ADE80' : '#EF4444',
            }}
          >
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-4xl font-bold text-[#E8ECF1] tracking-tight">
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      {sublabel && (
        <p className="text-xs text-[#475569] mt-1">{sublabel}</p>
      )}
    </div>
  )
}
