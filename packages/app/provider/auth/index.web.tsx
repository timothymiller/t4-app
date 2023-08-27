import { createPagesBrowserClient, type Session } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

interface Props {
  children: React.ReactNode
  initialSession: Session | null
}

export const AuthProvider = ({ children, initialSession }: Props): React.ReactNode => {
  const [supabaseClient] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}
