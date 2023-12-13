import { AuthStatusChangeHandler } from 'app/utils/supertokens/components/AuthStatusChangeHandler'
import { SessionProvider } from 'app/utils/supertokens/hooks/useSession'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AuthStatusChangeHandler />
      {children}
    </SessionProvider>
  )
}
