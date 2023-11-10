import { drizzle } from 'drizzle-orm/d1'

export const createDb = (d1: D1Database) => {
  return drizzle(d1)
}
