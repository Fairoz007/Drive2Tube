import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { EmptyState } from '@/components/shared/EmptyState'
import { ScrollText, CheckCircle, XCircle, Clock, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react'

export function LogsPage() {
  const logs = useQuery(api.logs.list, { limit: 100 })
  const stats = useQuery(api.logs.getStats)

  if (!logs || !stats) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-skeleton rounded" style={{ backgroundColor: '#111D2E' }} />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-skeleton rounded-xl" style={{ backgroundColor: '#111D2E' }} />
          ))}
        </div>
        <div className="h-96 animate-skeleton rounded-xl" style={{ backgroundColor: '#111D2E' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#E8ECF1]">Upload Logs</h2>
          <p className="text-sm text-[#8A95A5] mt-0.5">{logs.length} log entries</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-5" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)' }}>
              <BarChart3 size={20} className="text-[#2196F3]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8ECF1]">{stats.totalUploads}</p>
              <p className="text-xs text-[#8A95A5]">Total uploads</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)' }}>
              <CheckCircle size={20} className="text-[#4ADE80]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8ECF1]">{stats.successfulUploads}</p>
              <p className="text-xs text-[#8A95A5]">Successful</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <XCircle size={20} className="text-[#EF4444]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8ECF1]">{stats.failedUploads}</p>
              <p className="text-xs text-[#8A95A5]">Failed</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
              <TrendingUp size={20} className="text-[#FBBF24]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#E8ECF1]">
                {stats.avgDuration > 0 ? `${(stats.avgDuration / 1000).toFixed(1)}s` : 'N/A'}
              </p>
              <p className="text-xs text-[#8A95A5]">Avg. duration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Rate Bar */}
      {stats.totalUploads > 0 && (
        <div className="rounded-xl p-5" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#8A95A5]">Success Rate</span>
            <span className="text-sm font-semibold text-[#E8ECF1]">
              {Math.round((stats.successfulUploads / stats.totalUploads) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(stats.successfulUploads / stats.totalUploads) * 100}%`,
                backgroundColor: '#4ADE80',
              }}
            />
          </div>
        </div>
      )}

      {/* Logs Table */}
      {logs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No Logs Yet"
          description="Upload logs will appear here once videos start uploading."
        />
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111D2E', border: '1px solid #2A3A52' }}>
          <div
            className="grid gap-4 px-4 py-3 text-xs font-medium uppercase tracking-wider"
            style={{
              gridTemplateColumns: '40px 1.5fr 1fr 1fr 100px 120px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: '#8A95A5',
              borderBottom: '1px solid #2A3A52',
            }}
          >
            <div></div>
            <div>Video</div>
            <div>Profile</div>
            <div>Title</div>
            <div>Status</div>
            <div className="text-right">Time</div>
          </div>

          <div className="divide-y divide-[#2A3A52]/50 max-h-[600px] overflow-y-auto">
            {logs.map((log: typeof logs[0]) => (
              <div
                key={log._id}
                className="grid gap-4 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: '40px 1.5fr 1fr 1fr 100px 120px' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: log.status === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  }}
                >
                  {log.status === 'success' ? (
                    <CheckCircle size={15} className="text-[#4ADE80]" />
                  ) : (
                    <AlertTriangle size={15} className="text-[#EF4444]" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#E8ECF1] font-medium truncate">{log.driveFileName}</p>
                  {log.youtubeVideoId && (
                    <p className="text-xs text-[#2196F3] font-mono-data truncate">{log.youtubeVideoId}</p>
                  )}
                </div>
                <p className="text-sm text-[#8A95A5]">{log.profileName}</p>
                <p className="text-sm text-[#8A95A5] truncate">{log.title}</p>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full w-fit"
                  style={{
                    backgroundColor: log.status === 'success' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: log.status === 'success' ? '#4ADE80' : '#EF4444',
                  }}
                >
                  {log.status === 'success' ? 'Success' : 'Failed'}
                </span>
                <div className="flex items-center justify-end gap-1 text-xs text-[#475569]">
                  <Clock size={11} />
                  {new Date(log.createdAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
