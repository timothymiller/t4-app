import { useAuthRedirect } from 'app/utils/supabase/hooks/useAuthRedirect'

export const AuthStatusChangeHandler = () => {
  useAuthRedirect()
  return null
}
