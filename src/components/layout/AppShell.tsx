import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Toaster } from 'react-hot-toast'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0A1628' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 260 }}>
        <Topbar />
        <main className="flex-1 p-6 overflow-auto" style={{ paddingTop: 88, backgroundColor: '#0A1628' }}>
          {children}
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A2744',
            border: '1px solid #2A3A52',
            borderRadius: '12px',
            color: '#E8ECF1',
            padding: '16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          },
        }}
      />
    </div>
  )
}
