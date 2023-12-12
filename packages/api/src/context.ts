import { type Session } from './auth/user'
import { createDb } from './db/client'
import type { DB } from './db/client'
import type { User } from './db/schema'
import { Bindings } from './worker'
import type { inferAsyncReturnType } from '@trpc/server'
import type { Context as HonoContext, HonoRequest } from 'hono'
import type { Lucia } from 'lucia'
import { verifyToken } from './utils/crypto'
import { createAuth } from './auth/shared'
import { getCookie } from 'hono/cookie'

export interface ApiContextProps {
  session?: Session
  user?: User
  auth: Lucia
  req?: HonoRequest
  c?: HonoContext
  setCookie: (value: string) => void
  db: DB
  env: Bindings
}

export const createContext = async (
  env: Bindings,
  context: HonoContext,
  resHeaders: Headers
): Promise<ApiContextProps> => {
  if (!env.DB) {
    throw new Error('Database binding is undefined')
  }
  const db = createDb(env.DB)

  // This was used with supabase auth,
  // For lucia, we pass just the session ID rather than a JWT
  async function getUser() {
    const sessionToken = context.req.header('Authorization')?.split(' ')[1]

    if (sessionToken !== undefined && sessionToken !== 'undefined') {
      if (!env.JWT_VERIFICATION_KEY) {
        console.error('JWT_VERIFICATION_KEY is not set')
        return null
      }

      try {
        const payload = await verifyToken(sessionToken, env.JWT_VERIFICATION_KEY)
        if (!payload) {
          return null
        }
        if (payload.subject) {
          return {
            id: payload.subject,
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    return null
  }

  // const user = await getUser()

  const auth = createAuth(db, env.APP_URL)

  async function getSession() {
    let user: User | undefined
    let session: Session | undefined
    const res = {
      user,
      session,
    }

    if (!context.req) return res

    const cookieSessionId = getCookie(context, auth.sessionCookieName)
    const bearerSessionId =
      !cookieSessionId &&
      context.req.header('x-enable-tokens') &&
      context.req.header('authorization')?.split(' ')[1]

    if (!cookieSessionId && !bearerSessionId) return res

    const authResult = await auth.validateSession(cookieSessionId || bearerSessionId || '')
    if (cookieSessionId) {
      if (authResult.session?.fresh) {
        context.header('Set-Cookie', auth.createSessionCookie(authResult.session.id).serialize(), {
          append: true,
        })
      }
      if (!session) {
        context.header('Set-Cookie', auth.createBlankSessionCookie().serialize(), {
          append: true,
        })
      }
    }
    res.session = authResult.session || undefined
    res.user = authResult.user || undefined
    return res
  }

  const { session, user } = await getSession()
  return {
    db,
    auth,
    req: context.req,
    c: context,
    session,
    user,
    setCookie: (value) => {
      resHeaders.append('set-cookie', value)
    },
    env,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
