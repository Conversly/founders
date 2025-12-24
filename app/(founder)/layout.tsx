import type React from "react"
import type { Metadata } from "next"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboardIcon, TagsIcon, FlagIcon, DollarSignIcon, BarChart3Icon, SettingsIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Founder Platform",
  description: "Manage your SaaS platform",
}

const navigation = [
  {
    group: "Overview",
    items: [
      { name: "Dashboard", href: "/founder", icon: LayoutDashboardIcon },
      { name: "Analytics", href: "/founder/analytics", icon: BarChart3Icon },
    ],
  },
  {
    group: "Management",
    items: [
      { name: "Plans", href: "/founder/plans", icon: TagsIcon },
      { name: "Pricing", href: "/founder/pricing", icon: DollarSignIcon },
      { name: "Accounts", href: "/founder/accounts", icon: DollarSignIcon },
      { name: "Feature Flags", href: "/founder/flags", icon: FlagIcon },
    ],
  },
  {
    group: "Settings",
    items: [{ name: "Settings", href: "/founder/settings", icon: SettingsIcon }],
  },
]

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboardIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Founder Platform</span>
              <span className="text-xs text-muted-foreground">Admin Dashboard</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {navigation.map((section) => (
            <SidebarGroup key={section.group}>
              <SidebarGroupLabel>{section.group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <a href={item.href}>
                          <item.icon />
                          <span>{item.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>v1.0.0</span>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold">Founder Platform</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
