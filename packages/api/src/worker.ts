import { trpcServer } from '@hono/trpc-server'
import { createContext } from '@t4/api/src/context'
import { appRouter } from '@t4/api/src/router'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import supertokens from 'supertokens-node'
import { middleware as superTokensMiddleware } from './supertokens/middleware'
import { superTokensConfig } from './supertokens/config'

supertokens.init(superTokensConfig)

type Bindings = {
  DB: D1Database
  APP_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Setup CORS for the frontend
app.use('*', async (c, next) => {
  if (c.env.APP_URL === undefined) {
    console.log('APP_URL is not set. CORS errors may occur.')
  }
  return await cors({
    origin: [c.env.APP_URL],
    credentials: true,
    allowHeaders: ['Content-Type', ...supertokens.getAllCORSHeaders()],
    allowMethods: ['POST', 'GET'],
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
