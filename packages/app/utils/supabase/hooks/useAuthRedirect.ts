import { AuthChangeEvent } from '@supabase/supabase-js'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'
import { useEffect } from 'react'
import { useRouter } from 'solito/router'
import { useSession, useIsLoadingSession } from './useSessionContext.native'

export const useAuthRedirect = () => {
  const [, setSession] = useSession()
  const [, setLoading] = useIsLoadingSession()
  const supabase = useSupabase()
  const router = useRouter()
  useEffect(() => {
    const signOutListener = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
      if (event === 'SIGNED_OUT') {
        setSession(null)
        router.replace('/')
      }
      if (event === 'SIGNED_IN') {
        setLoading(true)
        const response = await supabase.auth.getSession()
        if (response?.data?.session) {
          setSession(response?.data?.session)
        }
        setLoading(false)
      }
    })
    return () => {
      signOutListener.data.subscription.unsubscribe()
    }
  }, [supabase, router])
}
