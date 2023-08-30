import { createPagesBrowserClient, type Session } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { DEFAULT_COOKIE_OPTIONS } from '@supabase/auth-helpers-shared'

interface Props {
  children: React.ReactNode
  initialSession: Session | null
}

export const AuthProvider = ({ children, initialSession }: Props): React.ReactNode => {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      cookieOptions: secureCookieOptions,
    })
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}

export const AUTH_TOKEN_COOKIE_NAME = 'auth-token'

export const secureCookieOptions = {
  name: AUTH_TOKEN_COOKIE_NAME,
  ...DEFAULT_COOKIE_OPTIONS,
  sameSite: 'Strict',
  secure: true,
  // domain: 'localhost',
}
