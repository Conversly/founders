import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Founder Platform Database (for founder platform tables)
const founderUrl = process.env.FOUNDER_DATABASE_URL || process.env.DATABASE_URL;
if (!founderUrl) {
  throw new Error("FOUNDER_DATABASE_URL or DATABASE_URL environment variable is not set")
}

const founderSql = neon(founderUrl)
export const founderDb = drizzle(founderSql)

// Main System Database (for accounts, subscriptions, transactions, etc.)
const mainUrl = process.env.MAIN_DATABASE_URL || process.env.DATABASE_URL;
if (!mainUrl) {
  throw new Error("MAIN_DATABASE_URL or DATABASE_URL environment variable is not set")
}

const mainSql = neon(mainUrl)
export const mainDb = drizzle(mainSql)

// Export default as founder DB for backward compatibility
export const db = founderDb
