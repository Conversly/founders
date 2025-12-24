"use server"

/**
 * API client for fetching data from main system database
 * This connects to the main system to fetch accounts, subscriptions, transactions, etc.
 */

import { mainDb, founderDb } from "./db"
import {
  accounts,
  subscriptions,
  subscriptionPlans,
  creditTransactions,
  serviceRates,
  accountWallets,
  serviceBudgets,
  chatBots,
  accountMembers,
  billingUsageType,
} from "./db/verly-schema"
import { featureFlags } from "./db/founder-schema"
import { eq, and, gte, desc, sql, count, sum } from "drizzle-orm"

// Import main system schema types (these should match z-terminal schema)
// For now, we'll use the founder schema which should be compatible

/**
 * Get all subscription plans
 */
export async function getSubscriptionPlans() {
  try {
    return await mainDb
      .select()
      .from(subscriptionPlans)
      .orderBy(subscriptionPlans.sortOrder, desc(subscriptionPlans.createdAt))
  } catch (error) {
    console.error("Error fetching subscription plans:", error)
    return []
  }
}

/**
 * Get plan by ID (using planId as primary key)
 */
export async function getPlanById(planId: string) {
  try {
    const [plan] = await mainDb
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.planId, planId))
      .limit(1)
    return plan
  } catch (error) {
    console.error("Error fetching plan by ID:", error)
    return null
  }
}


/**
 * Get all accounts with subscription info
 */
export async function getAccounts() {
  try {
    return await mainDb
      .select({
        id: accounts.id,
        name: accounts.name,
        billingEmail: accounts.billingEmail,
        createdAt: accounts.createdAt,
        subscription: subscriptions,
        plan: subscriptionPlans,
      })
      .from(accounts)
      .leftJoin(subscriptions, eq(accounts.id, subscriptions.accountId))
      .leftJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.planId))
      .orderBy(desc(accounts.createdAt))
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return []
  }
}

/**
 * Get account details with stats
 */
export async function getAccountDetails(accountId: string) {
  const [account] = await mainDb
    .select({
      account: accounts,
      subscription: subscriptions,
      plan: subscriptionPlans,
      wallet: accountWallets,
    })
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .leftJoin(subscriptions, eq(accounts.id, subscriptions.accountId))
    .leftJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.planId))
    .leftJoin(accountWallets, eq(accounts.id, accountWallets.accountId))
    .limit(1)

  if (!account) return null

  // Get chatbot count
  const [chatbotCount] = await mainDb
    .select({ count: count() })
    .from(chatBots)
    .where(eq(chatBots.accountId, accountId))

  // Get member count
  const [memberCount] = await mainDb
    .select({ count: count() })
    .from(accountMembers)
    .where(eq(accountMembers.accountId, accountId))

  return {
    ...account,
    chatbotCount: Number(chatbotCount?.count || 0),
    memberCount: Number(memberCount?.count || 0),
  }
}

/**
 * Get service rates (pricing for chatbot, WhatsApp, voice)
 */
export async function getServiceRates() {
  try {
    return await mainDb
      .select()
      .from(serviceRates)
      .where(eq(serviceRates.isActive, true))
      .orderBy(serviceRates.serviceType, desc(serviceRates.effectiveFrom))
  } catch (error) {
    console.error("Error fetching service rates:", error)
    return []
  }
}

/**
 * Get platform metrics
 */
export async function getPlatformMetrics() {
  // Get total revenue (MRR)
  const [mrrResult] = await mainDb
    .select({
      mrr: sql<number>`COALESCE(SUM(
        CASE 
          WHEN ${subscriptions.status} = 'active' THEN 
            CASE 
              WHEN ${subscriptionPlans.priceMonthly} IS NOT NULL THEN ${subscriptionPlans.priceMonthly}::numeric
              ELSE 0
            END
          ELSE 0
        END
      ), 0)`,
    })
    .from(subscriptions)
    .leftJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.planId))

  // Get active accounts count
  const [activeAccountsResult] = await mainDb
    .select({ count: count() })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"))

  // Get total provider costs (from credit transactions)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [costResult] = await mainDb
    .select({
      totalCost: sql<number>`COALESCE(SUM(${creditTransactions.providerCost}::numeric), 0)`,
    })
    .from(creditTransactions)
    .where(gte(creditTransactions.createdAt, thirtyDaysAgo))

  return {
    mrr: Number(mrrResult?.mrr || 0),
    activeAccounts: Number(activeAccountsResult?.count || 0),
    totalProviderCost: Number(costResult?.totalCost || 0),
  }
}

/**
 * Get cost breakdown by provider
 */
export async function getCostBreakdown() {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const results = await mainDb
      .select({
        provider: creditTransactions.providerName,
        providerType: creditTransactions.providerType,
        totalCost: sql<number>`COALESCE(SUM(${creditTransactions.providerCost}::numeric), 0)`.mapWith(Number),
      })
      .from(creditTransactions)
      .where(
        and(
          gte(creditTransactions.createdAt, thirtyDaysAgo),
          sql`${creditTransactions.providerCost} IS NOT NULL`
        )
      )
      .groupBy(creditTransactions.providerName, creditTransactions.providerType)
      .orderBy(desc(sql`COALESCE(SUM(${creditTransactions.providerCost}::numeric), 0)`))

    // Calculate total for percentage calculation
    const total = results.reduce((sum, r) => sum + (r.totalCost || 0), 0)

    return results.map((r) => ({
      provider: r.provider || "Unknown",
      providerType: r.providerType || "other",
      totalCost: r.totalCost || 0,
      percentage: total > 0 ? ((r.totalCost || 0) / total) * 100 : 0,
    }))
  } catch (error) {
    console.error("Error fetching cost breakdown:", error)
    return []
  }
}

/**
 * Get revenue breakdown by tier
 */
export async function getRevenueByTier() {
  try {
    const results = await mainDb
      .select({
        tier: subscriptionPlans.tierType,
        planName: subscriptionPlans.planName,
        revenue: sql<number>`COALESCE(SUM(${subscriptionPlans.priceMonthly}::numeric), 0)`.mapWith(Number),
        accountCount: sql<number>`COUNT(DISTINCT ${subscriptions.accountId})`.mapWith(Number),
      })
      .from(subscriptions)
      .innerJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.planId))
      .where(eq(subscriptions.status, "active"))
      .groupBy(subscriptionPlans.tierType, subscriptionPlans.planName)
      .orderBy(desc(sql`COALESCE(SUM(${subscriptionPlans.priceMonthly}::numeric), 0)`))

    // Calculate total for percentage calculation
    const total = results.reduce((sum, r) => sum + (r.revenue || 0), 0)

    return results.map((r) => ({
      tier: r.tier || "FREE",
      planName: r.planName || r.tier || "Unknown",
      revenue: r.revenue || 0,
      accounts: r.accountCount || 0,
      percentage: total > 0 ? ((r.revenue || 0) / total) * 100 : 0,
    }))
  } catch (error) {
    console.error("Error fetching revenue by tier:", error)
    return []
  }
}

/**
 * Update service rate
 */
export async function updateServiceRate(
  rateId: string,
  data: {
    ratePerUnit?: string
    isActive?: boolean
  }
) {
  try {
    return await mainDb
      .update(serviceRates)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(serviceRates.id, rateId))
  } catch (error) {
    console.error("Error updating service rate:", error)
    throw error
  }
}

/**
 * Create new service rate
 */
export async function createServiceRate(data: {
  serviceType: "CHATBOT" | "WHATSAPP" | "VOICE"
  usageType: "TOKEN_PROMPT" | "TOKEN_COMPLETION" | "WHATSAPP_MESSAGE_OUTBOUND" | "WHATSAPP_CONVERSATION_START" | "VOICE_MINUTE"
  ratePerUnit: string
  currency?: string
}) {
  try {
    // Deactivate old rates for same service/usage type
    await mainDb
      .update(serviceRates)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(serviceRates.serviceType, data.serviceType),
          eq(serviceRates.usageType, data.usageType)
        )
      )

    // Create new rate
    return await mainDb.insert(serviceRates).values({
      ...data,
      currency: data.currency || "CREDITS",
      isActive: true,
    })
  } catch (error) {
    console.error("Error creating service rate:", error)
    throw error
  }
}

/**
 * Get feature flags (from founder DB)
 */
export async function getFeatureFlags() {
  try {
    return await founderDb
      .select()
      .from(featureFlags)
      .orderBy(desc(featureFlags.createdAt))
  } catch (error) {
    console.error("Error fetching feature flags:", error)
    return []
  }
}

/**
 * Update feature flag (in founder DB)
 */
export async function updateFeatureFlag(
  flagId: string,
  data: {
    isEnabled?: boolean
    value?: any
    strategy?: "global" | "percentage" | "targeted" | "ab_test" | "time_based"
  }
) {
  try {
    return await founderDb
      .update(featureFlags)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(featureFlags.id, flagId))
  } catch (error) {
    console.error("Error updating feature flag:", error)
    throw error
  }
}

