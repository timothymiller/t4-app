import { lucia, type Env as LuciaEnv } from 'lucia'
import { d1 } from '@lucia-auth/adapter-sqlite'
import { apple, discord, google } from '@lucia-auth/oauth/providers'
import { ApiContextProps } from '../context'
import { OAuth2ProviderAuth } from '@lucia-auth/oauth'
import { HonoRequest } from 'hono'
import { AuthProviderName, providers } from './providers'
export { isAuthProviderName } from './providers'
export type { AuthProviderName }

export const getAuthProvider = (
  ctx: ApiContextProps,
  name: AuthProviderName
): OAuth2ProviderAuth => {
  if (!providers[name]) {
    if (name === 'apple') {
      providers[name] = apple(ctx.auth, {
        clientId: ctx.env.APPLE_CLIENT_ID,
        certificate: ctx.env.APPLE_CERTIFICATE,
        keyId: ctx.env.APPLE_KEY_ID,
        teamId: ctx.env.APPLE_TEAM_ID,
        responseMode: 'form_post',
        scope: ['email'],
        redirectUri: `${new URL(ctx.req.url).origin}/auth/callback/${name}`,
      })
    }
    if (name === 'discord') {
      providers[name] = discord(ctx.auth, {
        clientId: ctx.env.DISCORD_CLIENT_ID,
        clientSecret: ctx.env.DISCORD_CLIENT_SECRET,
        scope: ['email'],
        redirectUri: `${new URL(ctx.req.url).origin}/auth/callback/${name}`,
      })
    }
    if (name === 'google') {
      providers[name] = google(ctx.auth, {
        clientId: ctx.env.GOOGLE_CLIENT_ID,
        clientSecret: ctx.env.GOOGLE_CLIENT_SECRET,
        scope: ['https://www.googleapis.com/auth/userinfo.email'],
        redirectUri: `${new URL(ctx.req.url).origin}/auth/callback/${name}`,
      })
    }
  }
  const service = providers[name]
  if (service === null) {
    throw new Error('Unable to configure oauth for ' + name)
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

export const getAuthConfig = (db: D1Database, url: string, request?: HonoRequest) => {
  const env: LuciaEnv = !url || url.startsWith('http:') ? 'DEV' : 'PROD'
  return {
    env,
    adapter: d1(db, {
      user: 'User',
      key: 'UserKey',
      session: 'Session',
    }),
    // expose attributes from user to authenticated sessions
    // the data will be straight from the database and not transformed by drizzle
    getUserAttributes: (data: Lucia.DatabaseUserAttributes): { email: string | null } => {
      return {
        email: data.email,
      }
    },
    // Optional additional session attributes to expose
    // If you want to use this, also see createSession() in packages/api/src/auth/user.ts
    // and define DatabaseSessionAttributes
    // getSessionAttributes: (databaseSession: Lucia.DatabaseSessionAttributes) => {
    //   return {
    //     createdAt: databaseSession.created_at
    //   };
    // },
    sessionExpiresIn: {
      activePeriod: 1000 * 60 * 30, // 30 minutes
      idlePeriod: 1e3 * 60 * 60 * 24 * 365, // 365 days
    },
    sessionCookie: {
      expires: false,
    },

    // https://lucia-auth.com/basics/configuration/#csrfprotection
    csrfProtection: {
      allowedSubdomains: '*',
      host: getAllowedOriginHost(url, request),
    },

    // If you want more debugging, uncomment this
    // experimental: {
    //   debugMode: true,
    // },
  }
}

// We don't use this except for the type definition
const dummyAuthForType = lucia(getAuthConfig(undefined as unknown as D1Database, ''))

export type Auth = typeof dummyAuthForType
