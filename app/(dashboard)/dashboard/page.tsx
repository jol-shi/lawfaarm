"use client"

import { useAuth } from "@/lib/auth-context"
import { HeadAdvocateDashboard } from "@/components/dashboard/head-advocate-dashboard"
import { AssociateDashboard } from "@/components/dashboard/associate-dashboard"
import { InternDashboard } from "@/components/dashboard/intern-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "head_advocate":
      return <HeadAdvocateDashboard />
    case "associate":
      return <AssociateDashboard />
    case "intern":
      return <InternDashboard />
    default:
      return <HeadAdvocateDashboard />
  }
}
