import { relations } from 'drizzle-orm';
import {
  user,
  authMethod,
  chatBots,
  dataSources,
  embeddings,
  analytics,
  citations,
  messages,
  widgetConfig,
  chatbotTopics,
  chatbotTopicStats,
  whatsappAccounts,
  contacts,
  channelAccounts,
  smsAccounts,
  emailAccounts,
  templates,
  campaigns,
  campaignAudience,
  originDomains,
  subscriptionPlans,
  subscriptions,
  subscribedUsers,
  analyticsPerDay,
  productLaunches,
  voiceConfig,
  voiceWidgetConfig,
  voiceCallSession,
  accounts,
  accountMembers,
  accountWallets,
  serviceBudgets,
  chatbotBudgets,
  creditTransactions,
  creditReservations,
  autoRechargeSettings,
  autoRechargeRequests,
  whatsappConversationWindows,
  conversationAssignments,
  chatbotAdmins,
  pendingInvites,
  auditLogs,
} from './verly-schema.js';

export const userRelations = relations(user, ({ many, one }) => ({
  authMethods: many(authMethod),
  chatBots: many(chatBots),
  embeddings: many(embeddings),
  originDomains: many(originDomains),
  subscribedUsers: many(subscribedUsers),
  productLaunches: many(productLaunches),
  accountMembers: many(accountMembers),
  chatbotAdmins: many(chatbotAdmins),
  conversationAssignments: many(conversationAssignments),
}));

export const authMethodRelations = relations(authMethod, ({ one }) => ({
  user: one(user, {
    fields: [authMethod.userId],
    references: [user.id],
  }),
}));

export const chatBotsRelations = relations(chatBots, ({ one, many }) => ({
  user: one(user, {
    fields: [chatBots.userId],
    references: [user.id],
  }),
  account: one(accounts, {
    fields: [chatBots.accountId],
    references: [accounts.id],
  }),
  dataSources: many(dataSources),
  embeddings: many(embeddings),
  analytics: one(analytics),
  citations: many(citations),
  messages: many(messages),
  widgetConfig: one(widgetConfig),
  topics: many(chatbotTopics),
  pendingInvites: many(pendingInvites),
  topicStats: many(chatbotTopicStats),
  whatsappAccount: one(whatsappAccounts),
  contacts: many(contacts),
  channelAccounts: many(channelAccounts),
  smsAccounts: many(smsAccounts),
  emailAccounts: many(emailAccounts),
  templates: many(templates),
  campaigns: many(campaigns),
  originDomains: many(originDomains),
  analyticsPerDay: many(analyticsPerDay),
  productLaunches: many(productLaunches),
  voiceConfigs: many(voiceConfig),
  chatbotBudgets: many(chatbotBudgets),
  creditTransactions: many(creditTransactions),
  whatsappConversationWindows: many(whatsappConversationWindows),
  conversationAssignments: many(conversationAssignments),
  chatbotAdmins: many(chatbotAdmins),
}));

export const dataSourcesRelations = relations(dataSources, ({ one, many }) => ({
  chatBot: one(chatBots, {
    fields: [dataSources.chatbotId],
    references: [chatBots.id],
  }),
  embeddings: many(embeddings),
}));

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  user: one(user, {
    fields: [embeddings.userId],
    references: [user.id],
  }),
  chatBot: one(chatBots, {
    fields: [embeddings.chatbotId],
    references: [chatBots.id],
  }),
  dataSource: one(dataSources, {
    fields: [embeddings.dataSourceId],
    references: [dataSources.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one, many }) => ({
  chatBot: one(chatBots, {
    fields: [analytics.chatbotId],
    references: [chatBots.id],
  }),
  citations: many(citations),
}));

export const citationsRelations = relations(citations, ({ one }) => ({
  analytics: one(analytics, {
    fields: [citations.analyticsId],
    references: [analytics.id],
  }),
  chatBot: one(chatBots, {
    fields: [citations.chatbotId],
    references: [chatBots.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chatBot: one(chatBots, {
    fields: [messages.chatbotId],
    references: [chatBots.id],
  }),
  topic: one(chatbotTopics, {
    fields: [messages.topicId],
    references: [chatbotTopics.id],
  }),
}));

export const widgetConfigRelations = relations(widgetConfig, ({ one }) => ({
  chatBot: one(chatBots, {
    fields: [widgetConfig.chatbotId],
    references: [chatBots.id],
  }),
}));

export const chatbotTopicsRelations = relations(chatbotTopics, ({ one, many }) => ({
  chatBot: one(chatBots, {
    fields: [chatbotTopics.chatbotId],
    references: [chatBots.id],
  }),
  messages: many(messages),
  stats: many(chatbotTopicStats),
}));

export const chatbotTopicStatsRelations = relations(chatbotTopicStats, ({ one }) => ({
  chatBot: one(chatBots, {
    fields: [chatbotTopicStats.chatbotId],
    references: [chatBots.id],
  }),
  topic: one(chatbotTopics, {
    fields: [chatbotTopicStats.topicId],
    references: [chatbotTopics.id],
  }),
}));

export const whatsappAccountsRelations = relations(whatsappAccounts, ({ one, many }) => ({
  chatBot: one(chatBots, {
    fields: [whatsappAccounts.chatbotId],
    references: [chatBots.id],
  }),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  chatBot: one(chatBots, {
    fields: [contacts.chatbotId],
    references: [chatBots.id],
  }),
  campaignAudiences: many(campaignAudience),
}));

export const channelAccountsRelations = relations(channelAccounts, ({ one }) => ({
  chatBot: one(chatBots, {
    fields: [channelAccounts.chatbotId],
    references: [chatBots.id],
  }),
}));

export const smsAccountsRelations = relations(smsAccounts, ({ one }) => ({
  chatBot: one(chatBots, {
    fields: [smsAccounts.chatbotId],
    references: [chatBots.id],
  }),
}));

export const emailAccountsRelations = relations(emailAccounts, ({ one }) => ({
  chatBot: one(chatBots, {
    fields: [emailAccounts.chatbotId],
    references: [chatBots.id],
  }),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  chatBot: one(chatBots, {
    fields: [templates.chatbotId],
    references: [chatBots.id],
  }),
  campaigns: many(campaigns),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  chatBot: one(chatBots, {
    fields: [campaigns.chatbotId],
    references: [chatBots.id],
  }),
  template: one(templates, {
    fields: [campaigns.templateId],
    references: [templates.id],
  }),
  audience: many(campaignAudience),
}));

export const campaignAudienceRelations = relations(campaignAudience, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignAudience.campaignId],
    references: [campaigns.id],
  }),
  contact: one(contacts, {
    fields: [campaignAudience.contactId],
    references: [contacts.id],
  }),
}));

export const originDomainsRelations = relations(originDomains, ({ one }) => ({
  user: one(user, {
    fields: [originDomains.userId],
    references: [user.id],
  }),
  chatBot: one(chatBots, {
    fields: [originDomains.chatbotId],
    references: [chatBots.id],
  }),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscribedUsers: many(subscribedUsers),
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  account: one(accounts, {
    fields: [subscriptions.accountId],
    references: [accounts.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.planId],
  }),
}));

export const subscribedUsersRelations = relations(subscribedUsers, ({ one }) => ({
  user: one(user, {
    fields: [subscribedUsers.userId],
    references: [user.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [subscribedUsers.planId],
    references: [subscriptionPlans.planId],
  }),
}));

export const analyticsPerDayRelations = relations(analyticsPerDay, ({ one }) => ({
  chatBot: one(chatBots, {
    fields: [analyticsPerDay.chatbotId],
    references: [chatBots.id],
  }),
}));

export const productLaunchesRelations = relations(productLaunches, ({ one }) => ({
  user: one(user, {
    fields: [productLaunches.userId],
    references: [user.id],
  }),
  chatBot: one(chatBots, {
    fields: [productLaunches.chatbotId],
    references: [chatBots.id],
  }),
}));

export const voiceConfigRelations = relations(voiceConfig, ({ one, many }) => ({
  chatbot: one(chatBots, {
    fields: [voiceConfig.chatbotId],
    references: [chatBots.id],
  }),
  widgetConfig: one(voiceWidgetConfig, {
    fields: [voiceConfig.id],
    references: [voiceWidgetConfig.voiceConfigId],
  }),
  sessions: many(voiceCallSession),
}));

export const voiceWidgetConfigRelations = relations(voiceWidgetConfig, ({ one }) => ({
  voiceConfig: one(voiceConfig, {
    fields: [voiceWidgetConfig.voiceConfigId],
    references: [voiceConfig.id],
  }),
}));

export const voiceCallSessionRelations = relations(voiceCallSession, ({ one }) => ({
  voiceConfig: one(voiceConfig, {
    fields: [voiceCallSession.voiceConfigId],
    references: [voiceConfig.id],
  }),
}));

// ============================================
// Billing & Account Relations
// ============================================

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  members: many(accountMembers),
  wallet: one(accountWallets),
  serviceBudgets: many(serviceBudgets),
  creditTransactions: many(creditTransactions),
  creditReservations: many(creditReservations),
  autoRechargeSettings: one(autoRechargeSettings),
  autoRechargeRequests: many(autoRechargeRequests),
  chatBots: many(chatBots),
  pendingInvites: many(pendingInvites),
  auditLogs: many(auditLogs),
  subscriptions: many(subscriptions),
}));

export const accountMembersRelations = relations(accountMembers, ({ one }) => ({
  account: one(accounts, {
    fields: [accountMembers.accountId],
    references: [accounts.id],
  }),
  user: one(user, {
    fields: [accountMembers.userId],
    references: [user.id],
  }),
}));

export const accountWalletsRelations = relations(accountWallets, ({ one }) => ({
  account: one(accounts, {
    fields: [accountWallets.accountId],
    references: [accounts.id],
  }),
}));

export const serviceBudgetsRelations = relations(serviceBudgets, ({ one }) => ({
  account: one(accounts, {
    fields: [serviceBudgets.accountId],
    references: [accounts.id],
  }),
}));

export const chatbotBudgetsRelations = relations(chatbotBudgets, ({ one }) => ({
  chatbot: one(chatBots, {
    fields: [chatbotBudgets.chatbotId],
    references: [chatBots.id],
  }),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  account: one(accounts, {
    fields: [creditTransactions.accountId],
    references: [accounts.id],
  }),
  chatbot: one(chatBots, {
    fields: [creditTransactions.chatbotId],
    references: [chatBots.id],
  }),
}));

export const creditReservationsRelations = relations(creditReservations, ({ one }) => ({
  account: one(accounts, {
    fields: [creditReservations.accountId],
    references: [accounts.id],
  }),
}));

export const autoRechargeSettingsRelations = relations(autoRechargeSettings, ({ one }) => ({
  account: one(accounts, {
    fields: [autoRechargeSettings.accountId],
    references: [accounts.id],
  }),
}));

export const autoRechargeRequestsRelations = relations(autoRechargeRequests, ({ one }) => ({
  account: one(accounts, {
    fields: [autoRechargeRequests.accountId],
    references: [accounts.id],
  }),
}));

export const whatsappConversationWindowsRelations = relations(whatsappConversationWindows, ({ one }) => ({
  chatbot: one(chatBots, {
    fields: [whatsappConversationWindows.chatbotId],
    references: [chatBots.id],
  }),
}));

export const conversationAssignmentsRelations = relations(conversationAssignments, ({ one }) => ({
  chatbot: one(chatBots, {
    fields: [conversationAssignments.chatbotId],
    references: [chatBots.id],
  }),
  assignedToUser: one(user, {
    fields: [conversationAssignments.assignedToUserId],
    references: [user.id],
  }),
}));

export const chatbotAdminsRelations = relations(chatbotAdmins, ({ one }) => ({
  chatbot: one(chatBots, {
    fields: [chatbotAdmins.chatbotId],
    references: [chatBots.id],
  }),
  user: one(user, {
    fields: [chatbotAdmins.userId],
    references: [user.id],
  }),
}));

export const pendingInvitesRelations = relations(pendingInvites, ({ one }) => ({
  account: one(accounts, {
    fields: [pendingInvites.accountId],
    references: [accounts.id],
  }),
  chatbot: one(chatBots, {
    fields: [pendingInvites.chatbotId],
    references: [chatBots.id],
  }),
  invitedBy: one(user, {
    fields: [pendingInvites.invitedByUserId],
    references: [user.id],
    relationName: 'invitedBy',
  }),
  acceptedBy: one(user, {
    fields: [pendingInvites.acceptedByUserId],
    references: [user.id],
    relationName: 'acceptedBy',
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  account: one(accounts, {
    fields: [auditLogs.accountId],
    references: [accounts.id],
  }),
  user: one(user, {
    fields: [auditLogs.userId],
    references: [user.id],
  }),
}));