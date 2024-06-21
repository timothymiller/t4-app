import { defineConfig } from 'drizzle-kit'
import { config as loadEnv } from 'dotenv'

// Load environment variables from .dev.vars
loadEnv({ path: '.dev.vars' })

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  schema: './src/db/schema.ts',
  dbCredentials: {
    accountId: process.env.ACCOUNT_ID || '',
    databaseId: process.env.DATABASE_ID || '',
    token: process.env.TOKEN || '',
  },
  out: './migrations',
  migrations: {
    table: 'migrations',
    //schema: 'public',
  },
  verbose: true,
  strict: true,
})
