import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmationDialog } from '@/components/shared/ConfirmationDialog'
import { FolderOpen, Plus, Edit3, Trash2, Power, Youtube, Image as ImageIcon, Clock, Hash } from 'lucide-react'
import toast from 'react-hot-toast'
import { DrivePickerButton } from '@/components/shared/DrivePickerButton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

  const openEdit = (profile: any) => {
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
      toast.error('Drive folder selection is required')
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
    } else {
      toast.error('Please enter time in HH:MM format')
    }
  }

  const removeScheduleTime = (time: string) => {
    setForm({ ...form, scheduleTimes: form.scheduleTimes.filter((t) => t !== time) })
  }

  if (profiles === undefined) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 animate-skeleton rounded" style={{ backgroundColor: '#111D2E' }} />
          <div className="h-10 w-32 animate-skeleton rounded-lg" style={{ backgroundColor: '#111D2E' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 animate-skeleton rounded-xl" style={{ backgroundColor: '#111D2E' }} />
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
        <Button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Plus size={16} />
          New Profile
        </Button>
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
          {profiles.map((profile) => (
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
                    <ImageIcon size={13} className="text-[#475569]" />
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
              <div className="space-y-1.5">
                <label className="text-sm text-[#8A95A5]">Profile Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Palworld Highlights"
                  className="bg-[#111D2E] border-[#2A3A52] text-white"
                />
              </div>

              {/* Drive Folder */}
              <div className="space-y-1.5">
                <label className="text-sm text-[#8A95A5]">Source Video Folder *</label>
                <div className="flex gap-2">
                  <Input
                    value={form.driveFolderName || form.driveFolderId}
                    readOnly
                    placeholder="Select folder..."
                    className="bg-[#111D2E] border-[#2A3A52] text-white cursor-default"
                  />
                  <DrivePickerButton
                    type="folder"
                    label="Browse"
                    onSelect={(id, name) => setForm({ ...form, driveFolderId: id, driveFolderName: name })}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Thumbnail Folder */}
              <div className="space-y-1.5">
                <label className="text-sm text-[#8A95A5]">Thumbnail Folder (Optional)</label>
                <div className="flex gap-2">
                  <Input
                    value={form.thumbnailFolderName || form.thumbnailFolderId}
                    readOnly
                    placeholder="Select folder..."
                    className="bg-[#111D2E] border-[#2A3A52] text-white cursor-default"
                  />
                  <DrivePickerButton
                    type="folder"
                    label="Browse"
                    onSelect={(id, name) => setForm({ ...form, thumbnailFolderId: id, thumbnailFolderName: name })}
                    className="h-10"
                  />
                </div>
              </div>

              {/* YouTube Channel */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm text-[#8A95A5]">YouTube Channel ID</label>
                  <Input
                    value={form.youtubeChannelId}
                    onChange={(e) => setForm({ ...form, youtubeChannelId: e.target.value })}
                    placeholder="Channel ID"
                    className="bg-[#111D2E] border-[#2A3A52] text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-[#8A95A5]">Channel Name</label>
                  <Input
                    value={form.youtubeChannelName}
                    onChange={(e) => setForm({ ...form, youtubeChannelName: e.target.value })}
                    placeholder="Display name"
                    className="bg-[#111D2E] border-[#2A3A52] text-white"
                  />
                </div>
              </div>

              {/* Daily Upload Count \u0026 Schedule */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm text-[#8A95A5]">Daily Uploads (1-10)</label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={form.dailyUploadCount}
                    onChange={(e) => setForm({ ...form, dailyUploadCount: Math.min(Math.max(parseInt(e.target.value) || 1, 1), 10) })}
                    className="bg-[#111D2E] border-[#2A3A52] text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-[#8A95A5]">Add Time (HH:MM)</label>
                  <div className="flex gap-2">
                    <Input
                      value={scheduleInput}
                      onChange={(e) => setScheduleInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addScheduleTime()}
                      placeholder="09:00"
                      className="bg-[#111D2E] border-[#2A3A52] text-white font-mono"
                    />
                    <Button onClick={addScheduleTime} size="sm" className="bg-blue-600 hover:bg-blue-500">
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Schedule Times Display */}
              {form.scheduleTimes.length > 0 && (
                <div className="flex flex-wrap gap-2 py-1">
                  {form.scheduleTimes.map((time) => (
                    <span
                      key={time}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {time}
                      <button onClick={() => removeScheduleTime(time)} className="hover:text-white transition-colors text-lg leading-none">×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Toggle Options */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.useRandomTitle}
                    onChange={(e) => setForm({ ...form, useRandomTitle: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2A3A52] bg-[#111D2E] text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-[#8A95A5] group-hover:text-[#E8ECF1] transition-colors">Random title</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.useRandomThumbnail}
                    onChange={(e) => setForm({ ...form, useRandomThumbnail: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2A3A52] bg-[#111D2E] text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-[#8A95A5] group-hover:text-[#E8ECF1] transition-colors">Random thumbnail</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2A3A52]">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="bg-transparent border-[#2A3A52] text-[#8A95A5] hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]"
              >
                {editingId ? 'Update Profile' : 'Create Profile'}
              </Button>
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
