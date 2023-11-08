import { AuthChangeEvent } from '@supabase/supabase-js'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'
import { useRouter as useNextRouter } from 'next/router'
import { useEffect } from 'react'
import { useRouter } from 'solito/router'

export const useAuthRedirect = () => {
  const supabase = useSupabase()
  const router = useRouter()
  const { pathname } = useNextRouter()

  useEffect(() => {
    const signOutListener = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
      if (event === 'SIGNED_OUT') {
        if (pathname !== '/') {
          router.replace('/')
        }
      }
    })
    return () => {
      signOutListener.data.subscription.unsubscribe()
    }
  }, [supabase, router, pathname])
}
