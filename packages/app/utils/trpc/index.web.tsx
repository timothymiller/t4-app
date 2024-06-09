'use client'

import type { AppRouter } from '@t4/api/src/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCReact, httpBatchLink, loggerLink } from '@trpc/react-query'
import { useState } from 'react'
import superjson from 'superjson'

export const trpc = createTRPCReact<AppRouter>()
// unstable_overrides: {
//   useMutation: {
//     async onSuccess(opts) {
//       await opts.originalFn()
//       await opts.queryClient.invalidateQueries()
//     },
//   },
// },

export function TRPCProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            networkMode: process.env.NODE_ENV === 'development' ? 'always' : 'online',
          },
          mutations: {
            networkMode: process.env.NODE_ENV === 'development' ? 'always' : 'online',
          },
        },
      })
  )
  const [trpcClient] = useState(() =>
    trpc.createClient({
      // tRPC will pause queries/mutations while offline
      // https://tanstack.com/query/latest/docs/react/guides/network-mode
      // If you are developing locally, you probably want to enable "always" network mode
      // so that tRPC will make requests to localhost.
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          fetch(url, options) {
            return fetch(url, {
              ...options,
              mode: 'cors',
              credentials: 'include',
              // always try to include cookies
            })
          },
          url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        }),
      ],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </trpc.Provider>
  )
}
