import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Icon size={48} className="text-[#475569] mb-4" />
      <h3 className="text-base font-semibold text-[#8A95A5] mb-2">{title}</h3>
      <p className="text-sm text-[#475569] text-center max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#2196F3' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
