import {
  Auth,
  AuthProviderName,
  getAuthConfig,
  getAuthProvider,
  isAuthProviderName,
} from './shared'
import type { Context as HonoContext, HonoRequest } from 'hono'
import { lucia } from 'lucia'
import type { Middleware, Cookie, RequestContext, User } from 'lucia'
import { ApiContextProps, createContext } from '../context'
import { getCookie } from 'hono/cookie'
import { AppleAuth, AppleUserAuth, GoogleAuth, GoogleUserAuth } from '@lucia-auth/oauth/providers'
import { OAuthRequestError, ProviderUserAuth } from '@lucia-auth/oauth'
import { createSession } from './user'

export const hono: () => Middleware<[HonoContext]> =
  () =>
  ({ args }) => {
    const [context] = args
    const requestContext: RequestContext = {
      request: {
        url: context.req.url,
        method: context.req.method,
        headers: {
          get: (name: string) => {
            const lowerName = name.toLowerCase()
            if (lowerName === 'authorization') {
              return context.req.header('Authorization') || null
            }
            if (lowerName === 'cookie') {
              return context.req.header('Cookie') || null
            }
            if (lowerName === 'origin') {
              return context.req.header('Origin') || null
            }
            return null
          },
        },
      },
      setCookie: (cookie: Cookie) => {
        // TBD if this is necessary to override
        // context.header('Set-Cookie', cookie.serialize())
        context.res.headers.append('Set-Cookie', cookie.serialize())
      },
    }
    return requestContext
  }

export const createHonoAuth = (db: D1Database, url: string, request: HonoRequest) => {
  return lucia({
    ...getAuthConfig(db, url, request),
    middleware: hono(),
  })
}

export const getOAuthDBAttributes = (
  service: AuthProviderName,
  validateResult: ProviderUserAuth
): DBAttributes => {
  if (service === 'google') {
    const googleResult = validateResult as GoogleUserAuth
    return {
      email: googleResult.googleUser.email || null,
      // email_verified: googleResult.googleUser.email_verified || false,
    }
  }
  if (service === 'apple') {
    const appleResult = validateResult as AppleUserAuth
    return {
      email: appleResult.appleUser.email || null,
      // email_verified: appleResult.appleUser.email_verified || false,
    }
  }
  throw new Error('Unknown auth service: ' + service)
}

export const getUserFromProviderUserAuth = async (
  service: AuthProviderName,
  providerUserAuth: ProviderUserAuth<Auth>
): Promise<User> => {
  const { getExistingUser, createUser } = providerUserAuth

  const existingUser = await getExistingUser()
  if (existingUser) return existingUser

  // TODO if the email is used by another user without oauth, you will wind up with two
  // users with the same email. If you'd rather merge the accounts, you could create
  // a unique index on the email column in the user table and then check for that first
  // and either return an error or automatically link the accounts.
  // See https://lucia-auth.com/guidebook/oauth-account-linking/ for an example on
  // how to automatically link the accounts.
  const user = await createUser({
    attributes: getOAuthDBAttributes(service, providerUserAuth),
  })
  return user
}

export const getOAuthUser = async (
  service: AuthProviderName,
  ctx: ApiContextProps,
  { state, code }: { state: string; code: string }
): Promise<User> => {
  const authService = getAuthProvider(ctx, service)
  const validateResult = await authService.validateCallback(code)
  return getUserFromProviderUserAuth(service, validateResult)
}

export const handleOAuthCallback = async (
  c: HonoContext,
  ctx: ApiContextProps,
  service: string
) => {
  if (!isAuthProviderName(service)) {
    throw new Error(`Unknown auth service: ${service}`)
  }
  const storedState = getCookie(c, `${service}_oauth_state`)
  const storedRedirectUrl = getCookie(c, `${service}_oauth_redirect`)
  const state = c.req.query('state')
  const code = c.req.query('code')
  if (!storedState || !state || storedState !== state || typeof code !== 'string') {
    return c.text('Invalid state', 400)
  }
  try {
    const user = await getOAuthUser(service, ctx, { state, code })
    const session = await createSession(ctx.auth, user.userId)
    ctx.authRequest?.setSession(session)
    const redirectTo = `${storedRedirectUrl ? storedRedirectUrl : ctx.env.APP_URL}#token=${
      session.sessionId
    }`
    return c.redirect(redirectTo, 302)
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return c.text('Invalid code', 400)
    }
    return c.text('Unknown auth error', 500)
  }
}
