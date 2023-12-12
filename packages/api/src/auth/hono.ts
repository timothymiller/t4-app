import { getAllowedOriginHost } from './shared'
import type { Context as HonoContext, Next } from 'hono'
import { Bindings } from '../worker'
import { verifyRequestOrigin } from 'oslo/request'

export const csrfMiddleware = async (c: HonoContext<{ Bindings: Bindings }>, next: Next) => {
  // CSRF middleware
  if (c.req.method === 'GET') {
    return next()
  }
  const originHeader = c.req.header('origin')
  const hostHeader = c.req.header('host')
  const allowedOrigin = getAllowedOriginHost(c.env.APP_URL, c.req.raw)
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader, ...(allowedOrigin ? [allowedOrigin] : [])])
  ) {
    return c.body(null, 403)
  }
  return next()
}
