"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SearchIcon, FilterIcon } from "lucide-react"




import { getAccounts } from "@/lib/actions"


export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await getAccounts()
        setAccounts(data)
      } catch (error) {
        console.error("Failed to load accounts:", error)
        // Fallback to empty if fails, or keep as is?
        // Let's set empty for now to distinguish from mock.
        setAccounts([])
      } finally {
        setLoading(false)
      }
    }
    loadAccounts()
  }, [])

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Accounts</h2>
          <p className="text-muted-foreground">Manage customer accounts and subscriptions</p>
        </div>
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Accounts</h2>
          <p className="text-muted-foreground">Manage customer accounts and subscriptions</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <FilterIcon className="mr-2 size-4" />
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {filteredAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {account.name}
                    <Badge
                      variant={
                        account.status === "active"
                          ? "default"
                          : account.status === "trialing"
                            ? "secondary"
                            : account.status === "canceled"
                              ? "outline"
                              : "secondary"
                      }
                    >
                      {account.status === "no_subscription" ? "No Subscription" : account.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{account.email}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">MRR</p>
                  <p className="text-lg font-bold">${account.mrr}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Plan</p>
                  <Badge variant="secondary">{account.plan}</Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Chatbots</p>
                  <p className="text-sm text-muted-foreground">{account.chatbots}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Users</p>
                  <p className="text-sm text-muted-foreground">{account.users}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{new Date(account.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Manage
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
