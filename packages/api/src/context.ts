import { createHonoAuth, HonoLucia } from './auth/hono'
import { type Session } from './auth/user'
import { createDb } from './db/client'
import type { DB } from './db/client'
import type { User } from './db/schema'
import { Bindings } from './worker'
import type { inferAsyncReturnType } from '@trpc/server'
import type { Context as HonoContext, HonoRequest } from 'hono'
import type { AuthRequest, Lucia } from 'lucia'
import { verifyToken } from './utils/crypto'

export interface ApiContextProps {
  session?: Session
  user?: User
  auth: HonoLucia
  authRequest?: AuthRequest<Lucia>
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

  const auth = createHonoAuth(env.DB, env.APP_URL, context.req)

  async function getSession() {
    let user: User | undefined
    let session: Session | undefined
    let authRequest: AuthRequest<Lucia> | undefined

    if (context.req) {
      authRequest = auth.handleRequest(context)
      const authResult = await authRequest.validate()
      if (authResult.session) {
        session = authResult.session
        user = authResult.user || undefined
      }
      // console.log('cookie session and auth request', session, authRequest)
      if (!session && context.req.header('x-enable-tokens')) {
        const tokenAuthResult = await authRequest.validateBearerToken()
        if (tokenAuthResult.session) {
          session = tokenAuthResult.session
          user = tokenAuthResult.user || undefined
        }
      }
    }
    return { session, user, authRequest }
  }

  const { session, user, authRequest } = await getSession()
  return {
    db,
    auth,
    authRequest,
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
