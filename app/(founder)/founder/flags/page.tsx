"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { PlusIcon, EditIcon } from "lucide-react"

const mockFlags = [
  {
    id: "flag_1",
    key: "whatsapp_v2",
    name: "WhatsApp V2 Integration",
    description: "New WhatsApp messaging API with template support",
    strategy: "percentage",
    isEnabled: true,
    rolloutPercentage: 25,
    targetTiers: ["PRO", "ENTERPRISE"],
  },
  {
    id: "flag_2",
    key: "new_chat_ui",
    name: "New Chat UI",
    description: "Redesigned chatbot widget interface",
    strategy: "targeted",
    isEnabled: true,
    rolloutPercentage: 100,
    targetAccounts: 15,
  },
  {
    id: "flag_3",
    key: "voice_transcription_v2",
    name: "Voice Transcription V2",
    description: "Improved voice transcription with Whisper",
    strategy: "ab_test",
    isEnabled: true,
    rolloutPercentage: 50,
    variants: ["control", "whisper"],
  },
  {
    id: "flag_4",
    key: "advanced_analytics",
    name: "Advanced Analytics",
    description: "Enhanced analytics dashboard with custom reports",
    strategy: "global",
    isEnabled: false,
    rolloutPercentage: 0,
  },
]

async function fetchFlags() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockFlags
}

async function updateFlag(id: string, data: any) {
  // Simulate API call
  console.log("Updating flag:", id, data)
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}

export default function FlagsPage() {
  const [flags, setFlags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFlags() {
      try {
        const data = await fetchFlags()
        setFlags(data.length > 0 ? data : mockFlags)
      } catch (error) {
        console.error("Failed to load flags:", error)
        setFlags(mockFlags) // Fallback to mock
      } finally {
        setLoading(false)
      }
    }
    loadFlags()
  }, [])

  async function handleToggle(flagId: string, currentValue: boolean) {
    try {
      await updateFlag(flagId, { isEnabled: !currentValue })
      setFlags(flags.map((f) => (f.id === flagId ? { ...f, isEnabled: !currentValue } : f)))
    } catch (error: any) {
      console.error("Failed to update flag:", error)
      alert(`Failed to update flag: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Feature Flags</h2>
          <p className="text-muted-foreground">Control feature rollouts and run experiments</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Feature Flags</h2>
          <p className="text-muted-foreground">Control feature rollouts and run experiments</p>
        </div>
        <Button>
          <PlusIcon className="mr-2 size-4" />
          Create Flag
        </Button>
      </div>

      <div className="space-y-4">
        {flags.map((flag) => (
          <Card key={flag.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {flag.name || "Unnamed Flag"}
                    <Badge variant={flag.isEnabled ? "default" : "secondary"}>
                      {flag.isEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs">
                      {flag.key || flag.id}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{flag.description || "No description"}</CardDescription>
                </div>
                <Switch checked={flag.isEnabled} onCheckedChange={() => handleToggle(flag.id, flag.isEnabled)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Strategy</p>
                  <Badge variant="secondary">{flag.strategy || "global"}</Badge>
                </div>

                {flag.strategy === "percentage" && flag.value?.percentage !== undefined && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Rollout</p>
                    <p className="text-sm text-muted-foreground">{flag.value.percentage}%</p>
                  </div>
                )}

                {flag.strategy === "targeted" && flag.value?.targetAccounts && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Target Accounts</p>
                    <p className="text-sm text-muted-foreground">
                      {Array.isArray(flag.value.targetAccounts)
                        ? flag.value.targetAccounts.length
                        : flag.value.targetAccounts}{" "}
                      accounts
                    </p>
                  </div>
                )}

                {flag.value?.targetTiers && flag.value.targetTiers.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Target Tiers</p>
                    <div className="flex gap-1">
                      {flag.value.targetTiers.map((tier: string) => (
                        <Badge key={tier} variant="outline">
                          {tier}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {flag.value?.variants && flag.value.variants.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Variants</p>
                    <div className="flex gap-1">
                      {flag.value.variants.map((variant: any) => (
                        <Badge key={variant.name || variant} variant="outline">
                          {variant.name || variant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ml-auto">
                  <Button variant="outline" size="sm">
                    <EditIcon className="mr-2 size-3" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
