import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from 'app/utils/supabase/client'
import { AuthStatusChangeHandler } from '../../utils/supabase/components/AuthStatusChangeHandler'
import { Props } from './index.web'

export const AuthProvider = ({ children, initialSession }: Props) => {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      <AuthStatusChangeHandler />
      {children}
    </SessionContextProvider>
  )
}
