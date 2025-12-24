# Founder Platform

Admin dashboard for managing the SaaS platform, including pricing, subscriptions, accounts, and feature flags.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file with:
   ```env
   # Founder Platform Database (for founder platform tables: feature_flags, platform_metrics, etc.)
   FOUNDER_DATABASE_URL=postgresql://user:password@host:5432/founder_platform_db

   # Main System Database (for accounts, subscriptions, transactions, service_rates, etc.)
   MAIN_DATABASE_URL=postgresql://user:password@host:5432/main_system_db
   ```

3. **Run migrations:**
   ```bash
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Database Configuration

The platform uses **two separate databases**:

- **FOUNDER_DATABASE_URL**: Stores founder platform-specific tables:
  - `feature_flags` - Feature flag management
  - `platform_metrics` - Platform-wide metrics
  - `audit_logs` - Audit trail

- **MAIN_DATABASE_URL**: Stores main system tables:
  - `accounts` - Customer accounts
  - `subscriptions` - Account subscriptions
  - `subscription_plans` - Pricing plans
  - `service_rates` - Service pricing (chatbot, WhatsApp, voice)
  - `credit_transactions` - Billing transactions
  - `chat_bots` - Chatbot instances
  - `account_members` - Account team members

## Features

### Pricing Management (`/founder/pricing`)
- Set pricing for all services (Chatbot, WhatsApp, Voice)
- Configure rates per usage type (tokens, messages, minutes)
- Manage active/inactive rates
- Historical rate tracking

### Plans Management (`/founder/plans`)
- View all subscription plans
- See plan entitlements and pricing
- Manage plan visibility

### Accounts (`/founder/accounts`)
- View all customer accounts
- See subscription status and MRR
- Search and filter accounts

### Analytics (`/founder/analytics`)
- Cost breakdown by provider
- Revenue breakdown by tier
- Platform usage metrics

### Feature Flags (`/founder/flags`)
- Manage feature rollouts
- Control feature visibility
- A/B testing support

### Dashboard (`/founder`)
- Key metrics overview
- MRR, ARR, active accounts
- Provider costs and margins

## API Routes

- `GET /api/service-rates` - Get all service rates
- `POST /api/service-rates` - Create new service rate
- `PUT /api/service-rates` - Update service rate
- `GET /api/accounts` - Get all accounts
- `GET /api/plans` - Get all subscription plans
- `GET /api/metrics` - Get platform metrics
- `GET /api/flags` - Get feature flags
- `PUT /api/flags` - Update feature flag

## Architecture

- **Frontend**: Next.js 16 with React Server Components
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
