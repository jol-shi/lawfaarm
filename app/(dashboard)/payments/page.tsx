"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  CreditCard,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Download,
  Eye,
  Filter,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis } from "recharts"
import { mockPayments, mockExpenses, mockDashboardStats } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export default function PaymentsPage() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "partial" | "pending">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)

  const isAdmin = user?.role === "head_advocate"

  // Filter payments
  const filteredPayments = useMemo(() => {
    return mockPayments.filter((p) => {
      const matchesStatus = statusFilter === "all" || p.status === statusFilter
      const matchesPriority = priorityFilter === "all" || p.priority === priorityFilter
      return matchesStatus && matchesPriority
    })
  }, [statusFilter, priorityFilter])

  // Calculate totals
  const totalAmount = mockPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = mockPayments.reduce((sum, p) => sum + p.paidAmount, 0)
  const totalPending = totalAmount - totalPaid
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0)

  // Payment status data for chart
  const paymentStatusData = [
    { status: "Paid", value: mockPayments.filter((p) => p.status === "paid").length },
    { status: "Partial", value: mockPayments.filter((p) => p.status === "partial").length },
    { status: "Pending", value: mockPayments.filter((p) => p.status === "pending").length },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground">Paid</Badge>
      case "partial":
        return <Badge className="bg-warning text-warning-foreground">Partial</Badge>
      case "pending":
        return <Badge variant="destructive">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="border-destructive text-destructive">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="border-warning text-warning">
            Medium
          </Badge>
        )
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Payments & Expenses</h1>
          <p className="text-muted-foreground">Track client payments and case expenses</p>
        </div>
        {isAdmin && (
          <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>Add a payment received from a client</DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel>Select Case</FieldLabel>
                  <Select>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select case" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPayments.map((p) => (
                        <SelectItem key={p.id} value={p.caseId}>
                          {p.caseNumber} - {p.clientName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Amount (Rs.)</FieldLabel>
                  <Input type="number" placeholder="0" className="bg-input" />
                </Field>
                <Field>
                  <FieldLabel>Payment Method</FieldLabel>
                  <Select>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Date</FieldLabel>
                  <Input type="date" className="bg-input" />
                </Field>
                <Field>
                  <FieldLabel>Notes (Optional)</FieldLabel>
                  <Input placeholder="Payment notes" className="bg-input" />
                </Field>
              </FieldGroup>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddPaymentDialog(false)}>Save Payment</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Billed</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  Rs. {(totalAmount / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="p-3 rounded-lg bg-accent text-chart-1">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Received</p>
                <p className="text-2xl font-bold text-success mt-1">
                  Rs. {(totalPaid / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((totalPaid / totalAmount) * 100).toFixed(0)}% collected
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success/10 text-success">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning mt-1">
                  Rs. {(totalPending / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">Outstanding dues</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 text-warning">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold text-chart-5 mt-1">
                  Rs. {(totalExpenses / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total spent</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-5/10 text-chart-5">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Payment Status Overview</CardTitle>
            <CardDescription>Distribution of payment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Cases", color: "hsl(var(--chart-1))" },
              }}
              className="h-[200px]"
            >
              <BarChart data={paymentStatusData}>
                <XAxis
                  dataKey="status"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--chart-1))"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Monthly Summary</CardTitle>
            <CardDescription>This month&apos;s financial overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Income</span>
                <span className="font-medium text-success">
                  Rs. {(mockDashboardStats.monthlyIncome / 1000).toFixed(0)}K
                </span>
              </div>
              <Progress
                value={(mockDashboardStats.monthlyIncome / 1000000) * 100}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-medium text-chart-5">
                  Rs. {(mockDashboardStats.monthlyExpense / 1000).toFixed(0)}K
                </span>
              </div>
              <Progress
                value={(mockDashboardStats.monthlyExpense / 1000000) * 100}
                className="h-2 [&>div]:bg-chart-5"
              />
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">Net Profit</span>
                <span className="text-xl font-bold text-success">
                  Rs.{" "}
                  {(
                    (mockDashboardStats.monthlyIncome - mockDashboardStats.monthlyExpense) /
                    1000
                  ).toFixed(0)}
                  K
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filters:</span>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as "all" | "paid" | "partial" | "pending")
              }
            >
              <SelectTrigger className="w-[140px] bg-input">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={(v) =>
                setPriorityFilter(v as "all" | "high" | "medium" | "low")
              }
            >
              <SelectTrigger className="w-[140px] bg-input">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Payment Records</CardTitle>
          <CardDescription>All client payment information</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No payment records found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => {
                  const pendingAmount = payment.amount - payment.paidAmount
                  const progressPercent = (payment.paidAmount / payment.amount) * 100

                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <Link
                          href={`/cases/${payment.caseId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {payment.caseNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-foreground">{payment.clientName}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        Rs. {payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-success">
                        Rs. {payment.paidAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-warning">
                        Rs. {pendingAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(payment.dueDate).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell>{getPriorityBadge(payment.priority)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/cases/${payment.caseId}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Expenses</CardTitle>
            <CardDescription>Case-related expenses</CardDescription>
          </div>
          <Badge variant="outline">
            Total: Rs. {totalExpenses.toLocaleString()}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockExpenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-chart-5/10">
                    <FileText className="h-4 w-4 text-chart-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <span className="font-medium text-chart-5">
                  Rs. {expense.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
