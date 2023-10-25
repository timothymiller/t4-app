// import { supabase } from 'app/utils/supabase/client'
// import type { SupabaseAuthProps } from './index.web'
import { LuciaAuthProvider } from './index.web'
// import { AuthStatusChangeHandler } from '../../utils/supabase/components/AuthStatusChangeHandler'
// import { SessionContextProvider } from '@supabase/auth-helpers-react'

export { LuciaAuthProvider }

// export const SupabaseAuthProvider = ({ children, initialSession }: SupabaseAuthProps) => {
//   return (
//     <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
//       <AuthStatusChangeHandler />
//       {children}
//     </SessionContextProvider>
//   )
// }
