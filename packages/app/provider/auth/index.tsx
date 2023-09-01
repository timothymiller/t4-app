import { supabase } from 'app/utils/supabase/client'
import { Props } from './index.web'
import { AuthStatusChangeHandler } from '../../utils/supabase/components/AuthStatusChangeHandler'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export const AuthProvider = ({ children, initialSession }: Props) => {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      <AuthStatusChangeHandler />
      {children}
    </SessionContextProvider>
  )
}
