import { Adapter, DatabaseSessionAttributes, DatabaseUserAttributes, Lucia, TimeSpan } from 'lucia'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { SessionTable, UserTable } from '../db/schema'
import { DB } from '../db/client'
import type { ApiContextProps } from '../context'

/**
 * Lucia's isValidRequestOrigin method will compare the
 * origin of the request to the configured host.
 * We want to allow cross-domain requests from our APP_URL so return that
 * if the request origin host matches the APP_URL host.
 * @link https://github.com/lucia-auth/lucia/blob/main/packages/lucia/src/utils/url.ts
 */
export const getAllowedOriginHost = (app_url: string, request?: Request) => {
  if (!app_url || !request) return undefined
  const requestOrigin = request.headers.get('Origin')
  const requestHost = requestOrigin ? new URL(requestOrigin).host : undefined
  const appHost = new URL(app_url).host
  return requestHost === appHost ? appHost : undefined
}

export const isCrossDomain = (appUrl?: string, apiUrl?: string) => {
  if (!appUrl || !apiUrl) return true
  const appHost = new URL(appUrl).host
  const apiHost = new URL(apiUrl).host
  return !apiHost.endsWith(appHost)
}

export function getCookieOptions(ctx: ApiContextProps) {
  return isCrossDomain(ctx.env.APP_URL, ctx.env.PUBLIC_API_URL)
    ? 'HttpOnly; SameSite=None; Secure;'
    : 'HttpOnly; SameSite=Lax; Secure;'
}

export const createAuth = (db: DB, appUrl: string, apiUrl: string) => {
  // @ts-ignore Expect type errors because this is D1 and not SQLite... but it works
  const adapter = new DrizzleSQLiteAdapter(db, SessionTable, UserTable)
  // cast probably only needed until adapter-drizzle is updated
  // @ts-ignore the "none" option for sameSite works... but https://github.com/lucia-auth/lucia/issues/1320
  return new Lucia(adapter as Adapter, {
    ...getAuthOptions(appUrl, apiUrl),
  })
}

export const getAuthOptions = (appUrl: string, apiUrl: string) => {
  return {
    getUserAttributes: (data: DatabaseUserAttributes) => {
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
        secure: true,
        // This might not work forever https://github.com/lucia-auth/lucia/issues/1320
        sameSite: isCrossDomain(appUrl, apiUrl) ? ('none' as const) : ('lax' as const),
      },
    },

    // If you want more debugging, uncomment this
    // experimental: {
    //   debugMode: true,
    // },
  }
}

declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof createAuth>
  }
  interface DatabaseSessionAttributes {}
  interface DatabaseUserAttributes {
    email: string | null
  }
}
