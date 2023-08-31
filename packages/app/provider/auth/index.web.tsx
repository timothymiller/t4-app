import { createPagesBrowserClient, type Session } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { secureCookieOptions } from 'app/utils/supabase/cookies'
import { useAuthRedirect } from 'app/utils/supabase/hooks/useAuthRedirect'

export interface Props {
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
      <AuthStateChangeHandler />
      {children}
    </SessionContextProvider>
  )
}

export const AuthStateChangeHandler = () => {
  useAuthRedirect()
  return null
}
