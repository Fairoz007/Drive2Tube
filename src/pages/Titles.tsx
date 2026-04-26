import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { Type, Plus, Trash2, Power, FolderOpen, Hash } from 'lucide-react'
import toast from 'react-hot-toast'

export function TitlesPage() {
  const profiles = useQuery(api.profiles.list)
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')

  const titles = useQuery(
    api.titles.listByProfile,
    selectedProfileId ? { profileId: selectedProfileId as any } : 'skip'
  )

  const createTitle = useMutation(api.titles.create)
  const createBatch = useMutation(api.titles.createBatch)
  const deleteTitle = useMutation(api.titles.remove)
  const toggleTitle = useMutation(api.titles.toggleActive)

  const [newTitle, setNewTitle] = useState('')
  const [batchText, setBatchText] = useState('')
  const [showBatch, setShowBatch] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const selectedProfile = profiles?.find((p: typeof profiles[0]) => p._id === selectedProfileId)

  const handleAddTitle = async () => {
    if (!newTitle.trim() || !selectedProfileId) return
    try {
      await createTitle({ profileId: selectedProfileId as any, text: newTitle.trim() })
      toast.success('Title added')
      setNewTitle('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to add title')
    }
  }

  const handleBatchAdd = async () => {
    if (!batchText.trim() || !selectedProfileId) return
    const texts = batchText.split('\n').map((t) => t.trim()).filter((t) => t.length > 0)
    if (texts.length === 0) return
    try {
      await createBatch({ profileId: selectedProfileId as any, texts })
      toast.success(`${texts.length} titles added`)
      setBatchText('')
      setShowBatch(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to add titles')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTitle({ id: id as any })
      toast.success('Title deleted')
      setDeleteConfirm(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleTitle({ id: id as any })
      toast.success('Status updated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle')
    }
  }

  if (!profiles) {
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
          <h2 className="text-xl font-bold text-[#E8ECF1]">Titles Manager</h2>
          <p className="text-sm text-[#8A95A5] mt-0.5">
            {titles?.length ?? 0} title{(titles?.length ?? 0) !== 1 ? 's' : ''} for selected profile
          </p>
        </div>
      </div>

      {/* Profile Selector */}
      <div className="flex items-center gap-3">
        <FolderOpen size={16} className="text-[#475569]" />
        <select
          value={selectedProfileId}
          onChange={(e) => setSelectedProfileId(e.target.value)}
          className="h-10 px-4 rounded-lg text-sm outline-none transition-all"
          style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
        >
          <option value="">Select a profile...</option>
          {profiles.map((p: typeof profiles[0]) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {!selectedProfileId ? (
        <EmptyState
          icon={Type}
          title="Select a Profile"
          description="Choose a content profile above to manage its titles."
        />
      ) : (
        <>
          {/* Add Title */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#E8ECF1]">
                Add Title — <span className="text-[#2196F3]">{selectedProfile?.name}</span>
              </h3>
              <button
                onClick={() => setShowBatch(!showBatch)}
                className="text-xs text-[#2196F3] hover:text-[#42A5F5] transition-colors"
              >
                {showBatch ? 'Single' : 'Batch Add'}
              </button>
            </div>

            {!showBatch ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTitle()}
                  placeholder="Enter video title..."
                  className="flex-1 h-10 px-4 rounded-lg text-sm outline-none transition-all"
                  style={{ backgroundColor: '#0A1628', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                  onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  onClick={handleAddTitle}
                  className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#2196F3' }}
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder="Enter one title per line..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all resize-none"
                  style={{ backgroundColor: '#0A1628', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                  onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#475569]">
                    {batchText.split('\n').filter((t) => t.trim()).length} titles
                  </span>
                  <button
                    onClick={handleBatchAdd}
                    className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#2196F3' }}
                  >
                    <Plus size={15} />
                    Add All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Titles List */}
          {titles && titles.length === 0 ? (
            <EmptyState
              icon={Type}
              title="No Titles Yet"
              description="Add your first title above. Titles will be used when uploading videos for this profile."
            />
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
              <div
                className="grid gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wider"
                style={{
                  gridTemplateColumns: '1fr 80px 80px 100px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  color: '#8A95A5',
                  borderBottom: '1px solid #2A3A52',
                }}
              >
                <div>Title</div>
                <div>Uses</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="divide-y divide-[#2A3A52]/50 max-h-[500px] overflow-y-auto">
                {titles?.map((title: typeof titles[0]) => (
                  <div
                    key={title._id}
                    className="grid gap-4 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
                    style={{ gridTemplateColumns: '1fr 80px 80px 100px' }}
                  >
                    <p className={`text-sm ${title.isActive ? 'text-[#E8ECF1]' : 'text-[#475569] line-through'}`}>
                      {title.text}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#8A95A5]">
                      <Hash size={12} />
                      {title.useCount}
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full w-fit"
                      style={{
                        backgroundColor: title.isActive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: title.isActive ? '#4ADE80' : '#EF4444',
                      }}
                    >
                      {title.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleToggle(title._id)}
                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5"
                        title={title.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={14} className={title.isActive ? 'text-[#4ADE80]' : 'text-[#475569]'} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(title._id)}
                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5"
                      >
                        <Trash2 size={14} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Delete Title"
        description="This title will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </div>
  )
}
