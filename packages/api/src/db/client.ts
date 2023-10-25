import * as schema from './schema'
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1'

export const createDb = (d1: D1Database) => {
  return drizzle(d1, {
    schema,
    // logger: true,
  })
}

export type DB = DrizzleD1Database<typeof schema>
