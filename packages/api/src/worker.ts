import { Hono } from 'hono'
import { appRouter } from '@t4/api/src/router'
import { cors } from 'hono/cors'
import { createContext } from '@t4/api/src/context'
import { trpcServer } from '@hono/trpc-server'

type Bindings = {
  DB: D1Database
  JWT_VERIFICATION_KEY: string
  APP_URL: string
  // For local development
  IS_BUN_TIME?: boolean
  DATABASE_ID?: string
}

console.log('hello')
const app = new Hono<{ Bindings: Bindings }>()

// Setup CORS for the frontend
app.use('/trpc/*', async (c, next) => {
  if (c.env.APP_URL === undefined) {
    console.log('APP_URL is not set. CORS errors may occur.')
  }
  return await cors({
    origin: [c.env.APP_URL],
    allowMethods: ['POST', 'GET'],
  })(c, next)
})

// Setup TRPC server with context
app.use('/trpc/*', async (c, next) => {
  return await trpcServer({
    router: appRouter,
    createContext: async (opts) => {
      return await createContext(
        c.env.DB,
        c.env.JWT_VERIFICATION_KEY,
        opts,
        c.env.IS_BUN_TIME,
        c.env.DATABASE_ID
      )
    },
  })(c, next)
})

export default app
