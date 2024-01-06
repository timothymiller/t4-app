import { trpcServer } from '@hono/trpc-server'
import { createContext } from '@t4/api/src/context'
import { appRouter } from '@t4/api/src/router'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
  JWT_VERIFICATION_KEY: string
  APP_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Setup CORS for the frontend
app.use('/trpc/*', async (c, next) => {
  if (c.env.APP_URL === undefined) {
    console.log(
      'APP_URL is not set. CORS errors may occur. Make sure the .dev.vars file is present at /packages/api/.dev.vars'
    )
  }
  return await cors({
    origin: (origin) => (origin.endsWith(new URL(c.env.APP_URL).host) ? origin : c.env.APP_URL),
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    // https://hono.dev/middleware/builtin/cors#options
  })(c, next)
})

// Setup TRPC server with context
app.use('/trpc/*', async (c, next) => {
  return await trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      return await createContext(c.env.DB, c.env.JWT_VERIFICATION_KEY, opts)
    },
  })(c, next)
})

export default app
