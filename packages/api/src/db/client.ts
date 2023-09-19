import { drizzle } from 'drizzle-orm/d1'
// import { drizzle as drizzleBun, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
// import { Database } from 'bun:sqlite'

export const createDb = (d1: D1Database, isBunTime?: boolean, databaseId?: string) => {
  // if (isBunTime === true) {
  //   const pathSQLite = './.wrangler/state/v3/d1/' + databaseId + '/db.sqlite'
  //   const sqlite = new Database(pathSQLite)
  //   const db: BunSQLiteDatabase = drizzleBun(sqlite)
  //   return db
  // }
  return drizzle(d1)
}
