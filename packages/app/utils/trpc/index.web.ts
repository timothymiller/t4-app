import { createTRPCNext } from '@trpc/next'
import { httpBatchLink, loggerLink } from '@trpc/client'
import type { AppRouter } from '@t4/api/src/router'
import superjson from 'superjson'
import { AUTH_TOKEN_COOKIE_NAME, getCookieValue } from '../supabase/cookies'

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

const getToken = (): string | undefined => {
  let token = getCookieValue(AUTH_TOKEN_COOKIE_NAME)
  if (token !== undefined) {
    const parse = JSON.parse(token)
    if (Array.isArray(parse) && parse.length > 0) {
      token = parse[0]
    }
  }
  return token
}
