"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import { getCostBreakdown, getRevenueByTier } from "@/lib/api"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function AnalyticsPage() {
  const [costBreakdown, setCostBreakdown] = useState<any[]>([])
  const [revenueBreakdown, setRevenueBreakdown] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [costs, revenue] = await Promise.all([
          getCostBreakdown(),
          getRevenueByTier(),
        ])
        setCostBreakdown(costs)
        setRevenueBreakdown(revenue)
      } catch (error) {
        console.error("Failed to load metrics:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Analytics & Cost Intelligence</h2>
          <p className="text-muted-foreground">Deep dive into revenue, costs, and platform performance</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Calculate service type breakdown from provider costs
  const serviceBreakdown = costBreakdown.reduce((acc: any[], item: any) => {
    const serviceType = item.providerType === "llm" ? "LLM" : item.providerType === "whatsapp" ? "WhatsApp" : item.providerType === "voice" ? "Voice" : "Other";
    const existing = acc.find((s) => s.service === serviceType);
    if (existing) {
      existing.cost += Number(item.totalCost || 0);
    } else {
      acc.push({ service: serviceType, cost: Number(item.totalCost || 0) });
    }
    return acc;
  }, []);

  const totalCost = serviceBreakdown.reduce((sum, s) => sum + s.cost, 0);
  const serviceBreakdownWithPercentage = serviceBreakdown.map((s) => ({
    ...s,
    percentage: totalCost > 0 ? (s.cost / totalCost) * 100 : 0,
  }));

  const totalRevenue = revenueBreakdown.reduce((sum, r) => sum + Number(r.revenue || 0), 0);
  const revenueBreakdownWithPercentage = revenueBreakdown.map((r) => ({
    ...r,
    percentage: totalRevenue > 0 ? (Number(r.revenue || 0) / totalRevenue) * 100 : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Analytics & Cost Intelligence</h2>
        <p className="text-muted-foreground">Deep dive into revenue, costs, and platform performance</p>
      </div>

      <Tabs defaultValue="costs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="costs">Cost Intelligence</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="usage">Usage Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Costs by Provider</CardTitle>
                <CardDescription>Monthly provider costs breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {costBreakdown.length > 0 ? (
                  costBreakdown.map((item: any) => (
                    <div key={item.provider} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.provider || "Unknown"}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.providerType || item.type || "other"}
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">
                          {formatCurrency(Number(item.totalCost || item.cost || 0))}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${item.percentage ||
                              (costBreakdown.length > 0
                                ? (Number(item.totalCost || item.cost || 0) /
                                  costBreakdown.reduce((sum: number, i: any) => sum + Number(i.totalCost || i.cost || 0), 0)) *
                                100
                                : 0)
                              }%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.percentage ||
                          (costBreakdown.length > 0
                            ? (
                              (Number(item.totalCost || item.cost || 0) /
                                costBreakdown.reduce((sum: number, i: any) => sum + Number(i.totalCost || i.cost || 0), 0)) *
                              100
                            ).toFixed(1)
                            : 0)}
                        % of total
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No cost data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Costs by Service Type</CardTitle>
                <CardDescription>Service category breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceBreakdownWithPercentage.length > 0 ? (
                  serviceBreakdownWithPercentage.map((item) => (
                    <div key={item.service} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.service}</span>
                        <span className="text-sm font-medium">{formatCurrency(item.cost)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all" style={{ width: `${item.percentage}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}% of total</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No service data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost Optimization Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "OpenAI API Usage",
                    description: "15% of requests could use GPT-3.5 instead of GPT-4",
                    savings: 2400,
                  },
                  {
                    title: "WhatsApp Message Templates",
                    description: "Optimize template usage to reduce costs by 12%",
                    savings: 384,
                  },
                  {
                    title: "Voice Call Duration",
                    description: "Average call duration is 20% longer than industry standard",
                    savings: 420,
                  },
                ].map((opportunity, i) => (
                  <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{opportunity.title}</p>
                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        Save {formatCurrency(opportunity.savings)}/mo
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Plan Tier</CardTitle>
              <CardDescription>Monthly revenue breakdown by subscription tier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {revenueBreakdownWithPercentage.length > 0 ? (
                revenueBreakdownWithPercentage.map((item: any) => (
                  <div key={item.tier} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.tier || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.accountCount || item.accounts || 0} accounts
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatCurrency(Number(item.revenue || 0))}
                      </p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${item.percentage ||
                            (revenueBreakdown.length > 0
                              ? (
                                (Number(item.revenue || 0) /
                                  revenueBreakdown.reduce((sum: number, i: any) => sum + Number(i.revenue || 0), 0)) *
                                100
                              ).toFixed(1)
                              : 0)
                            }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.percentage ||
                        (revenueBreakdown.length > 0
                          ? (
                            (Number(item.revenue || 0) /
                              revenueBreakdown.reduce((sum: number, i: any) => sum + Number(i.revenue || 0), 0)) *
                            100
                          ).toFixed(1)
                          : 0)}
                      % of total revenue
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No revenue data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Usage Metrics</CardTitle>
              <CardDescription>Key usage statistics across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "API Requests", value: "2.4M", change: "+15.2%" },
                  { label: "Messages Sent", value: "891K", change: "+8.7%" },
                  { label: "Voice Minutes", value: "12.5K", change: "+22.1%" },
                  { label: "Active Users", value: "34.2K", change: "+5.4%" },
                  { label: "Avg Session Duration", value: "8.2 min", change: "+1.2%" },
                  { label: "Error Rate", value: "0.12%", change: "-0.05%" },
                ].map((metric, i) => (
                  <div key={i} className="space-y-2 rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-green-600">{metric.change} vs last month</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
