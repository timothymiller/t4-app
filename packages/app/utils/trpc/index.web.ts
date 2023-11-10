import { createTRPCNext } from '@trpc/next'
import { httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '@t4/api/src/router'
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
          url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        }),
      ],
    }
  },
  ssr: false,
})
