import { ApiContextProps } from '../context'
import { User } from '../db/schema'
import {
  Apple,
  AppleIdTokenClaims,
  AppleTokens,
  Discord,
  DiscordTokens,
  GitHub,
  GitHubTokens,
  Google,
  GoogleTokens,
} from 'arctic'
import type { HonoRequest } from 'hono'
import { DatabaseSessionAttributes, DatabaseUserAttributes, TimeSpan } from 'lucia'
import { AuthProvider, AuthProviderName, AuthTokens, providers } from './providers'
import { isWithinExpirationDate } from 'oslo'
import { createAuthMethodId, createUser, getAuthMethod, getUserById } from './user'
import type { HonoLucia } from './hono'

export const getAuthProvider = (ctx: ApiContextProps, name: AuthProviderName): AuthProvider => {
  const origin = ctx.env.APP_URL ? new URL(ctx.env.APP_URL).origin : ''
  if (!providers[name]) {
    if (name === 'apple') {
      providers[name] = new Apple(
        {
          clientId: ctx.env.APPLE_CLIENT_ID,
          certificate: ctx.env.APPLE_CERTIFICATE,
          keyId: ctx.env.APPLE_KEY_ID,
          teamId: ctx.env.APPLE_TEAM_ID,
        },
        `${origin}/oauth/${name}`,
        {
          responseMode: 'form_post',
          scope: ['email'],
        }
      )
    }
    if (name === 'discord') {
      providers[name] = new Discord(
        ctx.env.DISCORD_CLIENT_ID,
        ctx.env.DISCORD_CLIENT_SECRET,
        `${origin}/oauth/${name}`,
        {
          scope: ['email'],
        }
      )
    }
    if (name === 'github') {
      providers[name] = new GitHub(ctx.env.GITHUB_CLIENT_ID, ctx.env.GITHUB_CLIENT_SECRET, {
        redirectURI: `${origin}/oauth/${name}`,
        scope: ['email'],
      })
    }
    if (name === 'google') {
      providers[name] = new Google(
        ctx.env.GOOGLE_CLIENT_ID,
        ctx.env.GOOGLE_CLIENT_SECRET,
        `${origin}/oauth/${name}`,
        {
          scope: ['https://www.googleapis.com/auth/userinfo.email'],
        }
      )
    }
  }
  const service = providers[name]
  if (service === null) {
    throw new Error(`Unable to configure oauth for ${name}`)
  }
  return service
}

/**
 * Lucia's isValidRequestOrigin method will compare the
 * origin of the request to the configured host.
 * We want to allow cross-domain requests from our APP_URL so return that
 * if the request origin host matches the APP_URL host.
 * @link https://github.com/lucia-auth/lucia/blob/main/packages/lucia/src/utils/url.ts
 */
export const getAllowedOriginHost = (app_url: string, request?: HonoRequest) => {
  if (!app_url || !request) return undefined
  const requestOrigin = request.header('Origin')
  const requestHost = requestOrigin ? new URL(requestOrigin).host : undefined
  const appHost = new URL(app_url).host
  return requestHost === appHost ? appHost : undefined
}

export const getAuthOptions = (db: D1Database, appUrl: string, request?: HonoRequest) => {
  const env = !appUrl || appUrl.startsWith('http:') ? 'DEV' : 'PROD'
  const allowedHost = getAllowedOriginHost(appUrl, request)
  return {
    // Lucia's d1 adapter makes queries for sessions and users directly from the database
    // Does drizzle provide a constructor we could use here to automatically perform the transforms?
    getUserAttributes: (data: DatabaseUserAttributes) => {
      if ('attributes' in data) {
        // biome-ignore lint/style/noParameterAssign: this will be fixed in the next lucia v3 beta
        data = data.attributes as DatabaseUserAttributes
      }
      return {
        email: data.email || '',
      }
    },
    // Optional additional session attributes to expose
    // If updated, also update createSession() in packages/api/src/auth/user.ts
    getSessionAttributes: (databaseSession: DatabaseSessionAttributes) => {
      return {}
    },
    sessionExpiresIn: new TimeSpan(365, 'd'),
    sessionCookie: {
      name: 'auth_session',
      expires: false,
      attributes: {
        secure: env === 'PROD',
        sameSite: 'lax' as const,
      },
    },

    // https://lucia-auth.com/basics/configuration/#csrfprotection
    csrfProtection: {
      allowedSubDomains: '*',
      allowedDomains: allowedHost ? [allowedHost] : undefined,
    },

    // If you want more debugging, uncomment this
    // experimental: {
    //   debugMode: true,
    // },
  }
}

export const getUserFromAuthProvider = async <_AuthTokens extends AuthTokens>(
  ctx: ApiContextProps,
  service: AuthProviderName,
  authProvider: AuthProvider,
  tokens: Partial<_AuthTokens>
): Promise<User> => {
  // ts-pattern would make this a little cleaner
  let accessToken: string | undefined = tokens.accessToken
  let accessTokenExpiresAt: Date | undefined
  let refreshToken: string | null | undefined
  let idTokenClaims: AppleIdTokenClaims | undefined
  const isApple = authProvider instanceof Apple

  if ('refreshToken' in tokens) {
    refreshToken = (tokens as Partial<AppleTokens | GoogleTokens | DiscordTokens>).refreshToken
  }
  if ('accessTokenExpiresAt' in tokens) {
    accessTokenExpiresAt = (tokens as Partial<AppleTokens | GoogleTokens | DiscordTokens>)
      .accessTokenExpiresAt
    if (!accessTokenExpiresAt || !isWithinExpirationDate(accessTokenExpiresAt)) {
      if (refreshToken && 'refreshAccessToken' in authProvider) {
        const refreshedTokens = await authProvider.refreshAccessToken(refreshToken)
        if (refreshedTokens?.accessToken) {
          accessToken = refreshedTokens.accessToken
        }
        if (refreshedTokens?.accessTokenExpiresAt) {
          accessTokenExpiresAt = refreshedTokens.accessTokenExpiresAt
        }
        if (refreshedTokens as Partial<AppleTokens>) {
          idTokenClaims = (refreshedTokens as Partial<AppleTokens>).idTokenClaims
        }
      }
    }
    if (!accessTokenExpiresAt || !isWithinExpirationDate(accessTokenExpiresAt)) {
      throw new Error('Access token is expired')
    }
  }
  if (isApple) {
    idTokenClaims = (tokens as Partial<AppleTokens>).idTokenClaims
    if (!idTokenClaims) {
      throw new Error('Apple idToken is required')
    }
  }

  let attributes: Partial<User> = {}
  let providerUserId: string | undefined
  let authMethodId: string | undefined
  if (isApple) {
    attributes = {
      email: idTokenClaims?.email || undefined,
    }
    providerUserId = idTokenClaims?.sub
    if (!providerUserId) {
      throw new Error('Missing subject in Apple idToken')
    }
    authMethodId = createAuthMethodId('apple', providerUserId)
  } else {
    if (!accessToken) {
      throw new Error('Access token is required')
    }
    if (authProvider instanceof Discord) {
      const discordUser = await authProvider.getUser(accessToken)
      providerUserId = discordUser.id
      authMethodId = createAuthMethodId('discord', providerUserId)
      attributes = {
        email: discordUser.email || undefined,
      }
    }
    if (authProvider instanceof GitHub) {
      const githubUser = await (authProvider as GitHub).getUser(accessToken)
      providerUserId = githubUser.id.toString()
      authMethodId = createAuthMethodId('github', providerUserId)
      attributes = {
        email: githubUser.email || undefined,
      }
    }
    if (authProvider instanceof Google) {
      const googleUser = await authProvider.getUser(accessToken)
      providerUserId = googleUser.sub
      authMethodId = createAuthMethodId('google', googleUser.sub)
      attributes = {
        email: googleUser.email,
      }
    }
  }
  if (!authMethodId || !providerUserId) {
    throw new Error('Unknown auth provider')
  }
  const existingAuthMethod = await getAuthMethod(ctx, authMethodId)
  if (existingAuthMethod) {
    const existingUser = await getUserById(ctx, existingAuthMethod.userId)
    if (existingUser) {
      return existingUser
    }
  }

  // TODO if the email is used by another user without oauth, you will wind up with two
  // users with the same email. If you'd rather merge the accounts, you could create
  // a unique index on the email column in the user table and then check for that first
  // and either return an error or automatically link the accounts.
  // See https://lucia-auth.com/guidebook/oauth-account-linking/ for an example on
  // how to automatically link the accounts.
  const user = await createUser(ctx, service, providerUserId, null, attributes)
  return user
}

export const getOAuthUser = async (
  service: AuthProviderName,
  ctx: ApiContextProps,
  { code }: { code: string }
): Promise<User> => {
  const authService = getAuthProvider(ctx, service)
  const validateResult = await authService.validateAuthorizationCode(code)
  return getUserFromAuthProvider(ctx, service, authService, validateResult)
}

declare module 'lucia' {
  interface Register {
    Lucia: HonoLucia
    DatabaseUserAttributes: {
      email: string | null
    }
    // biome-ignore lint/complexity/noBannedTypes: Need to define this even if empty
    DatabaseSessionAttributes: {}
  }
}
