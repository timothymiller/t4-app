import { AuthChangeEvent } from '@supabase/supabase-js'
import { useUser, useUserLoading } from 'app/atoms/auth'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'
import { useEffect } from 'react'
import { useRouter } from 'solito/router'

export const useAuthRedirect = () => {
  const [, setUser] = useUser()
  const [, setLoading] = useUserLoading()
  const supabase = useSupabase()
  const router = useRouter()
  useEffect(() => {
    const signOutListener = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        router.replace('/')
      }
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setLoading(true)
        const response = await supabase.auth.getUser()
        if (response?.data?.user) {
          setUser(response?.data?.user)
        }
        setLoading(false)
      }
    })
    return () => {
      signOutListener.data.subscription.unsubscribe()
    }
  }, [supabase, router])
}
