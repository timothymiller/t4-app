// This is currently not used because the T4 API server can be on a different
// domain and the NextJS server won't be able to read the session cookie.
// If you move the hono routes to an /api prefix and proxy the API server
// through the NextJS server using the
// next.config.js rewrites feature, you could try using this to load the session
// from the database and set up a context for tRPC SSR.
// However, there are caching benefits to not utilizing SSR and auth for
// html requests and only utilizing the API server to fetch data.

import { getAuthOptions } from './shared'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { Lucia } from 'lucia'
import { nextjs } from 'lucia/middleware'

export const createNextJSAuth = (db: D1Database, appUrl: string, apiUrl: string) => {
  return new Lucia(new D1Adapter(db, { session: 'session', user: 'user' }), {
    ...getAuthOptions(db, appUrl),
    middleware: nextjs(),
  })
}

export type NextJSLucia = ReturnType<typeof createNextJSAuth>
