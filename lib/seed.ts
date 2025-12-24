
import { accounts, subscriptions, subscriptionPlans, creditTransactions, serviceRates, chatBots, accountMembers, user } from "@/lib/db/verly-schema";
import { mainDb } from "@/lib/db";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

async function seed() {
    console.log("🌱 Starting seed...");

    // 1. Create Subscription Plans
    const plans = [
        {
            planId: createId(),
            planName: "Free",
            tierType: "FREE" as const,
            priceMonthly: "0",
            priceYearly: "0",
            features: ["Basic Chatbot", "Community Support"],
            maxChatbots: 1,
            maxMembers: 1,
        },
        {
            planId: createId(),
            planName: "Pro",
            tierType: "PRO" as const,
            priceMonthly: "29",
            priceYearly: "290",
            features: ["Advanced Chatbot", "Priority Support", "Whitelabeling"],
            maxChatbots: 5,
            maxMembers: 5,
        },
        {
            planId: createId(),
            planName: "Enterprise",
            tierType: "ENTERPRISE" as const,
            priceMonthly: "99",
            priceYearly: "990",
            features: ["Unlimited Chatbots", "Dedicated Support", "Custom Integrations"],
            maxChatbots: 100,
            maxMembers: 100,
        },
    ];

    for (const plan of plans) {
        await mainDb.insert(subscriptionPlans).values(plan as any).onConflictDoNothing();
    }
    console.log("✅ Plans created");

    // 2. Create Accounts & Subscriptions
    for (let i = 0; i < 10; i++) {
        const accountId = createId();
        const plan = plans[Math.floor(Math.random() * plans.length)];

        await mainDb.insert(accounts).values({
            id: accountId,
            name: `Demo Account ${i + 1}`,
            billingEmail: `demo${i + 1}@example.com`,
        });

        await mainDb.insert(subscriptions).values({
            id: createId(),
            accountId,
            planId: plan.planId,
            status: "active",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        // Create a chatbot for this account
        const chatbotId = createId();
        // We need a dummy user ID since chatbot requires userId
        const userId = createId();
        // Usually user would exist, but strict FK might fail if we don't insert user.
        // However, verly-schema defines userId as text, let's see if we need to insert user first.
        // Given the schema has `foreignKey({ columns: [table.userId], foreignColumns: [user.id] ... })`, yes we do.

        // Check if we need to insert a dummy user
        try {
            await mainDb.insert(user).values({
                id: userId,
                displayName: `User ${i + 1}`,
                email: `user${i + 1}@example.com`
            }).onConflictDoNothing();
        } catch (e) {
            console.log("User creation skipped or failed (might verify if table exists in mainDb context):", e)
        }

        try {
            await mainDb.insert(chatBots).values({
                id: chatbotId,
                accountId,
                userId,
                name: `Bot ${i + 1}`,
                description: "Demo Bot",
                topics: ["support"],
                status: "ACTIVE",
            });

            // 3. Generate Credit Transactions (Usage & Cost)
            const providers = [
                { name: "OpenAI", type: "llm", costRange: [0.01, 0.5] },
                { name: "Anthropic", type: "llm", costRange: [0.01, 0.5] },
                { name: "Twilio", type: "whatsapp", costRange: [0.05, 0.2] },
                { name: "ElevenLabs", type: "voice", costRange: [0.1, 1.0] },
                { name: "AWS S3", type: "storage", costRange: [0.001, 0.05] },
            ];

            for (let j = 0; j < 20; j++) {
                const provider = providers[Math.floor(Math.random() * providers.length)];
                const cost = (Math.random() * (provider.costRange[1] - provider.costRange[0]) + provider.costRange[0]).toFixed(6);

                // Random date in last 30 days
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 30));

                await mainDb.insert(creditTransactions).values({
                    id: createId(),
                    accountId,
                    chatbotId,
                    serviceType: "CHATBOT",
                    amount: "-" + cost, // Usage is negative balance, but cost is positive value in providerCost
                    providerName: provider.name,
                    providerType: provider.type,
                    providerCost: cost,
                    createdAt: date,
                    status: "PROCESSED",
                    description: `Usage for ${provider.name}`,
                });
            }
        } catch (e) {
            console.error("Failed to insert chatbot/transactions:", e);
        }
    }

    console.log("✅ Seed data populated!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
