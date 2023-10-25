import { createTRPCNext } from '@trpc/next'
import { httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '@t4/api/src/router'
import superjson from 'superjson'

const getBaseUrl = () => {
  return `${process.env.NEXT_PUBLIC_API_URL}`
}

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
          url: `${getBaseUrl()}/trpc`,
        }),
      ],
    }
  },
  ssr: false,
})
