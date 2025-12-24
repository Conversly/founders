import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3Icon,
  DollarSignIcon,
  FlagIcon,
  LineChartIcon,
  LockIcon,
  RocketIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <RocketIcon className="size-4" />
            </div>
            <span className="text-lg font-bold">Founder Platform</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/founder">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/founder">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container flex flex-col items-center gap-8 py-24 text-center md:py-32">
          <Badge variant="secondary" className="text-sm">
            <SparklesIcon className="mr-1 size-3" />
            All-in-One Platform for Founders
          </Badge>
          <div className="max-w-4xl space-y-6">
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Manage Your <span className="text-primary">SaaS Business</span> with Intelligence
            </h1>
            <p className="text-balance text-xl text-muted-foreground leading-relaxed md:text-2xl">
              Track subscriptions, feature flags, costs, and analytics in one powerful dashboard. Built for founders who
              need insights, not complexity.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/founder">
              <Button size="lg" className="h-12 px-8">
                <RocketIcon className="mr-2 size-4" />
                Start Managing Now
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
                Explore Features
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ZapIcon className="size-4 text-primary" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <LockIcon className="size-4 text-primary" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="size-4 text-primary" />
              <span>Growth Insights</span>
            </div>
          </div>
        </section>

        <section id="features" className="border-t bg-muted/40 py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4">
                Features
              </Badge>
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything You Need to Scale
              </h2>
              <p className="mt-4 text-balance text-lg text-muted-foreground leading-relaxed">
                Built-in tools to manage subscriptions, optimize costs, and make data-driven decisions.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <DollarSignIcon className="size-6" />
                  </div>
                  <CardTitle>Pricing & Subscriptions</CardTitle>
                  <CardDescription>
                    Manage subscription plans, track MRR/ARR, and monitor customer lifecycle in real-time.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FlagIcon className="size-6" />
                  </div>
                  <CardTitle>Feature Flags</CardTitle>
                  <CardDescription>
                    Roll out features gradually with granular control over permissions and user segments.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BarChart3Icon className="size-6" />
                  </div>
                  <CardTitle>Cost Intelligence</CardTitle>
                  <CardDescription>
                    Track provider costs, calculate margins, and identify opportunities to optimize spend.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <LineChartIcon className="size-6" />
                  </div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Visualize key metrics with charts and insights to understand business performance.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UsersIcon className="size-6" />
                  </div>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>
                    Track active accounts, churn rates, and customer engagement metrics.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <TrendingUpIcon className="size-6" />
                  </div>
                  <CardTitle>Revenue Insights</CardTitle>
                  <CardDescription>
                    Forecast revenue, analyze plan performance, and identify growth opportunities.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-t py-24">
          <div className="container">
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">99.9%</div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">10k+</div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">$5M+</div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">MRR Managed</div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t bg-muted/40 py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to Take Control?
              </h2>
              <p className="mt-4 text-balance text-lg text-muted-foreground leading-relaxed">
                Join hundreds of founders managing their SaaS businesses with data-driven insights.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/founder">
                  <Button size="lg" className="h-12 px-8">
                    <RocketIcon className="mr-2 size-4" />
                    Access Dashboard
                  </Button>
                </Link>
                <Link href="#about">
                  <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <RocketIcon className="size-4" />
                </div>
                <span className="font-bold">Founder Platform</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                The all-in-one platform for managing your SaaS business with intelligence.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/founder" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Founder Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
