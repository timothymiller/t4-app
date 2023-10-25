// This is currently not used because the T4 API server can be on a different
// domain and the NextJS server won't be able to read the session cookie. It
// could be possible to proxy the API server through the NextJS server using the
// next.config.js rewrites feature. That would make it possible to use Lucia
// auth in NextJS for SSR.

import { nextjs } from 'lucia/middleware'
import { getAuthConfig } from './shared'
import { lucia } from 'lucia'

export const createNextJSAuth = (db: D1Database, url: string) => {
  return lucia({
    ...getAuthConfig(db, url),
    middleware: nextjs(),
  })
}
