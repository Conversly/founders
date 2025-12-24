import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure your Founder Platform settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Configuration</CardTitle>
            <CardDescription>Configure your Neon database connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="database-url">Database URL</Label>
              <Input id="database-url" type="password" placeholder="postgresql://..." defaultValue="postgresql://..." />
              <p className="text-xs text-muted-foreground">Set via DATABASE_URL environment variable</p>
            </div>
            <Button>Test Connection</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stripe Integration</CardTitle>
            <CardDescription>Configure Stripe for payment processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-key">Stripe Secret Key</Label>
              <Input id="stripe-key" type="password" placeholder="sk_..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-webhook">Webhook Secret</Label>
              <Input id="stripe-webhook" type="password" placeholder="whsec_..." />
            </div>
            <Button>Save Stripe Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>General platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input id="platform-name" placeholder="My SaaS Platform" defaultValue="My SaaS Platform" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input
                id="support-email"
                type="email"
                placeholder="support@example.com"
                defaultValue="support@example.com"
              />
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
