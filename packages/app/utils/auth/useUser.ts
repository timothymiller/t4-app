import { useSessionContext } from './index'

export const useUser = () => {
  const { session, user, isLoading } = useSessionContext()
  // TODO: Load profile information from external sources here
  // Ex: profile photo, display name, etc.

  return {
    session,
    user,
    isLoading,
  }
}
