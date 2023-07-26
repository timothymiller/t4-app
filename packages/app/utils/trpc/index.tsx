import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@t4/api/src/router'

/**
 * A wrapper for your app that provides the TRPC context.
 */
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { supabase } from '../supabase/auth'
import { useAuth } from '@clerk/clerk-expo'
import { useObservable } from '@legendapp/state/react'

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCReact<AppRouter>()

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL
}

export const TRPCProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { getToken } = useAuth()
  const queryClient = useObservable(new QueryClient())
  const trpcClient = useObservable(
    trpc.createClient({
      links: [
        httpBatchLink({
          async headers() {
            const { data } = await supabase.auth.getSession()
            const token = data?.session?.access_token

            return {
              Authorization: token ? `Bearer ${token}` : undefined,
            }
          },
          url: `${getBaseUrl()}/trpc`,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient.get()} queryClient={queryClient.get()}>
      <QueryClientProvider client={queryClient.get()}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
