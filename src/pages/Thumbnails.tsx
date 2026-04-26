import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { Image, Plus, Trash2, Power, FolderOpen, Hash } from 'lucide-react'
import toast from 'react-hot-toast'

export function ThumbnailsPage() {
  const profiles = useQuery(api.profiles.list)
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')

  const thumbnails = useQuery(
    api.thumbnails.listByProfile,
    selectedProfileId ? { profileId: selectedProfileId as any } : 'skip'
  )

  const createThumbnail = useMutation(api.thumbnails.create)
  const deleteThumbnail = useMutation(api.thumbnails.remove)
  const toggleThumbnail = useMutation(api.thumbnails.toggleActive)

  const [form, setForm] = useState({ fileName: '', driveFileId: '', mimeType: 'image/jpeg' })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const selectedProfile = profiles?.find((p: typeof profiles[0]) => p._id === selectedProfileId)

  const handleAdd = async () => {
    if (!form.fileName.trim() || !form.driveFileId.trim() || !selectedProfileId) return
    try {
      await createThumbnail({
        profileId: selectedProfileId as any,
        fileName: form.fileName.trim(),
        driveFileId: form.driveFileId.trim(),
        mimeType: form.mimeType,
      })
      toast.success('Thumbnail added')
      setForm({ fileName: '', driveFileId: '', mimeType: 'image/jpeg' })
    } catch (err: any) {
      toast.error(err.message || 'Failed to add thumbnail')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteThumbnail({ id: id as any })
      toast.success('Thumbnail deleted')
      setDeleteConfirm(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleThumbnail({ id: id as any })
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
          <h2 className="text-xl font-bold text-[#E8ECF1]">Thumbnail Manager</h2>
          <p className="text-sm text-[#8A95A5] mt-0.5">
            {thumbnails?.length ?? 0} thumbnail{(thumbnails?.length ?? 0) !== 1 ? 's' : ''} for selected profile
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
          icon={Image}
          title="Select a Profile"
          description="Choose a content profile above to manage its thumbnails."
        />
      ) : (
        <>
          {/* Add Thumbnail */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
          >
            <h3 className="text-sm font-semibold text-[#E8ECF1] mb-3">
              Add Thumbnail — <span className="text-[#2196F3]">{selectedProfile?.name}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={form.fileName}
                onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                placeholder="File name (e.g., thumb_01.jpg)"
                className="h-10 px-4 rounded-lg text-sm outline-none transition-all"
                style={{ backgroundColor: '#0A1628', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
              />
              <input
                type="text"
                value={form.driveFileId}
                onChange={(e) => setForm({ ...form, driveFileId: e.target.value })}
                placeholder="Google Drive File ID"
                className="h-10 px-4 rounded-lg text-sm outline-none transition-all font-mono-data"
                style={{ backgroundColor: '#0A1628', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
              />
              <div className="flex gap-2">
                <select
                  value={form.mimeType}
                  onChange={(e) => setForm({ ...form, mimeType: e.target.value })}
                  className="flex-1 h-10 px-4 rounded-lg text-sm outline-none transition-all"
                  style={{ backgroundColor: '#0A1628', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#2196F3' }}
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnails List */}
          {thumbnails && thumbnails.length === 0 ? (
            <EmptyState
              icon={Image}
              title="No Thumbnails Yet"
              description="Add your first thumbnail above. Thumbnails will be used when uploading videos for this profile."
            />
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
              <div
                className="grid gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wider"
                style={{
                  gridTemplateColumns: '1fr 1fr 80px 80px 100px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  color: '#8A95A5',
                  borderBottom: '1px solid #2A3A52',
                }}
              >
                <div>File Name</div>
                <div>Drive File ID</div>
                <div>Uses</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="divide-y divide-[#2A3A52]/50 max-h-[500px] overflow-y-auto">
                {thumbnails?.map((thumb: typeof thumbnails[0]) => (
                  <div
                    key={thumb._id}
                    className="grid gap-4 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
                    style={{ gridTemplateColumns: '1fr 1fr 80px 80px 100px' }}
                  >
                    <p className={`text-sm truncate ${thumb.isActive ? 'text-[#E8ECF1]' : 'text-[#475569] line-through'}`}>
                      {thumb.fileName}
                    </p>
                    <p className="text-xs text-[#475569] font-mono-data truncate">{thumb.driveFileId}</p>
                    <div className="flex items-center gap-1 text-xs text-[#8A95A5]">
                      <Hash size={12} />
                      {thumb.useCount}
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full w-fit"
                      style={{
                        backgroundColor: thumb.isActive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: thumb.isActive ? '#4ADE80' : '#EF4444',
                      }}
                    >
                      {thumb.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleToggle(thumb._id)}
                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/5"
                        title={thumb.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={14} className={thumb.isActive ? 'text-[#4ADE80]' : 'text-[#475569]'} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(thumb._id)}
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
        title="Delete Thumbnail"
        description="This thumbnail will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </div>
  )
}
