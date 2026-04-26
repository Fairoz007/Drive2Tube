import { SignIn, useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router'

export function SignInPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (isLoaded && isSignedIn) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0A1628]">
      <div className="w-full max-w-md animate-in fade-in duration-500">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 shadow-lg shadow-blue-500/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Drive2Tube</h1>
          <p className="text-[#2196F3] text-sm font-medium uppercase tracking-[0.2em] mt-2 opacity-80">Automation Personal</p>
        </div>

        {/* Sign In Container */}
        <div className="bg-[#111D2E] rounded-[2rem] border border-[#2A3A52] shadow-2xl overflow-hidden p-8">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[#8A95A5] text-sm font-medium">Initializing Security...</p>
            </div>
          ) : (
            <div className="w-full min-h-[300px]">
              <SignIn
                routing="path"
                path="/sign-in"
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'bg-transparent shadow-none p-0 w-full',
                    main: 'w-full',
                    header: 'hidden',
                    socialButtonsBlockButton: 'h-12 bg-[#0A1628] border-[#2A3A52] hover:bg-[#1A2744] text-white rounded-xl transition-all mb-4',
                    socialButtonsBlockButtonText: 'text-white font-medium',
                    formFieldLabel: 'text-[#8A95A5] text-sm mb-2',
                    formFieldInput: 'h-12 bg-[#0A1628] border-[#2A3A52] text-white focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3] rounded-xl transition-all',
                    formButtonPrimary: 'h-12 bg-[#2196F3] hover:bg-[#42A5F5] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 mt-4',
                    footer: 'mt-6',
                    footerActionLink: 'text-[#2196F3] hover:text-[#42A5F5] font-semibold',
                    identityPreview: 'bg-[#0A1628] border-[#2A3A52] rounded-xl',
                    identityPreviewText: 'text-white',
                    formFieldAction: 'text-[#2196F3] hover:text-[#42A5F5]',
                    dividerLine: 'bg-[#2A3A52]',
                    dividerText: 'text-[#475569] uppercase text-[10px] font-bold tracking-widest',
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#475569] text-xs flex items-center justify-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#2196F3]" />
            Secured by enterprise-grade encryption
            <span className="w-1 h-1 rounded-full bg-[#2196F3]" />
          </p>
        </div>
      </div>
    </div>
  )
}
