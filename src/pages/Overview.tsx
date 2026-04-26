import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { FolderOpen, Clock, CheckCircle, AlertCircle, Zap, Activity } from 'lucide-react'
import { Link } from 'react-router'

export function OverviewPage() {
  const overview = useQuery(api.dashboard.getOverview)

  if (!overview) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl animate-skeleton" style={{ backgroundColor: '#111D2E' }} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-80 rounded-xl animate-skeleton" style={{ backgroundColor: '#111D2E' }} />
          <div className="h-80 rounded-xl animate-skeleton" style={{ backgroundColor: '#111D2E' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Profiles"
          value={overview.totalProfiles}
          sublabel={`${overview.activeProfiles} active`}
          color="blue"
        />
        <StatCard
          label="Uploads Today"
          value={overview.totalUploadsToday}
          sublabel={`${overview.uploadsRemainingToday} remaining`}
          color="green"
        />
        <StatCard
          label="In Queue"
          value={overview.queueStats.queued}
          sublabel={`${overview.queueStats.uploading} uploading now`}
          color="yellow"
        />
        <StatCard
          label="Failed"
          value={overview.queueStats.failed}
          sublabel="requires attention"
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upload Trend Chart */}
        <div
          className="lg:col-span-2 rounded-xl p-6"
          style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#E8ECF1]">Upload Trend</h3>
              <p className="text-xs text-[#8A95A5] mt-0.5">Daily uploads over the last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#2196F3]" />
              <span className="text-xs text-[#8A95A5]">
                {overview.uploadTrend.reduce((sum: number, d: { uploads: number }) => sum + d.uploads, 0)} total
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={overview.uploadTrend}>
              <defs>
                <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2196F3" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2196F3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A52" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#475569"
                tick={{ fill: '#8A95A5', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                tick={{ fill: '#8A95A5', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A2744',
                  border: '1px solid #2A3A52',
                  borderRadius: '8px',
                  color: '#E8ECF1',
                }}
                itemStyle={{ color: '#2196F3' }}
              />
              <Area
                type="monotone"
                dataKey="uploads"
                stroke="#2196F3"
                strokeWidth={2}
                fill="url(#uploadGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Queue Status */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
        >
          <h3 className="text-base font-semibold text-[#E8ECF1] mb-1">Queue Status</h3>
          <p className="text-xs text-[#8A95A5] mb-6">Current upload queue breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { name: 'Queued', value: overview.queueStats.queued, fill: '#2196F3' },
                { name: 'Uploading', value: overview.queueStats.uploading, fill: '#FBBF24' },
                { name: 'Completed', value: overview.queueStats.completed, fill: '#4ADE80' },
                { name: 'Failed', value: overview.queueStats.failed, fill: '#EF4444' },
              ]}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3A52" horizontal={false} />
              <XAxis type="number" stroke="#475569" tick={{ fill: '#8A95A5', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#475569"
                tick={{ fill: '#8A95A5', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A2744',
                  border: '1px solid #2A3A52',
                  borderRadius: '8px',
                  color: '#E8ECF1',
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link
              to="/queue"
              className="text-xs text-[#2196F3] hover:text-[#42A5F5] transition-colors font-medium"
            >
              View full queue →
            </Link>
          </div>
        </div>
      </div>

      {/* Today's Schedule & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Schedule */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#E8ECF1]">Today&apos;s Schedule</h3>
              <p className="text-xs text-[#8A95A5] mt-0.5">Scheduled uploads for today</p>
            </div>
            <Clock size={18} className="text-[#8A95A5]" />
          </div>

          {overview.todaysSchedule.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#475569]">No uploads scheduled for today</p>
              <Link
                to="/scheduler"
                className="text-xs text-[#2196F3] hover:text-[#42A5F5] mt-2 inline-block"
              >
                Configure schedule →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {overview.todaysSchedule.map((item: { profileName: string; scheduledTime: string; status: string }, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Zap size={14} className="text-[#2196F3]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#E8ECF1] font-medium">{item.profileName}</p>
                      <p className="text-xs text-[#8A95A5]">{item.scheduledTime} UTC</p>
                    </div>
                  </div>
                  <StatusBadge status={item.status as 'pending' | 'queued' | 'completed' | 'failed'} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#E8ECF1]">Recent Activity</h3>
              <p className="text-xs text-[#8A95A5] mt-0.5">Latest upload events</p>
            </div>
            <Activity size={18} className="text-[#8A95A5]" />
          </div>

          {overview.recentLogs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[#475569]">No upload activity yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {overview.recentLogs.map((log: { _id: string; title: string; profileName: string; status: string; createdAt: number }) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: log.status === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      }}
                    >
                      {log.status === 'success' ? (
                        <CheckCircle size={14} className="text-[#4ADE80]" />
                      ) : (
                        <AlertCircle size={14} className="text-[#EF4444]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[#E8ECF1] font-medium truncate">{log.title}</p>
                      <p className="text-xs text-[#8A95A5] truncate">{log.profileName}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#475569] flex-shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-center">
            <Link
              to="/logs"
              className="text-xs text-[#2196F3] hover:text-[#42A5F5] transition-colors font-medium"
            >
              View all logs →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/profiles"
          className="flex items-center gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
          style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
            <FolderOpen size={20} className="text-[#2196F3]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#E8ECF1] group-hover:text-[#2196F3] transition-colors">Manage Profiles</p>
            <p className="text-xs text-[#8A95A5]">{overview.totalProfiles} profiles configured</p>
          </div>
        </Link>

        <Link
          to="/queue"
          className="flex items-center gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
          style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
            <CheckCircle size={20} className="text-[#FBBF24]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#E8ECF1] group-hover:text-[#FBBF24] transition-colors">View Queue</p>
            <p className="text-xs text-[#8A95A5]">
              {overview.queueStats.queued + overview.queueStats.uploading} items pending
            </p>
          </div>
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
          style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: overview.autoUploadEnabled ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
            <Zap size={20} className={overview.autoUploadEnabled ? 'text-[#4ADE80]' : 'text-[#EF4444]'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#E8ECF1] transition-colors">
              Auto-Upload {overview.autoUploadEnabled ? 'On' : 'Off'}
            </p>
            <p className="text-xs text-[#8A95A5]">
              {overview.autoUploadEnabled ? 'Automation is running' : 'Enable in settings'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
