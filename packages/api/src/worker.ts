import { Hono, type Context, type Next } from 'hono'
import { appRouter } from '@t4/api/src/router'
import { cors } from 'hono/cors'
import { createContext } from '@t4/api/src/context'
import { trpcServer } from '@hono/trpc-server'
import { handleOAuthCallback } from './auth/hono'

// import { trpcServer } from '@hono/trpc-server'

export type Bindings = Env & {
  JWT_VERIFICATION_KEY: string
  APP_URL: string
  // For auth
  APPLE_CLIENT_ID: string
  APPLE_TEAM_ID: string
  APPLE_KEY_ID: string
  APPLE_CERTIFICATE: string
  DISCORD_CLIENT_ID: string
  DISCORD_CLIENT_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  RESEND_API_KEY: string
  NEXT_PUBLIC_SUPPORT_EMAIL: string
  [k: string]: unknown
}

const app = new Hono<{ Bindings: Bindings }>()

const corsHandler = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
  if (c.env.APP_URL === undefined) {
    console.log('APP_URL is not set. CORS errors may occur.')
  }
  return await cors({
    origin: [c.env.APP_URL],
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    // https://hono.dev/middleware/builtin/cors#options
  })(c, next)
}

// Setup CORS for the frontend
app.use('/trpc/*', corsHandler)
app.use('/auth/*', corsHandler)

// Setup TRPC server with context
app.use('/trpc/*', async (c, next) => {
  return await trpcServer({
    router: appRouter,
    createContext: async () => {
      return await createContext(c.env, c)
    },
  })(c, next)
})

// Setup OAuth callbacks
app.use('/auth/callback/:service', async (c, next) => {
  const ctx = await createContext(c.env, c)
  return await handleOAuthCallback(c, ctx, c.req.param('service'))
})

export default app
