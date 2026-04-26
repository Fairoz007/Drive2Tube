import { SignIn } from '@clerk/clerk-react'

export function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A1628' }}>
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <svg width="48" height="48" viewBox="0 0 28 28" fill="none" className="mb-4">
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
          <h1 className="text-2xl font-semibold text-[#E8ECF1] tracking-wide">Drive2Tube</h1>
          <p className="text-[#2196F3] text-xs uppercase tracking-[0.08em] mt-1">Personal</p>
        </div>

        {/* Sign In Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: '#1A2744',
            border: '1px solid #2A3A52',
          }}
        >
          <p className="text-center text-[#8A95A5] text-sm mb-6">
            Sign in to your automation dashboard
          </p>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none p-0',
                header: 'hidden',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'h-11 bg-[#111D2E] border-[#2A3A52] hover:bg-[#1a2d4a] text-[#E8ECF1]',
                socialButtonsBlockButtonText: 'text-[#E8ECF1]',
                formFieldLabel: 'text-[#8A95A5] text-sm',
                formFieldInput: 'h-11 bg-[#111D2E] border-[#2A3A52] text-[#E8ECF1] focus:border-[#2196F3] focus:ring-[#2196F3]',
                formButtonPrimary: 'h-11 bg-[#2196F3] hover:bg-[#42A5F5] text-white',
                footer: 'hidden',
                footerAction: 'hidden',
                footerActionText: 'text-[#8A95A5]',
                footerActionLink: 'text-[#2196F3]',
                identityPreview: 'bg-[#111D2E] border-[#2A3A52]',
                identityPreviewText: 'text-[#E8ECF1]',
                identityPreviewEditButton: 'text-[#2196F3]',
                alert: 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]',
                formFieldErrorText: 'text-[#EF4444]',
                otpCodeFieldInput: 'bg-[#111D2E] border-[#2A3A52] text-[#E8ECF1]',
              },
            }}
          />
        </div>

        <p className="text-center text-[#475569] text-xs mt-6 flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secured by Clerk
        </p>
      </div>
    </div>
  )
}
