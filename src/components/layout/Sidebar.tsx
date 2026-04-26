import { NavLink, useLocation } from 'react-router'
import { useAuth, useUser } from '@clerk/clerk-react'
import {
  LayoutDashboard,
  FolderOpen,
  CalendarClock,
  ListOrdered,
  Type,
  Image,
  ScrollText,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/upload', label: 'Quick Upload', icon: Upload },
  { path: '/profiles', label: 'Content Profiles', icon: FolderOpen },
  { path: '/scheduler', label: 'Upload Scheduler', icon: CalendarClock },
  { path: '/queue', label: 'Queue Manager', icon: ListOrdered },
  { path: '/titles', label: 'Titles Manager', icon: Type },
  { path: '/thumbnails', label: 'Thumbnail Manager', icon: Image },
  { path: '/logs', label: 'Logs', icon: ScrollText },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()
  const { signOut } = useAuth()
  const { user } = useUser()

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50"
      style={{
        width: 260,
        backgroundColor: '#0A1628',
        borderRight: '1px solid #2A3A52',
      }}
    >
      {/* Brand */}
      <div className="px-6 py-5 flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 2C8.477 2 4 6.477 4 12v2.5c0 .69-.22 1.34-.6 1.87l-.9 1.2c-.5.67-.14 1.93.8 2.13l2.3.46c.38.08.7.3.9.6l1.2 1.8c.5.75 1.7.75 2.2 0l1.2-1.8c.2-.3.52-.52.9-.6l2.3-.46c.94-.2 1.3-1.46.8-2.13l-.9-1.2c-.38-.53-.6-1.18-.6-1.87V12c0-3.314 2.686-6 6-6s6 2.686 6 6v2.5c0 .69-.22 1.34-.6 1.87l-.9 1.2c-.5.67-.14 1.93.8 2.13l2.3.46c.38.08.7.3.9.6l1.2 1.8c.5.75 1.7.75 2.2 0l1.2-1.8c.2-.3.52-.52.9-.6l2.3-.46c.94-.2 1.3-1.46.8-2.13l-.9-1.2c-.38-.53-.6-1.18-.6-1.87V12c0-5.523-4.477-10-10-10z"
            fill="#2196F3"
            fillOpacity="0.2"
          />
          <path
            d="M14 8v8m0 0l-3-3m3 3l3-3"
            stroke="#2196F3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 16c0-3.314 2.686-6 6-6s6 2.686 6 6"
            stroke="#2196F3"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div>
          <div className="text-[#E8ECF1] font-semibold text-xl tracking-wide">Drive2Tube</div>
          <div className="text-[#2196F3] text-xs uppercase tracking-[0.08em]">Personal</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 h-11 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-[#2196F3]'
                    : 'text-[#8A95A5] hover:text-[#E8ECF1] hover:bg-white/[0.04]'
                }`
              }
              style={isActive ? {
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
                borderLeft: '3px solid #2196F3',
              } : { borderLeft: '3px solid transparent' }}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom Status Area */}
      <div className="px-6 py-5 border-t border-[#2A3A52]">
        {/* User */}
        <div className="flex items-center gap-3 mb-4">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#2196F3] flex items-center justify-center text-white text-sm font-semibold">
              {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[#E8ECF1] text-sm font-medium truncate">
              {user?.firstName ?? 'User'}
            </div>
            <div className="text-[#8A95A5] text-xs truncate">
              {user?.emailAddresses?.[0]?.emailAddress ?? ''}
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
            <span className="text-[#475569] text-xs">Drive API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
            <span className="text-[#475569] text-xs">YouTube API</span>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-[#8A95A5] hover:text-[#E8ECF1] transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
