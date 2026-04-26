import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { ListOrdered, Trash2, Filter, XCircle, Clock, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

type StatusFilter = 'all' | 'queued' | 'uploading' | 'completed' | 'failed'

export function QueuePage() {
  const queueItems = useQuery(api.queue.list, {})
  const queueStats = useQuery(api.queue.getStats)
  const removeItem = useMutation(api.queue.remove)
  const clearCompletedMutation = useMutation(api.queue.clearCompleted)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [clearConfirm, setClearConfirm] = useState(false)

  const filteredItems = queueItems?.filter((item: { status: string }) => {
    if (statusFilter === 'all') return true
    return item.status === statusFilter
  }) ?? []

  const handleRemove = async (id: string) => {
    try {
      await removeItem({ id: id as any })
      toast.success('Item removed from queue')
      setDeleteConfirm(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove')
    }
  }

  const handleClearCompleted = async () => {
    try {
      const count = await clearCompletedMutation({})
      toast.success(`${count} completed items cleared`)
      setClearConfirm(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear')
    }
  }

  const filters: { value: StatusFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: (queueStats?.totalQueued ?? 0) + (queueStats?.totalUploading ?? 0) + (queueStats?.totalCompleted ?? 0) + (queueStats?.totalFailed ?? 0) },
    { value: 'queued', label: 'Queued', count: queueStats?.totalQueued ?? 0 },
    { value: 'uploading', label: 'Uploading', count: queueStats?.totalUploading ?? 0 },
    { value: 'completed', label: 'Completed', count: queueStats?.totalCompleted ?? 0 },
    { value: 'failed', label: 'Failed', count: queueStats?.totalFailed ?? 0 },
  ]

  if (!queueItems || !queueStats) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-skeleton rounded" style={{ backgroundColor: '#111D2E' }} />
        <div className="h-64 animate-skeleton rounded-xl" style={{ backgroundColor: '#111D2E' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#E8ECF1]">Queue Manager</h2>
          <p className="text-sm text-[#8A95A5] mt-0.5">{queueItems.length} item{queueItems.length !== 1 ? 's' : ''} in queue</p>
        </div>
        {(queueStats.totalCompleted ?? 0) > 0 && (
          <button
            onClick={() => setClearConfirm(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors border border-[#EF4444]/20"
          >
            <Trash2 size={15} />
            Clear Completed
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={16} className="text-[#475569] mr-1" />
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className="px-3 h-8 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: statusFilter === f.value ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
              border: `1px solid ${statusFilter === f.value ? 'rgba(33, 150, 243, 0.2)' : '#2A3A52'}`,
              color: statusFilter === f.value ? '#2196F3' : '#8A95A5',
            }}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Queue Table */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={ListOrdered}
          title="Queue is Empty"
          description={statusFilter === 'all' ? "No items in the upload queue. Items will appear here when scheduled." : `No ${statusFilter} items found.`}
        />
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          {/* Table Header */}
          <div
            className="grid gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wider"
            style={{
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 100px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: '#8A95A5',
              borderBottom: '1px solid #2A3A52',
            }}
          >
            <div>Video</div>
            <div>Profile</div>
            <div>Title</div>
            <div>Status</div>
            <div>Scheduled</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#2A3A52]/50">
            {filteredItems.map((item: typeof queueItems[0]) => (
              <div
                key={item._id}
                className="grid gap-4 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 100px' }}
              >
                <div>
                  <p className="text-sm text-[#E8ECF1] font-medium truncate">{item.driveFileName}</p>
                  <p className="text-xs text-[#475569] font-mono-data truncate">{item.driveFileId.slice(0, 20)}...</p>
                </div>
                <div>
                  <p className="text-sm text-[#E8ECF1]">{item.profileName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8A95A5] truncate">{item.title}</p>
                </div>
                <div>
                  <StatusBadge status={item.status as 'queued' | 'uploading' | 'completed' | 'failed'} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#8A95A5]">
                  <Clock size={12} />
                  {new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex justify-end gap-1">
                  {item.status === 'failed' && (
                    <button
                      title={item.errorMessage ?? 'Upload failed'}
                      className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5"
                    >
                      <XCircle size={14} className="text-[#EF4444]" />
                    </button>
                  )}
                  {item.status !== 'uploading' && (
                    <button
                      onClick={() => setDeleteConfirm(item._id)}
                      className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5"
                    >
                      <Trash2 size={14} className="text-[#EF4444]" />
                    </button>
                  )}
                  {item.status === 'uploading' && (
                    <div className="w-7 h-7 rounded flex items-center justify-center">
                      <Loader size={14} className="text-[#FBBF24] animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Remove from Queue"
        description="This item will be removed from the upload queue. The video will not be uploaded."
        confirmLabel="Remove"
        onConfirm={() => deleteConfirm && handleRemove(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="warning"
      />

      {/* Clear Completed Confirmation */}
      <ConfirmationDialog
        isOpen={clearConfirm}
        title="Clear Completed Items"
        description={`This will remove all ${queueStats.totalCompleted} completed items from the queue. This action cannot be undone.`}
        confirmLabel="Clear All"
        onConfirm={handleClearCompleted}
        onCancel={() => setClearConfirm(false)}
        variant="warning"
      />
    </div>
  )
}
