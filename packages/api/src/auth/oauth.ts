import { ApiContextProps } from '../context'
import { User } from '../db/schema'
import {
  Apple,
  AppleRefreshedTokens,
  AppleTokens,
  Discord,
  DiscordTokens,
  GitHub,
  Google,
  GoogleTokens,
  generateCodeVerifier,
  generateState,
} from 'arctic'
import {
  AuthProvider,
  AuthProviderName,
  AuthTokens,
  isOAuth2ProviderWithPKCE,
  providers,
} from './providers'
import { isWithinExpirationDate } from 'oslo'
import { parseJWT } from 'oslo/jwt'
import { createAuthMethodId, createUser, getAuthMethod, getUserById } from './user'

import { P, match } from 'ts-pattern'
import { getCookie } from 'hono/cookie'
import { TRPCError } from '@trpc/server'
import { getCookieOptions, isCrossDomain } from '.'

export interface AppleIdTokenClaims {
  iss: 'https://appleid.apple.com'
  sub: string
  aud: string
  iat: number
  exp: number
  email?: string
  email_verified?: boolean
  is_private_email?: boolean
  nonce?: string
  nonce_supported?: boolean
  real_user_status: 0 | 1 | 2
  transfer_sub?: string
}

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
        `${origin}/oauth/${name}`
      )
    }
    if (name === 'discord') {
      providers[name] = new Discord(
        ctx.env.DISCORD_CLIENT_ID,
        ctx.env.DISCORD_CLIENT_SECRET,
        `${origin}/oauth/${name}`
      )
    }
    if (name === 'github') {
      providers[name] = new GitHub(ctx.env.GITHUB_CLIENT_ID, ctx.env.GITHUB_CLIENT_SECRET, {
        redirectURI: `${origin}/oauth/${name}`,
      })
    }
    if (name === 'google') {
      providers[name] = new Google(
        ctx.env.GOOGLE_CLIENT_ID,
        ctx.env.GOOGLE_CLIENT_SECRET,
        `${origin}/oauth/${name}`
      )
    }
  }
  const service = providers[name]
  if (service === null) {
    throw new Error(`Unable to configure oauth for ${name}`)
  }
  return service
}

export function getAppleClaims(idToken?: string): AppleIdTokenClaims | undefined {
  if (!idToken) return undefined
  const payload = parseJWT(idToken)?.payload
  return payload &&
    'iss' in payload &&
    payload.iss === 'https://appleid.apple.com' &&
    'sub' in payload &&
    'aud' in payload &&
    'iat' in payload &&
    'exp' in payload
    ? (payload as AppleIdTokenClaims)
    : undefined
}

export const getAuthorizationUrl = async (ctx: ApiContextProps, service: AuthProviderName) => {
  const provider = getAuthProvider(ctx, service)
  const secure = ctx.req?.url.startsWith('https:') ? 'Secure; ' : ''
  const state = generateState()
  ctx.setCookie(`${service}_oauth_state=${state}; Path=/; ${getCookieOptions(ctx)} Max-Age=600`)
  return await match({ provider, service })
    .with({ service: 'google', provider: P.instanceOf(Google) }, async ({ provider }) => {
      // Google requires PKCE
      const codeVerifier = generateCodeVerifier()
      ctx.setCookie(
        `${service}_oauth_verifier=${codeVerifier}; Path=/; ${getCookieOptions(ctx)} Max-Age=600`
      )
      const url = await provider.createAuthorizationURL(state, codeVerifier, {
        scopes: ['https://www.googleapis.com/auth/userinfo.email'],
      })
      // Uncomment if you need to get and store a refresh token
      // Currently, OAuth is only used for the initial sign in
      // so we don't need to persist the access or refresh tokens
      // url.searchParams.set('access_type', 'offline')
      return url
    })
    .with({ service: 'apple', provider: P.instanceOf(Apple) }, async ({ provider }) => {
      const url = await provider.createAuthorizationURL(state, { scopes: ['email'] })
      url.searchParams.set('response_mode', 'form_post')
      return url
    })
    .with({ service: 'discord', provider: P.instanceOf(Discord) }, async ({ provider }) => {
      return await provider.createAuthorizationURL(state)
    })
    .with({ service: 'github', provider: P.instanceOf(GitHub) }, async ({ provider }) => {
      return await provider.createAuthorizationURL(state, { scopes: ['email'] })
    })
    .otherwise(() => {
      throw new Error('Unknown auth provider')
    })
}

const checkAuthTokens = async (tokens: Partial<AuthTokens>, authProvider: AuthProvider) => {
  let accessToken: string | undefined = tokens.accessToken
  let accessTokenExpiresAt: Date | undefined
  let refreshToken: string | null | undefined
  let idTokenClaims: AppleIdTokenClaims | undefined

  if ('idToken' in tokens && authProvider instanceof Apple) {
    idTokenClaims = getAppleClaims(tokens.idToken)
  }
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
        if (refreshedTokens && 'idToken' in refreshedTokens) {
          idTokenClaims = getAppleClaims((refreshedTokens as AppleRefreshedTokens).idToken)
        }
      }
    }
    if (!accessTokenExpiresAt || !isWithinExpirationDate(accessTokenExpiresAt)) {
      throw new Error('Access token is expired')
    }
  }
  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    idTokenClaims,
  }
}

type GetOAuthUserResult = {
  attributes: Partial<User>
  providerUserId: string
  authMethodId: string
}

// https://arctic.pages.dev/providers/apple
export async function getAppleUser({
  idTokenClaims,
}: { idTokenClaims: AppleIdTokenClaims }): Promise<GetOAuthUserResult> {
  return {
    attributes: {
      email: idTokenClaims?.email || undefined,
    },
    providerUserId: idTokenClaims.sub,
    authMethodId: createAuthMethodId('apple', idTokenClaims.sub),
  }
}

// https://arctic.pages.dev/providers/discord
// https://discord.com/developers/docs/resources/user#user-object
export async function getDiscordUser({
  accessToken,
}: { accessToken: string }): Promise<GetOAuthUserResult> {
  const res = await (
    await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  ).json<{ email: string; id: string }>()
  return {
    attributes: {
      email: res.email,
    },
    authMethodId: res.id,
    providerUserId: createAuthMethodId('discord', res.id),
  }
}

export async function getGitHubUser({
  accessToken,
}: { accessToken: string }): Promise<GetOAuthUserResult> {
  const user = await (
    await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  ).json<{ id: string; email: string }>()
  const emails = await (
    await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  ).json<{ primary: boolean; email: string }[]>()
  const primaryEmail = emails.find((e: { primary: boolean }) => e.primary)?.email
  return {
    attributes: {
      email: user.email || primaryEmail,
    },
    providerUserId: user.id,
    authMethodId: createAuthMethodId('github', user.id),
  }
}

export async function getGoogleUser({
  accessToken,
}: { accessToken: string }): Promise<GetOAuthUserResult> {
  const res = await (
    await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  ).json<{ email: string; sub: string }>()
  return {
    attributes: {
      email: res.email || undefined,
    },
    providerUserId: res.sub,
    authMethodId: createAuthMethodId('google', res.sub),
  }
}

export const getUserFromAuthProvider = async <_AuthTokens extends AuthTokens>(
  ctx: ApiContextProps,
  service: AuthProviderName,
  authProvider: AuthProvider,
  tokens: Partial<_AuthTokens>,
  userData: Partial<User> = {}
): Promise<User> => {
  const { accessToken, idTokenClaims } = await checkAuthTokens(tokens, authProvider)
  const { authMethodId, providerUserId, attributes } = await match({
    authProvider,
    accessToken,
    idTokenClaims,
  })
    .with({ authProvider: P.instanceOf(Apple), idTokenClaims: P.nullish }, async () => {
      throw new Error('Apple idToken is required')
    })
    .with({ authProvider: P.instanceOf(Apple), idTokenClaims: { sub: P.nullish } }, async () => {
      throw new Error('Missing subject in Apple idToken')
    })
    .with({ authProvider: P.instanceOf(Apple), idTokenClaims: P.not(P.nullish) }, getAppleUser)
    .with({ accessToken: P.nullish }, async () => {
      throw new Error('Access token is required')
    })
    .with({ authProvider: P.instanceOf(Discord), accessToken: P.not(P.nullish) }, getDiscordUser)
    .with({ authProvider: P.instanceOf(GitHub), accessToken: P.not(P.nullish) }, getGitHubUser)
    .with({ authProvider: P.instanceOf(Google), accessToken: P.not(P.nullish) }, getGoogleUser)
    .otherwise(() => {
      throw new Error('Unknown auth provider')
    })

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
  const user = await createUser(ctx, service, providerUserId, null, {
    ...attributes,
    ...userData,
  })
  return user
}

export const getOAuthUser = async (
  service: AuthProviderName,
  ctx: ApiContextProps,
  { code, userData }: { code: string; userData?: Partial<User> }
): Promise<User> => {
  const authService = getAuthProvider(ctx, service)
  if (isOAuth2ProviderWithPKCE(authService)) {
    if (!ctx.c) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Missing context' })
    const codeVerifier = getCookie(ctx.c, `${service}_oauth_verifier`)
    if (!codeVerifier)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Missing code verifier' })
    const validateResult = await authService.validateAuthorizationCode(code, codeVerifier)
    return getUserFromAuthProvider(ctx, service, authService, validateResult, userData)
  }
  const validateResult = await authService.validateAuthorizationCode(code)
  return getUserFromAuthProvider(ctx, service, authService, validateResult)
}
