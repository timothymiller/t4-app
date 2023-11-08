import * as dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'
dotenv.config({ path: './.dev.vars' })

const DATABASE_ID = process.env.DATABASE_ID
if (DATABASE_ID === undefined) {
  throw new Error('DATABASE_ID is undefined')
}

export default {
  driver: 'better-sqlite',
  dbCredentials: {
    url: `./.wrangler/state/v3/d1/${DATABASE_ID}/db.sqlite`,
  },
  schema: './src/db/schema.ts',
  out: './migrations',
} satisfies Config
