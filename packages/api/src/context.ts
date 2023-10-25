import { type inferAsyncReturnType } from '@trpc/server'
import { Bindings } from '.'
import type { DB } from './db/client'
import { createDb } from './db/client'
import { createHonoAuth } from './auth/hono'
import type { Context as HonoContext, HonoRequest } from 'hono'
import { AuthRequest, Session } from 'lucia'
import { SessionUser, getPayloadFromJWT } from './auth/user'


export interface ApiContextProps {
  session?: Session
  user: SessionUser | null
  auth: Lucia.Auth
  authRequest?: AuthRequest<Lucia.Auth>
  req: HonoRequest,
  setCookie: (value: string) => void
  db: DB
  env: Bindings
}

export const createContext = async (
  env: Bindings,
  context: HonoContext,
  isBunTime?: boolean,
  databaseId?: string,
): Promise<ApiContextProps> => {
  if (!env.DB) {
    throw new Error('Database binding is undefined')
  }
  const db = createDb(env.DB, isBunTime, databaseId)

  // This was used with supabase auth,
  // For lucia, we pass just the session ID rather than a JWT
  async function getUser() {
    const sessionToken = context.req.header('Authorization')?.split(' ')[1]

    if (sessionToken) {
      if (!env.JWT_VERIFICATION_KEY) {
        console.error('JWT_VERIFICATION_KEY is not set')
        return null
      }

      try {
        const payload = await getPayloadFromJWT(sessionToken, env.JWT_VERIFICATION_KEY)
        if (!payload) {
          return null
        }
        if (payload.sub) {
          return {
            id: payload.sub,
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
    let session: Session | undefined
    let authRequest: AuthRequest<Lucia.Auth> | undefined

    if (context.req) {
      authRequest = auth.handleRequest(context)
      session = await authRequest.validate() || undefined
      // Allow for either cookie or bearer token
      if (!session) {
        session = await authRequest.validateBearerToken() || undefined
      }
    }
    return { session, authRequest }
  }

  const { session, authRequest } = await getSession()
  return {
    db,
    auth,
    authRequest,
    req: context.req,
    session,
    user: session?.user ?? null,
    setCookie: (value) => {
      context.res.headers.append('Set-Cookie', value)
    },
    env,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
