import { atom, useAtom } from 'jotai'
import type { User } from '@supabase/supabase-js'

const userAtom = atom<User | null>(null)

export function useSupabaseUser() {
  return [...useAtom(userAtom)] as const
}

const userLoadingAtom = atom(true)

export function useUserLoading() {
  return [...useAtom(userLoadingAtom)] as const
}
