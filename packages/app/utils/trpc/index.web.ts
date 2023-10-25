import type { AppRouter } from '@t4/api/src/router'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
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
    }
  },
  ssr: false,
})
