"use client"

import Link from "next/link"
import {
  Briefcase,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import {
  mockDashboardStats,
  mockCauseList,
  mockPayments,
  mockCases,
  getUserById,
} from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const statsCards = [
  {
    title: "Cases Today",
    value: mockDashboardStats.totalCasesToday,
    icon: Calendar,
    description: "Hearings scheduled",
    color: "text-chart-1",
  },
  {
    title: "Active Cases",
    value: mockDashboardStats.totalActiveCases,
    icon: Briefcase,
    description: "Currently active",
    color: "text-chart-2",
  },
  {
    title: "Pending Payments",
    value: `Rs. ${(mockDashboardStats.pendingPayments / 1000).toFixed(0)}K`,
    icon: CreditCard,
    description: "Amount due",
    color: "text-warning",
  },
  {
    title: "Upcoming Hearings",
    value: mockDashboardStats.upcomingHearings,
    icon: Clock,
    description: "Next 7 days",
    color: "text-chart-4",
  },
]

const caseTypeData = mockDashboardStats.caseTypeDistribution.map((item) => ({
  name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
  value: item.count,
}))

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

const incomeExpenseData = [
  { name: "Income", value: mockDashboardStats.monthlyIncome / 1000 },
  { name: "Expense", value: mockDashboardStats.monthlyExpense / 1000 },
]

export function HeadAdvocateDashboard() {
  const { user } = useAuth()

  const pendingPayments = mockPayments.filter(
    (p) => p.status === "pending" || p.status === "partial"
  )

  const upcomingHearings = mockCauseList.slice(0, 5)

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your cases today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={cn("p-3 rounded-lg bg-accent", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Case Distribution</CardTitle>
            <CardDescription>By case type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                civil: { label: "Civil", color: "hsl(var(--chart-1))" },
                criminal: { label: "Criminal", color: "hsl(var(--chart-2))" },
                family: { label: "Family", color: "hsl(var(--chart-3))" },
              }}
              className="h-[200px]"
            >
              <PieChart>
                <Pie
                  data={caseTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {caseTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              {caseTypeData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Income vs Expense</CardTitle>
            <CardDescription>This month (in thousands)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: { label: "Income", color: "hsl(var(--chart-1))" },
                expense: { label: "Expense", color: "hsl(var(--chart-5))" },
              }}
              className="h-[200px]"
            >
              <BarChart data={incomeExpenseData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={60} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {incomeExpenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-5))"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="flex items-center justify-center gap-2 mt-4">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">
                Net: Rs. {((mockDashboardStats.monthlyIncome - mockDashboardStats.monthlyExpense) / 1000).toFixed(0)}K profit
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upcoming Hearings */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Upcoming Hearings</CardTitle>
              <CardDescription>Next scheduled court dates</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cause-list" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case</TableHead>
                  <TableHead>Court</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingHearings.map((hearing) => (
                  <TableRow key={hearing.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {hearing.caseNumber}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {hearing.caseTitle}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {hearing.courtName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-foreground">
                          {new Date(hearing.hearingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">{hearing.hearingTime}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Pending Payments
                {pendingPayments.length > 0 && (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </CardTitle>
              <CardDescription>Outstanding client dues</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/payments" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayments.slice(0, 5).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {payment.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground">{payment.caseNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground text-sm">
                        Rs. {((payment.amount - payment.paidAmount) / 1000).toFixed(0)}K
                      </p>
                    </TableCell>
                    <TableCell>{getPriorityBadge(payment.priority)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Court-wise Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Court-wise Case Summary</CardTitle>
          <CardDescription>Distribution of active cases across courts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {mockDashboardStats.courtWiseSummary.map((court) => (
              <div
                key={court.court}
                className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-3"
              >
                <span className="text-sm text-foreground truncate pr-2">{court.court}</span>
                <Badge variant="secondary">{court.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
