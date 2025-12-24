import { pgTable, text, timestamp, integer, boolean, json, decimal, index, pgEnum, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

// ===========================================================================
// ENUMS
// ===========================================================================

export const tierType = pgEnum("TierType", ["FREE", "PERSONAL", "PRO", "ENTERPRISE"])

export const subscriptionStatus = pgEnum("SubscriptionStatus", [
  "active",
  "canceled",
  "past_due",
  "trialing",
  "incomplete",
  "incomplete_expired",
  "unpaid",
  "paused",
])

export const flagStrategy = pgEnum("FlagStrategy", ["global", "percentage", "targeted", "ab_test", "time_based"])

export const providerType = pgEnum("ProviderType", ["llm", "whatsapp", "voice", "storage", "embedding", "other"])

export const serviceType = pgEnum("ServiceType", ["CHATBOT", "WHATSAPP", "VOICE"])

export const billingUsageType = pgEnum("BillingUsageType", [
  "TOKEN_PROMPT",
  "TOKEN_COMPLETION",
  "MESSAGE_SENT",
  "CONVERSATION_WINDOW",
  "VOICE_MINUTE",
])

// ===========================================================================
// USERS (Auth)
// ===========================================================================

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("founder").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 }).defaultNow(),
})

// ===========================================================================
// SUBSCRIPTION PLANS & SUBSCRIPTIONS
// NOTE: These tables are stored in MAIN DB, not founder DB
// They are defined in the "MAIN SYSTEM TABLES" section below
// ===========================================================================

// ===========================================================================
// FEATURE FLAGS
// ===========================================================================

export const featureFlags = pgTable(
  "feature_flags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    key: text("key").unique().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    strategy: flagStrategy("strategy").notNull().default("global"),
    value: json("value")
      .$type<{
        enabled?: boolean
        percentage?: number
        variants?: Array<{ name: string; allocation: number }>
        targetAccounts?: string[]
        targetUsers?: string[]
        targetTiers?: string[]
        enableDate?: string
      }>()
      .notNull()
      .default({}),
    rules: json("rules")
      .$type<{
        accountIds?: string[]
        userEmails?: string[]
        domains?: string[]
        planTiers?: string[]
        regions?: string[]
        customAttributes?: Record<string, any>
      }>()
      .default({}),
    dependsOn: text("depends_on").array().default(sql`ARRAY[]::text[]`),
    isEnabled: boolean("is_enabled").default(true),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 }).defaultNow(),
  },
  (table) => [
    index("feature_flags_key_idx").on(table.key),
    index("feature_flags_enabled_idx").on(table.isEnabled).where(sql`${table.isEnabled} = true`),
  ],
)

// ===========================================================================
// SERVICE RATES (Pricing Configuration)
// ===========================================================================

export const serviceRates = pgTable(
  "service_rates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    serviceType: serviceType("service_type").notNull(),
    usageType: billingUsageType("usage_type").notNull(),
    ratePerUnit: decimal("rate_per_unit", { precision: 18, scale: 6 }).notNull(),
    currency: text("currency").default("CREDITS").notNull(),
    effectiveFrom: timestamp("effective_from", { withTimezone: true, precision: 6 }).defaultNow(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 }).defaultNow(),
  },
  (table) => [
    index("service_rates_active_idx").on(table.serviceType, table.usageType).where(sql`${table.isActive} = true`),
  ],
)

// ===========================================================================
// MAIN SYSTEM TABLES (for reading from main DB)
// ===========================================================================

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  billingEmail: text("billing_email"),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }),
})

// Subscriptions are also in main DB (not founder DB)
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    accountId: text("account_id").notNull(),
    planId: text("plan_id").notNull(),
    status: subscriptionStatus("status").notNull().default("trialing"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true, precision: 6 }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true, precision: 6 }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    canceledAt: timestamp("canceled_at", { withTimezone: true, precision: 6 }),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    customPricing: json("custom_pricing").$type<{
      monthlyPrice?: number
      annualPrice?: number
      customEntitlements?: Record<string, any>
    }>(),
    trialStart: timestamp("trial_start", { withTimezone: true, precision: 6 }),
    trialEnd: timestamp("trial_end", { withTimezone: true, precision: 6 }),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 }).defaultNow(),
  },
  (table) => [
    index("subscriptions_account_idx").on(table.accountId),
    index("subscriptions_status_idx").on(table.status),
  ],
)

// Subscription plans are also in main DB
export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    planId: text("plan_id")
      .primaryKey()
      .$defaultFn(() => createId()),
    planName: text("plan_name").notNull(),
    tierType: tierType("tier_type"),
    description: text("description"),
    isActive: boolean("is_active").default(true),
    durationInDays: integer("duration_in_days"),
    priceMonthly: decimal("price_monthly", { precision: 10, scale: 2 }).notNull(),
    priceAnnually: decimal("price_annually", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").default("usd"),
    stripeProductId: text("stripe_product_id"),
    stripePriceIdMonthly: text("stripe_price_id_monthly"),
    stripePriceIdAnnual: text("stripe_price_id_annual"),
    entitlements: json("entitlements").$type<{
      maxChatbots?: number
      maxUsers?: number
      allowWhatsApp?: boolean
      whatsappLimit?: "META_FREE" | "META_PAID" | "UNLIMITED"
      allowVoice?: boolean
      voiceMinutesPerMonth?: number
      allowCustomBranding?: boolean
      allowAPI?: boolean
      apiRateLimit?: number
      allowWebhooks?: boolean
      maxDataSources?: number
      maxStorageGB?: number
      prioritySupport?: boolean
      sla?: "NONE" | "STANDARD" | "PREMIUM"
    }>(),
    usageBasedPricing: json("usage_based_pricing").$type<{
      enabled: boolean
      meters: Array<{
        name: string
        unitPrice: number
        includedUnits?: number
      }>
    }>(),
    isPublic: boolean("is_public").default(true),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 }).defaultNow(),
  },
  (table) => [
    index("subscription_plans_active_idx").on(table.isActive).where(sql`${table.isActive} = true`),
    index("subscription_plans_tier_idx").on(table.tierType),
  ],
)

export const accountWallets = pgTable("account_wallets", {
  accountId: text("account_id").primaryKey(),
  balance: decimal("balance", { precision: 18, scale: 6 }).default("0"),
  currency: text("currency").default("CREDITS"),
})

export const serviceBudgets = pgTable("service_budgets", {
  accountId: text("account_id").notNull(),
  serviceType: serviceType("service_type").notNull(),
  balance: decimal("balance", { precision: 18, scale: 6 }).default("0"),
})

export const chatBots = pgTable("chat_bots", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }),
})

export const accountMembers = pgTable("account_members", {
  accountId: text("account_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }),
})

export const creditTransactions = pgTable("credit_transactions", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  serviceType: serviceType("service_type").notNull(),
  amount: decimal("amount", { precision: 18, scale: 6 }).notNull(),
  providerCost: decimal("provider_cost", { precision: 10, scale: 6 }),
  providerName: text("provider_name"),
  providerType: providerType("provider_type"),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }),
})

// ===========================================================================
// PROVIDER COSTS
// ===========================================================================

export const providerCosts = pgTable(
  "provider_costs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    transactionId: text("transaction_id"),
    accountId: text("account_id").notNull(),
    provider: text("provider").notNull(),
    providerType: providerType("provider_type").notNull(),
    costAmount: decimal("cost_amount", { precision: 10, scale: 6 }).notNull(),
    currency: text("currency").default("usd"),
    usageUnits: decimal("usage_units", { precision: 10, scale: 2 }),
    usageType: text("usage_type"),
    metadata: json("metadata")
      .$type<{
        model?: string
        chatbotId?: string
        userId?: string
        requestId?: string
        region?: string
      }>()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow(),
  },
  (table) => [
    index("provider_costs_account_idx").on(table.accountId, table.createdAt.desc()),
    index("provider_costs_provider_idx").on(table.provider, table.createdAt.desc()),
  ],
)

// ===========================================================================
// PLATFORM METRICS
// ===========================================================================

export const platformMetrics = pgTable(
  "platform_metrics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    date: date("date").unique().notNull(),
    totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
    mrr: decimal("mrr", { precision: 10, scale: 2 }).default("0"),
    arr: decimal("arr", { precision: 10, scale: 2 }).default("0"),
    totalProviderCost: decimal("total_provider_cost", { precision: 10, scale: 2 }).default("0"),
    grossMargin: decimal("gross_margin", { precision: 5, scale: 2 }).default("0"),
    activeAccounts: integer("active_accounts").default(0),
    newAccounts: integer("new_accounts").default(0),
    churnedAccounts: integer("churned_accounts").default(0),
    activeChatbots: integer("active_chatbots").default(0),
    totalApiRequests: integer("total_api_requests").default(0),
    totalMessages: integer("total_messages").default(0),
    totalVoiceMinutes: decimal("total_voice_minutes", { precision: 10, scale: 2 }).default("0"),
    errorRate: decimal("error_rate", { precision: 5, scale: 2 }).default("0"),
    averageResponseTime: integer("average_response_time").default(0),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow(),
  },
  (table) => [index("platform_metrics_date_idx").on(table.date.desc())],
)

// ===========================================================================
// AUDIT LOGS
// ===========================================================================

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id"),
    accountId: text("account_id"),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id"),
    changes: json("changes")
      .$type<{
        before?: Record<string, any>
        after?: Record<string, any>
        fields?: string[]
      }>()
      .default({}),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: json("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 }).defaultNow(),
  },
  (table) => [
    index("audit_logs_user_idx").on(table.userId, table.createdAt.desc()),
    index("audit_logs_account_idx").on(table.accountId, table.createdAt.desc()),
    index("audit_logs_resource_idx").on(table.resourceType, table.resourceId),
  ],
)
