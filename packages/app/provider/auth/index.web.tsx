import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { setToken } from '../../utils/trpc/index.web'
import { useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <AuthSetter>{children}</AuthSetter>
    </ClerkProvider>
  )
}

// Shim to set the header token from Clerk for TRPC
export function AuthSetter({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth()
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken()
      setToken(token || '')
    }
    fetchToken()
  }, [])

  return <>{children}</>
}
