import { useLocation } from 'react-router'
import { useUser } from '@clerk/clerk-react'
import { Search, Bell, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '../../../convex/_generated/api'

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Overview', subtitle: 'Dashboard overview and upload analytics' },
  '/profiles': { title: 'Content Profiles', subtitle: 'Manage your content upload profiles' },
  '/scheduler': { title: 'Upload Scheduler', subtitle: 'Schedule and manage upload times' },
  '/queue': { title: 'Queue Manager', subtitle: 'Monitor and manage upload queue' },
  '/titles': { title: 'Titles Manager', subtitle: 'Manage video titles for uploads' },
  '/thumbnails': { title: 'Thumbnail Manager', subtitle: 'Manage thumbnail images for uploads' },
  '/logs': { title: 'Upload Logs', subtitle: 'View upload history and activity' },
  '/settings': { title: 'Settings', subtitle: 'Configure your automation preferences' },
}

export function Topbar() {
  const location = useLocation()
  const { user } = useUser()
  const [searchFocused, setSearchFocused] = useState(false)

  const meta = pageMeta[location.pathname] ?? { title: 'Dashboard', subtitle: '' }

  const { isAuthenticated } = useConvexAuth()
  const queueStats = useQuery(api.queue.getStats, isAuthenticated ? {} : 'skip')
  const hasNotifications = (queueStats?.totalFailed ?? 0) > 0

  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center justify-between px-6"
      style={{
        height: 64,
        left: 260,
        backgroundColor: '#111D2E',
        borderBottom: '1px solid #2A3A52',
      }}
    >
      {/* Page Info */}
      <div>
        <h1 className="text-[#E8ECF1] text-2xl font-bold tracking-tight">{meta.title}</h1>
        <p className="text-[#8A95A5] text-sm">{meta.subtitle}</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 h-10 rounded-lg transition-all duration-200"
          style={{
            width: 280,
            backgroundColor: '#111D2E',
            border: `1px solid ${searchFocused ? '#2196F3' : '#2A3A52'}`,
            boxShadow: searchFocused ? '0 0 20px rgba(33, 150, 243, 0.15)' : 'none',
          }}
        >
          <Search size={16} className="text-[#475569] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-[#E8ECF1] placeholder-[#475569] outline-none w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Refresh */}
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-[#1A2744]"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={18} className="text-[#8A95A5]" />
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-[#1A2744] relative">
          <Bell size={18} className="text-[#8A95A5]" />
          {hasNotifications && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
          )}
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#2196F3] flex items-center justify-center text-white text-sm font-semibold">
              {user?.firstName?.[0] ?? 'U'}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
