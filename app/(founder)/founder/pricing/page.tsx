"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon, EditIcon, SaveIcon, XIcon } from "lucide-react"
import { useState, useEffect } from "react"
// Client-side API calls
async function fetchServiceRates() {
  const res = await fetch("/api/service-rates", { cache: "no-store" })
  const data = await res.json()
  if (!data.success) throw new Error(data.error)
  return data.data
}

async function createRate(data: any) {
  const res = await fetch("/api/service-rates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!result.success) throw new Error(result.error)
  return result
}

async function updateRate(id: string, data: any) {
  const res = await fetch("/api/service-rates", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  })
  const result = await res.json()
  if (!result.success) throw new Error(result.error)
  return result
}

type ServiceType = "CHATBOT" | "WHATSAPP" | "VOICE"
type UsageType = "TOKEN_PROMPT" | "TOKEN_COMPLETION" | "MESSAGE_SENT" | "CONVERSATION_WINDOW" | "VOICE_MINUTE"

interface ServiceRate {
  id: string
  serviceType: ServiceType
  usageType: UsageType
  ratePerUnit: string
  currency: string
  isActive: boolean
  effectiveFrom: Date | null
}

const serviceLabels: Record<ServiceType, string> = {
  CHATBOT: "Chatbot",
  WHATSAPP: "WhatsApp",
  VOICE: "Voice",
}

const usageLabels: Record<UsageType, string> = {
  TOKEN_PROMPT: "Input Tokens",
  TOKEN_COMPLETION: "Output Tokens",
  MESSAGE_SENT: "Message Sent",
  CONVERSATION_WINDOW: "Conversation Window",
  VOICE_MINUTE: "Voice Minute",
}

export default function PricingPage() {
  const [rates, setRates] = useState<ServiceRate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ ratePerUnit: string }>({ ratePerUnit: "" })
  const [showNewForm, setShowNewForm] = useState(false)
  const [newRate, setNewRate] = useState<{
    serviceType: ServiceType
    usageType: UsageType
    ratePerUnit: string
  }>({
    serviceType: "CHATBOT",
    usageType: "TOKEN_PROMPT",
    ratePerUnit: "",
  })

  useEffect(() => {
    loadRates()
  }, [])

  async function loadRates() {
    try {
      setLoading(true)
      const data = await fetchServiceRates()
      setRates(data as any)
    } catch (error) {
      console.error("Failed to load service rates:", error)
      alert("Failed to load service rates. Please check your database connection.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(rateId: string) {
    try {
      await updateRate(rateId, {
        ratePerUnit: editValues.ratePerUnit,
      })
      setEditingId(null)
      setEditValues({ ratePerUnit: "" })
      await loadRates()
    } catch (error: any) {
      console.error("Failed to update rate:", error)
      alert(`Failed to update rate: ${error.message}`)
    }
  }

  async function handleCreate() {
    if (!newRate.ratePerUnit || parseFloat(newRate.ratePerUnit) <= 0) {
      alert("Please enter a valid rate")
      return
    }

    try {
      await createRate({
        serviceType: newRate.serviceType,
        usageType: newRate.usageType,
        ratePerUnit: newRate.ratePerUnit,
      })
      setShowNewForm(false)
      setNewRate({
        serviceType: "CHATBOT",
        usageType: "TOKEN_PROMPT",
        ratePerUnit: "",
      })
      await loadRates()
    } catch (error: any) {
      console.error("Failed to create rate:", error)
      alert(`Failed to create rate: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Service Pricing</h2>
          <p className="text-muted-foreground">Manage pricing for all services</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Group rates by service type
  const ratesByService = rates.reduce((acc, rate) => {
    if (!acc[rate.serviceType]) {
      acc[rate.serviceType] = []
    }
    acc[rate.serviceType].push(rate)
    return acc
  }, {} as Record<ServiceType, ServiceRate[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Service Pricing</h2>
          <p className="text-muted-foreground">Set pricing for chatbot, WhatsApp, and voice services</p>
        </div>
        <Button onClick={() => setShowNewForm(true)}>
          <PlusIcon className="mr-2 size-4" />
          Add Rate
        </Button>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newRate.serviceType}
                  onChange={(e) => setNewRate({ ...newRate, serviceType: e.target.value as ServiceType })}
                >
                  <option value="CHATBOT">Chatbot</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="VOICE">Voice</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Usage Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newRate.usageType}
                  onChange={(e) => setNewRate({ ...newRate, usageType: e.target.value as UsageType })}
                >
                  {newRate.serviceType === "CHATBOT" && (
                    <>
                      <option value="TOKEN_PROMPT">Input Tokens</option>
                      <option value="TOKEN_COMPLETION">Output Tokens</option>
                    </>
                  )}
                  {newRate.serviceType === "WHATSAPP" && (
                    <>
                      <option value="MESSAGE_SENT">Message Sent</option>
                      <option value="CONVERSATION_WINDOW">Conversation Window</option>
                    </>
                  )}
                  {newRate.serviceType === "VOICE" && <option value="VOICE_MINUTE">Voice Minute</option>}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Rate per Unit (Credits)</Label>
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="0.001"
                  value={newRate.ratePerUnit}
                  onChange={(e) => setNewRate({ ...newRate, ratePerUnit: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>Create Rate</Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(["CHATBOT", "WHATSAPP", "VOICE"] as ServiceType[]).map((serviceType) => (
        <Card key={serviceType}>
          <CardHeader>
            <CardTitle>{serviceLabels[serviceType]}</CardTitle>
            <CardDescription>Pricing configuration for {serviceLabels[serviceType].toLowerCase()} services</CardDescription>
          </CardHeader>
          <CardContent>
            {ratesByService[serviceType] && ratesByService[serviceType].length > 0 ? (
              <div className="space-y-4">
                {ratesByService[serviceType].map((rate) => (
                  <div key={rate.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{usageLabels[rate.usageType]}</span>
                        {rate.isActive && <Badge variant="default">Active</Badge>}
                        {!rate.isActive && <Badge variant="secondary">Inactive</Badge>}
                      </div>
                      {rate.effectiveFrom && (
                        <p className="text-sm text-muted-foreground">
                          Effective from: {new Date(rate.effectiveFrom).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {editingId === rate.id ? (
                        <>
                          <Input
                            type="number"
                            step="0.000001"
                            value={editValues.ratePerUnit}
                            onChange={(e) => setEditValues({ ratePerUnit: e.target.value })}
                            className="w-32"
                          />
                          <Button size="sm" onClick={() => handleSave(rate.id)}>
                            <SaveIcon className="size-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            <XIcon className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-lg font-semibold">{rate.ratePerUnit}</span>
                          <span className="text-muted-foreground">{rate.currency}</span>
                          {rate.isActive && (
                            <Button size="sm" variant="outline" onClick={() => setEditingId(rate.id)}>
                              <EditIcon className="mr-2 size-3" />
                              Edit
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No rates configured for this service</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

