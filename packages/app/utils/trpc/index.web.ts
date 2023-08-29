import { createTRPCNext } from '@trpc/next'
import { httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '@t4/api/src/router'
import { supabase } from '../supabase'
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
    }
  },
  ssr: false,
})
