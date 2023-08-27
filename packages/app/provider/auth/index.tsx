import { type Session } from '@supabase/auth-helpers-react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from 'app/utils/supabase'

interface Props {
  children: React.ReactNode
  initialSession: Session | null
}

export const AuthProvider = ({ children, initialSession }: Props): React.ReactNode => {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}
