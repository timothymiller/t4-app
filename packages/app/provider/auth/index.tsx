import { SessionProvider } from 'app/utils/supertokens/hooks/useSession'
import { AuthStatusChangeHandler } from 'app/utils/supertokens/components/AuthStatusChangeHandler'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AuthStatusChangeHandler />
      {children}
    </SessionProvider>
  )
}
