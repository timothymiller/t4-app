import type { Session } from '@supabase/supabase-js'
import { atom, useAtom } from 'jotai'

export const useSessionContext = () => {
  const [session] = useSession()
  const [isLoading] = useIsLoadingSession()

  // TODO: Load profile information from external sources here
  // Ex: profile photo, display name, etc.

  return {
    session,
    user: session?.user,
    isLoading,
  }
}

const sessionAtom = atom<Session | null>(null)

export function useSession() {
  return [...useAtom(sessionAtom)] as const
}

const isLoadingSessionAtom = atom(true)

export function useIsLoadingSession() {
  return [...useAtom(isLoadingSessionAtom)] as const
}
