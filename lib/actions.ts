'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { founderDb, mainDb } from '@/lib/db';
import { accounts, chatBots, accountMembers, creditTransactions, auditLogs } from '@/lib/db/verly-schema';
import { subscriptions, subscriptionPlans } from '@/lib/db/verly-schema';
import { eq, sql, desc, sum, count, gte, and, inArray } from 'drizzle-orm';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function getAccounts() {
    try {
        // 1. Fetch all accounts from mainDb
        const allAccounts = await mainDb.select().from(accounts).orderBy(desc(accounts.createdAt));

        if (allAccounts.length === 0) {
            return [];
        }

        const accountIds = allAccounts.map(a => a.id);

        // 2. Fetch subscriptions from mainDb (subscriptions are in main system DB)
        const accSubscriptions = await mainDb
            .select({
                accountId: subscriptions.accountId,
                status: subscriptions.status,
                planName: subscriptionPlans.planName,
                priceMonthly: subscriptionPlans.priceMonthly,
            })
            .from(subscriptions)
            .leftJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.planId))
            .where(inArray(subscriptions.accountId, accountIds));

        // 3. Fetch usage stats from mainDb
        const chatbotsCount = await mainDb
            .select({
                accountId: chatBots.accountId,
                count: sql<number>`count(*)`.mapWith(Number),
            })
            .from(chatBots)
            .groupBy(chatBots.accountId)
            .where(inArray(chatBots.accountId, accountIds));

        const usersCount = await mainDb
            .select({
                accountId: accountMembers.accountId,
                count: sql<number>`count(*)`.mapWith(Number),
            })
            .from(accountMembers)
            .groupBy(accountMembers.accountId)
            .where(inArray(accountMembers.accountId, accountIds));


        // 4. Merge data
        const subscriptionMap = new Map(accSubscriptions.map(s => [s.accountId, s]));
        const chatbotsMap = new Map(chatbotsCount.map(c => [c.accountId, c.count]));
        const usersMap = new Map(usersCount.map(u => [u.accountId, u.count]));

        return allAccounts.map(acc => {
            const sub = subscriptionMap.get(acc.id);
            return {
                id: acc.id,
                name: acc.name,
                email: acc.billingEmail || "N/A",
                plan: sub?.planName || "Free",
                status: sub?.status || "no_subscription",
                mrr: sub?.priceMonthly ? parseFloat(sub.priceMonthly) : 0,
                chatbots: chatbotsMap.get(acc.id) || 0,
                users: usersMap.get(acc.id) || 0,
                createdAt: acc.createdAt ? acc.createdAt.toISOString() : new Date().toISOString(),
            };
        });

    } catch (error) {
        console.error("Error fetching accounts:", error);
        return [];
    }
}

export async function getDashboardMetrics() {
    try {
        // 1. MRR & Active Accounts (from mainDb subscriptions - subscriptions are in main system DB)
        const activeSubs = await mainDb
            .select({
                priceMonthly: subscriptionPlans.priceMonthly,
            })
            .from(subscriptions)
            .innerJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.planId))
            .where(eq(subscriptions.status, 'active'));

        const mrr = activeSubs.reduce((sum, sub) => sum + (sub.priceMonthly ? parseFloat(String(sub.priceMonthly)) : 0), 0);
        const activeAccounts = activeSubs.length;

        // 2. Provider Costs (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const costs = await mainDb
            .select({
                totalCost: sql<number>`COALESCE(SUM(${creditTransactions.providerCost}::numeric), 0)`.mapWith(Number),
            })
            .from(creditTransactions)
            .where(
                and(
                    gte(creditTransactions.createdAt, thirtyDaysAgo),
                    sql`${creditTransactions.providerCost} IS NOT NULL`
                )
            );

        const totalProviderCost = costs[0]?.totalCost || 0;

        return {
            metrics: {
                mrr,
                totalProviderCost,
                activeAccounts,
                mrrChange: 0, // Todo: Implement historical comparison
                costChange: 0,
                accountsChange: 0,
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return { metrics: null };
    }
}

export async function getRecentActivity() {
    // Fetch recent audit logs or account creations
    try {
        const recentLogs = await mainDb
            .select({
                id: auditLogs.id,
                action: auditLogs.action,
                resourceType: auditLogs.resourceType,
                resourceId: auditLogs.resourceId,
                accountId: auditLogs.accountId,
                createdAt: auditLogs.createdAt,
                details: auditLogs.details,
            })
            .from(auditLogs)
            .orderBy(desc(auditLogs.createdAt))
            .limit(10);

        // Format activity items
        const activities = await Promise.all(
            recentLogs.map(async (log) => {
                let description = log.action;
                let accountName = "Unknown";

                if (log.accountId) {
                    const [account] = await mainDb
                        .select({ name: accounts.name })
                        .from(accounts)
                        .where(eq(accounts.id, log.accountId))
                        .limit(1);
                    accountName = account?.name || "Unknown";
                }

                // Format based on action type
                if (log.action === "ACCOUNT_CREATED") {
                    description = `New account created`;
                } else if (log.action === "SUBSCRIPTION_CREATED" || log.action === "SUBSCRIPTION_UPDATED") {
                    const planName = (log.details as any)?.planName || "plan";
                    description = `Plan ${log.action === "SUBSCRIPTION_CREATED" ? "subscribed" : "upgraded"} to ${planName}`;
                } else if (log.action === "SUBSCRIPTION_CANCELED") {
                    description = `Subscription canceled`;
                } else if (log.action === "FEATURE_FLAG_UPDATED") {
                    const flagName = (log.details as any)?.flagName || "feature";
                    description = `Feature flag ${flagName} updated`;
                }

                const timeAgo = formatTimeAgo(log.createdAt || new Date());

                return {
                    action: description,
                    account: accountName,
                    time: timeAgo,
                };
            })
        );

        return activities;
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        return [];
    }
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export async function getTopPerformingPlans() {
    try {
        const planStats = await mainDb
            .select({
                planName: subscriptionPlans.planName,
                tierType: subscriptionPlans.tierType,
                priceMonthly: subscriptionPlans.priceMonthly,
                accountCount: sql<number>`COUNT(DISTINCT ${subscriptions.accountId})`.mapWith(Number),
            })
            .from(subscriptions)
            .innerJoin(subscriptionPlans, eq(subscriptions.planId, subscriptionPlans.planId))
            .where(eq(subscriptions.status, "active"))
            .groupBy(subscriptionPlans.planId, subscriptionPlans.planName, subscriptionPlans.tierType, subscriptionPlans.priceMonthly)
            .orderBy(desc(sql<number>`COUNT(DISTINCT ${subscriptions.accountId})`));

        return planStats.map((plan) => ({
            plan: plan.planName || plan.tierType || "Unknown",
            accounts: plan.accountCount,
            revenue: plan.accountCount * parseFloat(String(plan.priceMonthly || 0)),
        }));
    } catch (error) {
        console.error("Error fetching top performing plans:", error);
        return [];
    }
}
