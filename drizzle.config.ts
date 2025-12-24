import type { Config } from "drizzle-kit"

export default {
  schema: "./lib/db/founder-schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use founder DB for migrations (founder platform tables)
    url: process.env.FOUNDER_DATABASE_URL || process.env.DATABASE_URL!,
  },
} satisfies Config
