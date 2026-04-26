import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { CalendarClock, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import { Link } from 'react-router'

export function SchedulerPage() {
  const profiles = useQuery(api.profiles.list)
  const overview = useQuery(api.dashboard.getOverview)

  if (!profiles || !overview) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-skeleton rounded" style={{ backgroundColor: '#111D2E' }} />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-skeleton rounded-xl" style={{ backgroundColor: '#111D2E' }} />
          ))}
        </div>
      </div>
    )
  }

  const activeProfiles = profiles.filter((p: typeof profiles[0]) => p.isActive)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#E8ECF1]">Upload Scheduler</h2>
          <p className="text-sm text-[#8A95A5] mt-0.5">
            {activeProfiles.length} active profile{activeProfiles.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
              <Calendar size={20} className="text-[#2196F3]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8ECF1]">{overview.todaysSchedule.length}</p>
              <p className="text-xs text-[#8A95A5]">Scheduled today</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)' }}>
              <CheckCircle size={20} className="text-[#4ADE80]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8ECF1]">
                {overview.todaysSchedule.filter((s: { status: string }) => s.status === 'completed').length}
              </p>
              <p className="text-xs text-[#8A95A5]">Completed today</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
              <Clock size={20} className="text-[#FBBF24]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8ECF1]">
                {overview.todaysSchedule.filter((s: { status: string }) => s.status === 'pending').length}
              </p>
              <p className="text-xs text-[#8A95A5]">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Schedules */}
      {profiles.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No Profiles Configured"
          description="Create content profiles to set up upload schedules."
          action={{ label: 'Create Profile', onClick: () => window.location.href = '/profiles' }}
        />
      ) : (
        <div className="space-y-4">
          {profiles.map((profile: typeof profiles[0]) => (
            <div
              key={profile._id}
              className="rounded-xl p-5"
              style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                    <CalendarClock size={20} className="text-[#2196F3]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#E8ECF1]">{profile.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={profile.isActive ? 'active' : 'inactive'} />
                      <span className="text-xs text-[#475569]">•</span>
                      <span className="text-xs text-[#8A95A5]">{profile.dailyUploadCount} uploads/day</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/profiles"
                  className="text-xs text-[#2196F3] hover:text-[#42A5F5] transition-colors font-medium"
                >
                  Edit Profile →
                </Link>
              </div>

              {/* Schedule Times */}
              <div className="flex flex-wrap gap-2">
                {profile.scheduleTimes.map((time: string) => {
                  const scheduleStatus = overview.todaysSchedule.find(
                    (s: { profileName: string; scheduledTime: string }) => s.profileName === profile.name && s.scheduledTime === time
                  )?.status ?? 'pending'

                  return (
                    <div
                      key={time}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                    >
                      <Clock size={14} className="text-[#475569]" />
                      <span className="text-sm font-mono-data text-[#E8ECF1]">{time}</span>
                      <StatusBadge status={scheduleStatus as 'pending' | 'queued' | 'completed' | 'failed'} />
                    </div>
                  )
                })}
              </div>

              {/* Next Upload Info */}
              <div className="mt-4 pt-4 border-t border-[#2A3A52] flex items-center gap-2 text-xs text-[#8A95A5]">
                <AlertCircle size={13} className="text-[#475569]" />
                <span>
                  {profile.useRandomTitle ? 'Random title selection' : 'Sequential title selection'} •
                  {' '}{profile.useRandomThumbnail ? 'Random thumbnail' : 'Sequential thumbnail'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
