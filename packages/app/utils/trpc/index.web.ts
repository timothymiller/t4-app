import { createTRPCNext } from '@trpc/next'
import { httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '@t4/api/src/router'
import superjson from 'superjson'
import { getToken } from '../supabase/cookies'

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
          async headers() {
            return {
              Authorization: `Bearer ${getToken()}`,
            }
          },
          url: `${getBaseUrl()}/trpc`,
        }),
      ],
    }
  },
  ssr: false,
})
