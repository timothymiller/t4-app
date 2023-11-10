import { defineConfig } from 'drizzle-kit/utils'

export default defineConfig({
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: 'wrangler.toml',
    dbName: 'production',
  },
  schema: './src/db/schema.ts',
  out: './migrations',
  verbose: true,
  strict: true,
})
