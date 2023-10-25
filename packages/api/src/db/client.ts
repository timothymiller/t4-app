import * as schema from './schema'
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1'
import { drizzle as drizzleBun, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
// import { Database } from 'bun:sqlite'

export const createDb = (d1: D1Database, isBunTime?: boolean, databaseId?: string) => {
  // if (isBunTime === true) {
  //   const pathSQLite = './.wrangler/state/v3/d1/' + databaseId + '/db.sqlite'
  //   const sqlite = new Database(pathSQLite)
  //   const db: BunSQLiteDatabase = drizzleBun(sqlite, {
  //     schema,
  //     // logger: true,
  //   })
  //   return db
  // }
  return drizzle(d1, {
    schema,
    // logger: true,
  })
}

export type DB = DrizzleD1Database<typeof schema>
// export type DB = BunSQLiteDatabase<typeof schema>
