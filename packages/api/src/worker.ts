import { trpcServer } from '@hono/trpc-server'
import { createContext } from '@t4/api/src/context'
import { appRouter } from '@t4/api/src/router'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import supertokens from 'supertokens-node'
import { getSuperTokensConfig } from './supertokens/backendConfig'
import { middleware as superTokensMiddleware } from './supertokens/middleware'

export type Bindings = {
  DB: D1Database
  APP_NAME: string
  APP_URL: string
  SUPERTOKENS_CONNECTION_URI: string
  SUPERTOKENS_API_KEY: string
  API_URL: string
  DISCORD_CLIENT_ID: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', async (c, next) => {
  supertokens.init(getSuperTokensConfig(c.env))
  await next()
})

// Setup CORS for the frontend
app.use('*', async (c, next) => {
  if (c.env.APP_URL === undefined) {
    console.log(
      'APP_URL is not set. CORS errors may occur. Make sure the .dev.vars file is present at /packages/api/.dev.vars'
    )
  }
  return await cors({
    origin: [c.env.APP_URL],
    credentials: true,
    allowHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })(c, next)
})

// Setup SuperTokens middleware for handling auth routes
app.use('*', superTokensMiddleware())

// Setup TRPC server with context
app.use('/trpc/*', async (c, next) => {
  return await trpcServer({
    router: appRouter,
    createContext: async () => {
      return await createContext(c, c.env.DB)
    },
  })(c, next)
})

export default app
