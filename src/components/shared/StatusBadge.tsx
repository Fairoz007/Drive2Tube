interface StatusBadgeProps {
  status: 'running' | 'stopped' | 'queued' | 'uploading' | 'completed' | 'failed' | 'active' | 'inactive' | 'pending' | 'success'
  label?: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config: Record<string, { bg: string; border: string; text: string; dot?: string; pulse?: boolean }> = {
    running: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ADE80', dot: '#4ADE80' },
    active: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ADE80', dot: '#4ADE80' },
    success: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ADE80', dot: '#4ADE80' },
    stopped: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', dot: '#EF4444' },
    inactive: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', dot: '#EF4444' },
    failed: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#EF4444', dot: '#EF4444' },
    queued: { bg: 'rgba(33, 150, 243, 0.1)', border: 'rgba(33, 150, 243, 0.2)', text: '#2196F3', dot: '#2196F3' },
    pending: { bg: 'rgba(33, 150, 243, 0.1)', border: 'rgba(33, 150, 243, 0.2)', text: '#2196F3', dot: '#2196F3' },
    uploading: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#FBBF24', dot: '#FBBF24', pulse: true },
    completed: { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.2)', text: '#4ADE80', dot: '#4ADE80' },
  }

  const c = config[status] ?? config.queued
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${c.pulse ? 'animate-pulse-ring' : ''}`}
      style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
    >
      {c.dot && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />}
      {displayLabel}
    </span>
  )
}
