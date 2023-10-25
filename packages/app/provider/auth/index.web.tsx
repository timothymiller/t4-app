// import {
//   createPagesBrowserClient,
//   type Session as SupabaseSession,
// } from '@supabase/auth-helpers-nextjs'
// import { SessionContextProvider } from '@supabase/auth-helpers-react'
// import { useState } from 'react'
// import { secureCookieOptions } from 'app/utils/supabase/cookies'
// import { AuthStatusChangeHandler } from 'app/utils/supabase/components/AuthStatusChangeHandler'

import type { Session } from '@t4/api/src/auth/user'
import { useSessionContext } from 'app/utils/auth'

export interface LuciaAuthProps {
  children?: React.ReactNode
  initialSession: Session | null
}

export const LuciaAuthProvider = ({
  children,
  initialSession,
}: LuciaAuthProps): React.ReactNode => {
  useSessionContext()
  return <>{children}</>
}

// export interface SupabaseAuthProps {
//   children: React.ReactNode
//   initialSession: SupabaseSession | null
// }

// export const SupabaseAuthProvider = ({
//   children,
//   initialSession,
// }: SupabaseAuthProps): React.ReactNode => {
//   const [supabaseClient] = useState(() =>
//     createPagesBrowserClient({
//       cookieOptions: secureCookieOptions,
//     })
//   )

//   return (
//     <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
//       <AuthStatusChangeHandler />
//       {children}
//     </SessionContextProvider>
//   )
// }
