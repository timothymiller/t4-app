import { type Session, createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { secureCookieOptions } from 'app/utils/supabase/cookies'
import { useState } from 'react'
import { AuthStatusChangeHandler } from '../../utils/supabase/components/AuthStatusChangeHandler'

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
      <AuthStatusChangeHandler />
      {children}
    </SessionContextProvider>
  )
}
