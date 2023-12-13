import { useAuthRedirect } from 'app/utils/supertokens/hooks/useAuthRedirect'

export const AuthStatusChangeHandler = () => {
  useAuthRedirect()
  return null
}
