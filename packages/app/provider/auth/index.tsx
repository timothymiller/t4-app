import { supabase } from 'app/utils/supabase/client'
import { Props } from './index.web'
import { useAuthRedirect } from 'app/utils/supabase/hooks/useAuthRedirect'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export const AuthProvider = ({ children, initialSession }: Props) => {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      <AuthStateChangeHandler />
      {children}
    </SessionContextProvider>
  )
}

export const AuthStateChangeHandler = () => {
  useAuthRedirect()
  return null
}
