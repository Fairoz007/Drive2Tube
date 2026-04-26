import { X, AlertTriangle } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning'
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: 'rgba(10, 22, 40, 0.7)', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 relative"
        style={{ backgroundColor: '#1A2744', border: '1px solid #2A3A52' }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <X size={18} className="text-[#8A95A5]" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.1)' }}
          >
            <AlertTriangle size={20} className={variant === 'danger' ? 'text-[#EF4444]' : 'text-[#FBBF24]'} />
          </div>
          <h2 className="text-xl font-bold text-[#E8ECF1]">{title}</h2>
        </div>

        <p className="text-sm text-[#8A95A5] mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 h-10 rounded-lg text-sm font-medium text-[#8A95A5] hover:bg-white/5 transition-colors border border-[#2A3A52]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 h-10 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: variant === 'danger' ? '#EF4444' : '#FBBF24', color: variant === 'danger' ? 'white' : '#0A1628' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
