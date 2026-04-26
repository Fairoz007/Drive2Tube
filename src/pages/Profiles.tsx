import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { FolderOpen, Plus, Edit3, Trash2, Power, Youtube, Image, Clock, Hash } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProfileFormData {
  name: string
  driveFolderId: string
  driveFolderName: string
  thumbnailFolderId: string
  thumbnailFolderName: string
  youtubeChannelId: string
  youtubeChannelName: string
  dailyUploadCount: number
  scheduleTimes: string[]
  useRandomTitle: boolean
  useRandomThumbnail: boolean
}

const defaultForm: ProfileFormData = {
  name: '',
  driveFolderId: '',
  driveFolderName: '',
  thumbnailFolderId: '',
  thumbnailFolderName: '',
  youtubeChannelId: '',
  youtubeChannelName: '',
  dailyUploadCount: 1,
  scheduleTimes: ['09:00'],
  useRandomTitle: false,
  useRandomThumbnail: false,
}

export function ProfilesPage() {
  const profiles = useQuery(api.profiles.list)
  const createProfile = useMutation(api.profiles.create)
  const updateProfile = useMutation(api.profiles.update)
  const deleteProfile = useMutation(api.profiles.remove)
  const toggleProfile = useMutation(api.profiles.toggleActive)

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProfileFormData>(defaultForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [scheduleInput, setScheduleInput] = useState('')

  const openCreate = () => {
    setForm(defaultForm)
    setEditingId(null)
    setScheduleInput('')
    setShowModal(true)
  }

  const openEdit = (profile: NonNullable<typeof profiles>[0]) => {
    setForm({
      name: profile.name,
      driveFolderId: profile.driveFolderId,
      driveFolderName: profile.driveFolderName,
      thumbnailFolderId: profile.thumbnailFolderId ?? '',
      thumbnailFolderName: profile.thumbnailFolderName ?? '',
      youtubeChannelId: profile.youtubeChannelId ?? '',
      youtubeChannelName: profile.youtubeChannelName ?? '',
      dailyUploadCount: profile.dailyUploadCount,
      scheduleTimes: profile.scheduleTimes,
      useRandomTitle: profile.useRandomTitle,
      useRandomThumbnail: profile.useRandomThumbnail,
    })
    setEditingId(profile._id)
    setScheduleInput('')
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Profile name is required')
      return
    }
    if (!form.driveFolderId.trim()) {
      toast.error('Drive folder ID is required')
      return
    }

    try {
      if (editingId) {
        await updateProfile({ id: editingId as any, ...form })
        toast.success('Profile updated')
      } else {
        await createProfile(form)
        toast.success('Profile created')
      }
      setShowModal(false)
      setForm(defaultForm)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProfile({ id: id as any })
      toast.success('Profile deleted')
      setDeleteConfirm(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleProfile({ id: id as any })
      toast.success('Status updated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle')
    }
  }

  const addScheduleTime = () => {
    if (scheduleInput && /^\d{2}:\d{2}$/.test(scheduleInput)) {
      if (!form.scheduleTimes.includes(scheduleInput)) {
        setForm({ ...form, scheduleTimes: [...form.scheduleTimes, scheduleInput].sort() })
      }
      setScheduleInput('')
    }
  }

  const removeScheduleTime = (time: string) => {
    setForm({ ...form, scheduleTimes: form.scheduleTimes.filter((t) => t !== time) })
  }

  if (!profiles) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 animate-skeleton rounded" style={{ backgroundColor: '#111D2E' }} />
          <div className="h-10 w-32 animate-skeleton rounded-lg" style={{ backgroundColor: '#111D2E' }} />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-skeleton rounded-xl" style={{ backgroundColor: '#111D2E' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#E8ECF1]">Content Profiles</h2>
          <p className="text-sm text-[#8A95A5] mt-0.5">{profiles.length} profile{profiles.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#2196F3' }}
        >
          <Plus size={16} />
          New Profile
        </button>
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No Content Profiles Yet"
          description="Create your first content profile to start automating uploads from Google Drive to YouTube."
          action={{ label: 'Create Profile', onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {profiles.map((profile: typeof profiles[0]) => (
            <div
              key={profile._id}
              className="rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: '#111D2E',
                border: '1px solid #2A3A52',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}
                  >
                    <FolderOpen size={20} className="text-[#2196F3]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#E8ECF1]">{profile.name}</h3>
                    <StatusBadge status={profile.isActive ? 'active' : 'inactive'} />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggle(profile._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
                    title={profile.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <Power size={15} className={profile.isActive ? 'text-[#4ADE80]' : 'text-[#475569]'} />
                  </button>
                  <button
                    onClick={() => openEdit(profile)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    <Edit3 size={15} className="text-[#8A95A5]" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(profile._id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
                  >
                    <Trash2 size={15} className="text-[#EF4444]" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-[#8A95A5]">
                  <FolderOpen size={13} className="text-[#475569]" />
                  <span className="truncate">{profile.driveFolderName || profile.driveFolderId}</span>
                </div>
                {profile.thumbnailFolderName && (
                  <div className="flex items-center gap-2 text-xs text-[#8A95A5]">
                    <Image size={13} className="text-[#475569]" />
                    <span className="truncate">{profile.thumbnailFolderName}</span>
                  </div>
                )}
                {profile.youtubeChannelName && (
                  <div className="flex items-center gap-2 text-xs text-[#8A95A5]">
                    <Youtube size={13} className="text-[#475569]" />
                    <span className="truncate">{profile.youtubeChannelName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-[#8A95A5]">
                  <Hash size={13} className="text-[#475569]" />
                  <span>{profile.dailyUploadCount}/day</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8A95A5]">
                  <Clock size={13} className="text-[#475569]" />
                  <span>{profile.scheduleTimes.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#2A3A52]">
                <span className="text-xs text-[#475569]">
                  {profile.useRandomTitle ? 'Random title' : 'Sequential title'}
                </span>
                <span className="text-[#2A3A52]">|</span>
                <span className="text-xs text-[#475569]">
                  {profile.useRandomThumbnail ? 'Random thumbnail' : 'Sequential thumbnail'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(10, 22, 40, 0.7)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{ backgroundColor: '#1A2744', border: '1px solid #2A3A52' }}
          >
            <h2 className="text-xl font-bold text-[#E8ECF1] mb-1">
              {editingId ? 'Edit Profile' : 'New Content Profile'}
            </h2>
            <p className="text-sm text-[#8A95A5] mb-6">
              {editingId ? 'Update your content profile settings.' : 'Create a new content profile for automated uploads.'}
            </p>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-[#8A95A5] mb-1.5">Profile Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Palworld, GTA V, Minecraft"
                  className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all"
                  style={{
                    backgroundColor: '#111D2E',
                    border: '1px solid #2A3A52',
                    color: '#E8ECF1',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Drive Folder */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#8A95A5] mb-1.5">Drive Folder ID *</label>
                  <input
                    type="text"
                    value={form.driveFolderId}
                    onChange={(e) => setForm({ ...form, driveFolderId: e.target.value })}
                    placeholder="Folder ID"
                    className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all font-mono-data"
                    style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                    onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8A95A5] mb-1.5">Folder Name</label>
                  <input
                    type="text"
                    value={form.driveFolderName}
                    onChange={(e) => setForm({ ...form, driveFolderName: e.target.value })}
                    placeholder="Display name"
                    className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all"
                    style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                    onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              {/* Thumbnail Folder */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#8A95A5] mb-1.5">Thumbnail Folder ID</label>
                  <input
                    type="text"
                    value={form.thumbnailFolderId}
                    onChange={(e) => setForm({ ...form, thumbnailFolderId: e.target.value })}
                    placeholder="Folder ID"
                    className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all font-mono-data"
                    style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                    onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8A95A5] mb-1.5">Thumbnail Folder Name</label>
                  <input
                    type="text"
                    value={form.thumbnailFolderName}
                    onChange={(e) => setForm({ ...form, thumbnailFolderName: e.target.value })}
                    placeholder="Display name"
                    className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all"
                    style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                    onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              {/* YouTube Channel */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#8A95A5] mb-1.5">YouTube Channel ID</label>
                  <input
                    type="text"
                    value={form.youtubeChannelId}
                    onChange={(e) => setForm({ ...form, youtubeChannelId: e.target.value })}
                    placeholder="Channel ID"
                    className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all font-mono-data"
                    style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                    onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8A95A5] mb-1.5">Channel Name</label>
                  <input
                    type="text"
                    value={form.youtubeChannelName}
                    onChange={(e) => setForm({ ...form, youtubeChannelName: e.target.value })}
                    placeholder="Display name"
                    className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all"
                    style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                    onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              {/* Daily Upload Count & Schedule */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#8A95A5] mb-1.5">Daily Uploads (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.dailyUploadCount}
                    onChange={(e) => setForm({ ...form, dailyUploadCount: Math.min(Math.max(parseInt(e.target.value) || 1, 1), 10) })}
                    className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all"
                    style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                    onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8A95A5] mb-1.5">Add Schedule (HH:MM)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scheduleInput}
                      onChange={(e) => setScheduleInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addScheduleTime()}
                      placeholder="09:00"
                      className="flex-1 h-11 px-4 rounded-lg text-sm outline-none transition-all font-mono-data"
                      style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                      onFocus={(e) => { e.target.style.borderColor = '#2196F3'; e.target.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.15)' }}
                      onBlur={(e) => { e.target.style.borderColor = '#2A3A52'; e.target.style.boxShadow = 'none' }}
                    />
                    <button
                      onClick={addScheduleTime}
                      className="h-11 px-3 rounded-lg text-sm font-medium text-white"
                      style={{ backgroundColor: '#2196F3' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Schedule Times Display */}
              {form.scheduleTimes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.scheduleTimes.map((time) => (
                    <span
                      key={time}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono-data"
                      style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196F3', border: '1px solid rgba(33, 150, 243, 0.2)' }}
                    >
                      {time}
                      <button onClick={() => removeScheduleTime(time)} className="hover:text-white ml-1">×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Toggle Options */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.useRandomTitle}
                    onChange={(e) => setForm({ ...form, useRandomTitle: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#2196F3]"
                  />
                  <span className="text-sm text-[#8A95A5]">Random title</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.useRandomThumbnail}
                    onChange={(e) => setForm({ ...form, useRandomThumbnail: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#2196F3]"
                  />
                  <span className="text-sm text-[#8A95A5]">Random thumbnail</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#2A3A52]">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 h-10 rounded-lg text-sm font-medium text-[#8A95A5] hover:bg-white/5 transition-colors border border-[#2A3A52]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 h-10 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: '#2196F3' }}
              >
                {editingId ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={!!deleteConfirm}
        title="Delete Profile"
        description="This will permanently delete this profile and all associated titles, thumbnails, and queue items. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />
    </div>
  )
}
