import { useSessionContext } from './useSessionContext'

export const useUser = () => {
  const { session, isLoading } = useSessionContext()
  const user = session?.user
  // TODO: Load profile information from external sources here
  // Ex: profile photo, display name, etc.

  return {
    session,
    user,
    isLoading,
  }
}
