import type { Config } from "drizzle-kit";
 
export default {
  driver: "better-sqlite",
  dbCredentials: {
    url: './db.sqlite',
  },
  schema: "./src/db/schema.ts",
  out: "./migrations",
} satisfies Config;