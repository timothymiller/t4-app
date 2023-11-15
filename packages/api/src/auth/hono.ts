import { getAuthOptions } from './shared'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import type { Context as HonoContext, HonoRequest } from 'hono'
import { Lucia } from 'lucia'
import type { Middleware } from 'lucia'

export const hono = (): Middleware<[HonoContext]> => {
  return ({ args }) => {
    const [context] = args
    return {
      request: context.req,
      setCookie: (cookie) => {
        context.res.headers.append('set-cookie', cookie.serialize())
      },
    }
  }
}

export const createHonoAuth = (db: D1Database, appUrl: string, request?: HonoRequest) => {
  return new Lucia(new D1Adapter(db, { session: 'session', user: 'user' }), {
    ...getAuthOptions(db, appUrl, request),
    middleware: hono(),
  })
}

export type HonoLucia = ReturnType<typeof createHonoAuth>
