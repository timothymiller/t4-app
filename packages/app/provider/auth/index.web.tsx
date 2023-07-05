// import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { supabase } from 'app/utils/supabase'
import { setToken } from 'app/utils/trpc/index.web'
import { useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    // <ClerkProvider>
    <AuthSetter>{children}</AuthSetter>
    // </ClerkProvider>
  )
}

// Shim to set the header token from Clerk for TRPC
export function AuthSetter({ children }: { children: React.ReactNode }) {
  // const { getToken } = useAuth()
  useEffect(() => {
    const fetchToken = async () => {
      const { data } = await supabase.auth.getSession()
      setToken(data?.session?.access_token || '')
    }
    fetchToken()
  }, [])

  return <>{children}</>
}
