"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, EditIcon, CopyIcon } from "lucide-react"

const mockPlans = [
  {
    id: "plan_free",
    name: "Free",
    tier: "FREE",
    description: "Perfect for trying out the platform",
    priceMonthly: 0,
    priceAnnually: 0,
    isActive: true,
    isPublic: true,
    entitlements: {
      maxChatbots: 1,
      maxUsers: 1,
      allowWhatsApp: false,
      allowVoice: false,
    },
  },
  {
    id: "plan_personal",
    name: "Personal",
    tier: "PERSONAL",
    description: "For individuals and small teams",
    priceMonthly: 29,
    priceAnnually: 290,
    isActive: true,
    isPublic: true,
    entitlements: {
      maxChatbots: 3,
      maxUsers: 3,
      allowWhatsApp: true,
      allowVoice: true,
    },
  },
  {
    id: "plan_pro",
    name: "Pro",
    tier: "PRO",
    description: "For growing businesses",
    priceMonthly: 99,
    priceAnnually: 990,
    isActive: true,
    isPublic: true,
    entitlements: {
      maxChatbots: 10,
      maxUsers: 10,
      allowWhatsApp: true,
      allowVoice: true,
    },
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    tier: "ENTERPRISE",
    description: "For large organizations",
    priceMonthly: 499,
    priceAnnually: 4990,
    isActive: true,
    isPublic: true,
    entitlements: {
      maxChatbots: -1,
      maxUsers: -1,
      allowWhatsApp: true,
      allowVoice: true,
    },
  },
]


async function fetchPlans() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockPlans
}

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await fetchPlans()
        setPlans(data.length > 0 ? data : mockPlans) // Fallback to mock if no data
      } catch (error) {
        console.error("Failed to load plans:", error)
        setPlans(mockPlans) // Fallback to mock on error
      } finally {
        setLoading(false)
      }
    }
    loadPlans()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Subscription Plans</h2>
          <p className="text-muted-foreground">Manage pricing and entitlements for your platform</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Subscription Plans</h2>
          <p className="text-muted-foreground">Manage pricing and entitlements for your platform</p>
        </div>
        <Button>
          <PlusIcon className="mr-2 size-4" />
          Create Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.planId || plan.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {plan.planName || plan.name || "Unnamed Plan"}
                    {plan.isActive !== false && <Badge variant="default">Active</Badge>}
                    {plan.isPublic !== false && <Badge variant="outline">Public</Badge>}
                  </CardTitle>
                  <CardDescription>{plan.description || "No description"}</CardDescription>
                </div>
                <Badge variant="secondary">{plan.tierType || plan.tier || "N/A"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  ${plan.priceMonthly ? parseFloat(String(plan.priceMonthly)).toFixed(2) : "0"}
                </span>
                <span className="text-muted-foreground">/month</span>
                {plan.priceAnnually && parseFloat(String(plan.priceAnnually)) > 0 && (
                  <span className="text-sm text-muted-foreground">
                    or ${parseFloat(String(plan.priceAnnually)).toFixed(2)}/year
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Entitlements</h4>
                {plan.entitlements ? (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      • {plan.entitlements.maxChatbots === -1 || plan.entitlements.maxChatbots === null || plan.entitlements.maxChatbots === undefined
                        ? "Unlimited"
                        : plan.entitlements.maxChatbots}{" "}
                      chatbots
                    </li>
                    <li>
                      • {plan.entitlements.maxUsers === -1 || plan.entitlements.maxUsers === null || plan.entitlements.maxUsers === undefined
                        ? "Unlimited"
                        : plan.entitlements.maxUsers}{" "}
                      users
                    </li>
                    <li>• WhatsApp: {plan.entitlements.allowWhatsApp ? "Yes" : "No"}</li>
                    <li>• Voice: {plan.entitlements.allowVoice ? "Yes" : "No"}</li>
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No entitlements configured</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <EditIcon className="mr-2 size-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <CopyIcon className="mr-2 size-3" />
                  Duplicate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
