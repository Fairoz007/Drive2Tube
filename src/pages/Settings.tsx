import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { StatCard } from '@/components/shared/StatCard'
import {
  Shield,
  Globe,
  Bell,
  Zap,
  Upload,
  AlertTriangle,
  CheckCircle,
  User,
} from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const { user } = useUser()
  const settings = useQuery(api.settings.get)
  const upsertSettings = useMutation(api.settings.upsert)
  const profileCount = useQuery(api.profiles.list)
  const queueStats = useQuery(api.queue.getStats)
  const logStats = useQuery(api.logs.getStats)

  const [form, setForm] = useState({
    autoUploadEnabled: false,
    maxDailyUploads: 5,
    timezone: 'UTC',
    notifyOnComplete: true,
    notifyOnFail: true,
  })

  useEffect(() => {
    if (settings) {
      setForm({
        autoUploadEnabled: settings.autoUploadEnabled,
        maxDailyUploads: settings.maxDailyUploads,
        timezone: settings.timezone,
        notifyOnComplete: settings.notifyOnComplete,
        notifyOnFail: settings.notifyOnFail,
      })
    }
  }, [settings])

  const handleSave = async () => {
    try {
      await upsertSettings(form)
      toast.success('Settings saved')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings')
    }
  }

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Australia/Sydney',
    'Pacific/Auckland',
  ]

  if (!settings) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-skeleton rounded" style={{ backgroundColor: '#111D2E' }} />
        <div className="h-96 animate-skeleton rounded-xl" style={{ backgroundColor: '#111D2E' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#E8ECF1]">Settings</h2>
        <p className="text-sm text-[#8A95A5] mt-0.5">Manage your automation preferences</p>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Profiles" value={profileCount?.length ?? 0} color="blue" />
        <StatCard label="Total Uploads" value={logStats?.totalUploads ?? 0} color="green" />
        <StatCard label="Queue Items" value={(queueStats?.totalQueued ?? 0) + (queueStats?.totalUploading ?? 0)} color="yellow" />
        <StatCard label="Failed" value={queueStats?.totalFailed ?? 0} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-4">
          {/* Automation Settings */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                <Zap size={20} className="text-[#2196F3]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#E8ECF1]">Automation</h3>
                <p className="text-xs text-[#8A95A5]">Configure auto-upload behavior</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Auto Upload Toggle */}
              <div className="flex items-center justify-between py-3 border-b border-[#2A3A52]">
                <div>
                  <p className="text-sm font-medium text-[#E8ECF1]">Auto-Upload</p>
                  <p className="text-xs text-[#8A95A5]">Automatically process scheduled uploads</p>
                </div>
                <button
                  onClick={() => setForm({ ...form, autoUploadEnabled: !form.autoUploadEnabled })}
                  className="relative w-11 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: form.autoUploadEnabled ? '#2196F3' : '#475569' }}
                >
                  <div
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: form.autoUploadEnabled ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                </button>
              </div>

              {/* Max Daily Uploads */}
              <div className="flex items-center justify-between py-3 border-b border-[#2A3A52]">
                <div>
                  <p className="text-sm font-medium text-[#E8ECF1]">Max Daily Uploads</p>
                  <p className="text-xs text-[#8A95A5]">Global daily upload limit across all profiles</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={form.maxDailyUploads}
                  onChange={(e) => setForm({ ...form, maxDailyUploads: Math.min(Math.max(parseInt(e.target.value) || 1, 1), 20) })}
                  className="w-20 h-9 px-3 rounded-lg text-sm text-center outline-none transition-all font-mono-data"
                  style={{ backgroundColor: '#0A1628', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                  onFocus={(e) => { e.target.style.borderColor = '#2196F3' }}
                  onBlur={(e) => { e.target.style.borderColor = '#2A3A52' }}
                />
              </div>

              {/* Timezone */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#E8ECF1]">Timezone</p>
                  <p className="text-xs text-[#8A95A5]">Used for scheduling uploads</p>
                </div>
                <select
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  className="h-9 px-3 rounded-lg text-sm outline-none transition-all"
                  style={{ backgroundColor: '#0A1628', border: '1px solid #2A3A52', color: '#E8ECF1' }}
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                <Bell size={20} className="text-[#FBBF24]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#E8ECF1]">Notifications</h3>
                <p className="text-xs text-[#8A95A5]">Choose when to be notified</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#2A3A52]">
                <div>
                  <p className="text-sm font-medium text-[#E8ECF1]">On Upload Complete</p>
                  <p className="text-xs text-[#8A95A5]">Notify when a video is successfully uploaded</p>
                </div>
                <button
                  onClick={() => setForm({ ...form, notifyOnComplete: !form.notifyOnComplete })}
                  className="relative w-11 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: form.notifyOnComplete ? '#2196F3' : '#475569' }}
                >
                  <div
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: form.notifyOnComplete ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#E8ECF1]">On Upload Fail</p>
                  <p className="text-xs text-[#8A95A5]">Notify when a video upload fails</p>
                </div>
                <button
                  onClick={() => setForm({ ...form, notifyOnFail: !form.notifyOnFail })}
                  className="relative w-11 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: form.notifyOnFail ? '#2196F3' : '#475569' }}
                >
                  <div
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: form.notifyOnFail ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 h-11 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#2196F3' }}
            >
              <CheckCircle size={16} />
              Save Settings
            </button>
          </div>
        </div>

        {/* Sidebar - API Connections & Account */}
        <div className="space-y-4">
          {/* API Connections */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                <Shield size={20} className="text-[#2196F3]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#E8ECF1]">API Connections</h3>
                <p className="text-xs text-[#8A95A5]">Service integration status</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Google Drive */}
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-3">
                  <Upload size={16} className="text-[#4ADE80]" />
                  <div>
                    <p className="text-sm font-medium text-[#E8ECF1]">Google Drive</p>
                    <p className="text-xs text-[#475569]">Source videos</p>
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: settings.googleDriveConnected ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: settings.googleDriveConnected ? '#4ADE80' : '#EF4444',
                  }}
                >
                  {settings.googleDriveConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              {/* YouTube */}
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-[#EF4444]" />
                  <div>
                    <p className="text-sm font-medium text-[#E8ECF1]">YouTube</p>
                    <p className="text-xs text-[#475569]">Upload destination</p>
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: settings.youtubeConnected ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: settings.youtubeConnected ? '#4ADE80' : '#EF4444',
                  }}
                >
                  {settings.youtubeConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.1)' }}>
              <AlertTriangle size={14} className="text-[#FBBF24] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#8A95A5]">
                API connections are configured via environment variables. Update your Convex deployment settings to connect.
              </p>
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)' }}>
                <User size={20} className="text-[#4ADE80]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#E8ECF1]">Account</h3>
                <p className="text-xs text-[#8A95A5]">Your account details</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#2196F3] flex items-center justify-center text-white font-semibold">
                    {user?.firstName?.[0] ?? 'U'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[#E8ECF1]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[#8A95A5]">{user?.emailAddresses?.[0]?.emailAddress}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A3A52] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A95A5]">User ID</span>
                  <span className="text-[#475569] font-mono-data text-xs">{user?.id?.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A95A5]">Theme</span>
                  <span className="text-[#E8ECF1]">Dark</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
