import { type inferAsyncReturnType } from '@trpc/server'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { createDb } from './db/client'
import { Context as HonoContext } from 'hono'
import { SessionContainer } from 'supertokens-node/recipe/session'
interface ApiContextProps {
  session?: SessionContainer
  db: DrizzleD1Database
}

export const createContext = async (c: HonoContext, d1: D1Database): Promise<ApiContextProps> => {
  const db = createDb(d1)
  const session = c.req.session
  return { session, db }
}

export type Context = inferAsyncReturnType<typeof createContext>
