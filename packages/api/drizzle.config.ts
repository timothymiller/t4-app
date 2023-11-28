import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: 'wrangler.toml',
    dbName: 'production',
  },
  verbose: false,
  strict: true,
} satisfies Config
