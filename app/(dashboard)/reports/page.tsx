"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Briefcase,
  IndianRupee,
  Users,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  mockCases,
  mockPayments,
  mockExpenses,
  mockDashboardStats,
  mockUsers,
} from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// Monthly data for charts
const monthlyData = [
  { month: "Jan", income: 150000, expense: 12000, cases: 3 },
  { month: "Feb", income: 200000, expense: 15000, cases: 4 },
  { month: "Mar", income: 180000, expense: 10000, cases: 2 },
  { month: "Apr", income: 250000, expense: 20000, cases: 5 },
]

const caseTypeData = [
  { name: "Civil", value: mockCases.filter((c) => c.caseType === "civil").length, color: "hsl(var(--chart-1))" },
  { name: "Criminal", value: mockCases.filter((c) => c.caseType === "criminal").length, color: "hsl(var(--chart-2))" },
  { name: "Family", value: mockCases.filter((c) => c.caseType === "family").length, color: "hsl(var(--chart-3))" },
]

const caseStatusData = [
  { name: "Active", value: mockCases.filter((c) => c.status === "active").length },
  { name: "Pending", value: mockCases.filter((c) => c.status === "pending").length },
  { name: "Closed", value: mockCases.filter((c) => c.status === "closed").length },
]

export default function ReportsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [dateRange, setDateRange] = useState("this-month")
  const [reportType, setReportType] = useState("overview")

  // Only admins can access
  if (user?.role !== "head_advocate") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          You don&apos;t have permission to access reports.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    )
  }

  // Calculate totals
  const totalIncome = mockPayments.reduce((sum, p) => sum + p.paidAmount, 0)
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalCases = mockCases.length
  const activeCases = mockCases.filter((c) => c.status === "active").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px] bg-input">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  Rs. {(totalIncome / 100000).toFixed(1)}L
                </p>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% from last month
                </div>
              </div>
              <div className="p-3 rounded-lg bg-success/10 text-success">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalCases}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeCases} active
                </p>
              </div>
              <div className="p-3 rounded-lg bg-chart-1/10 text-chart-1">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold text-foreground mt-1">{mockUsers.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Active users
                </p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-success mt-1">
                  Rs. {((totalIncome - totalExpenses) / 100000).toFixed(1)}L
                </p>
                <div className="flex items-center gap-1 text-xs text-success mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% margin
                </div>
              </div>
              <div className="p-3 rounded-lg bg-chart-4/10 text-chart-4">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <CardDescription>Monthly income and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                income: { label: "Income", color: "hsl(var(--chart-1))" },
                expense: { label: "Expense", color: "hsl(var(--chart-5))" },
              }}
              className="h-[250px]"
            >
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Case Growth</CardTitle>
            <CardDescription>New cases per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cases: { label: "Cases", color: "hsl(var(--chart-2))" },
              }}
              className="h-[250px]"
            >
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="cases"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-2))" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Cases by Type</CardTitle>
            <CardDescription>Distribution of case categories</CardDescription>
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
                  {caseTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-4">
              {caseTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
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
            <CardTitle className="text-base">Cases by Status</CardTitle>
            <CardDescription>Current case status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Cases", color: "hsl(var(--chart-1))" },
              }}
              className="h-[200px]"
            >
              <BarChart data={caseStatusData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={60}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Payment Status</CardTitle>
            <CardDescription>Collection overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fully Paid</span>
                <span className="font-medium text-success">
                  {mockPayments.filter((p) => p.status === "paid").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Partially Paid</span>
                <span className="font-medium text-warning">
                  {mockPayments.filter((p) => p.status === "partial").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-medium text-destructive">
                  {mockPayments.filter((p) => p.status === "pending").length}
                </span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Collection Rate</span>
                  <span className="text-lg font-bold text-success">
                    {((totalIncome / mockPayments.reduce((s, p) => s + p.amount, 0)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Court Performance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Court-wise Case Distribution</CardTitle>
          <CardDescription>Number of cases per court</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {mockDashboardStats.courtWiseSummary.map((court, index) => (
              <div
                key={court.court}
                className="flex flex-col items-center rounded-lg border border-border bg-accent/30 p-4"
              >
                <span className="text-3xl font-bold text-foreground">{court.count}</span>
                <span className="text-sm text-muted-foreground text-center mt-1 truncate max-w-full">
                  {court.court}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Generate Reports</CardTitle>
          <CardDescription>Download detailed reports in PDF format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Case Summary", description: "All cases with status", icon: Briefcase },
              { title: "Financial Report", description: "Income & expenses", icon: IndianRupee },
              { title: "Team Performance", description: "User activity report", icon: Users },
              { title: "Court Calendar", description: "Upcoming hearings", icon: Calendar },
            ].map((report) => (
              <Button
                key={report.title}
                variant="outline"
                className="h-auto flex-col items-start p-4 gap-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <report.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{report.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{report.description}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
