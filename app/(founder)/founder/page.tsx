"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUpIcon, DollarSignIcon, UsersIcon, ActivityIcon, BarChart3Icon, TrendingDownIcon } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}




import { getDashboardMetrics, getRecentActivity, getTopPerformingPlans } from "@/lib/actions"


export default function FounderDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [topPlans, setTopPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [metricsData, activityData, plansData] = await Promise.all([
          getDashboardMetrics(),
          getRecentActivity(),
          getTopPerformingPlans(),
        ])
        setMetrics(metricsData)
        setRecentActivity(activityData)
        setTopPlans(plansData)
      } catch (error) {
        console.error("Failed to load metrics:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  const displayMetrics = metrics
    ? {
      mrr: Number(metrics?.metrics?.mrr || 0),
      activeAccounts: Number(metrics?.metrics?.activeAccounts || 0),
      providerCost: Number(metrics?.metrics?.totalProviderCost || 0),
      grossMargin:
        (metrics?.metrics?.mrr || 0) > 0
          ? ((metrics.metrics.mrr - metrics.metrics.totalProviderCost) / metrics.metrics.mrr) * 100
          : 0,
    }
    : {
      mrr: 0,
      activeAccounts: 0,
      providerCost: 0,
      grossMargin: 0
    }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your platform's key metrics</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your platform's key metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <DollarSignIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(displayMetrics.mrr)}</div>
            <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <UsersIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayMetrics.activeAccounts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provider Costs</CardTitle>
            <BarChart3Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(displayMetrics.providerCost)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <TrendingUpIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayMetrics.grossMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Based on MRR and costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARR</CardTitle>
            <DollarSignIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(displayMetrics.mrr * 12)}</div>
            <p className="text-xs text-muted-foreground">Annual Recurring Revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.account}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPlans.length > 0 ? (
                topPlans.map((plan, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{plan.plan}</p>
                      <p className="text-sm text-muted-foreground">{plan.accounts} accounts</p>
                    </div>
                    <div className="text-sm font-medium">{formatCurrency(plan.revenue)}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No plan data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
