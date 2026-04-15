"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Plus,
  Clock,
  Download,
  IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { useAuth } from "@/lib/auth-context"
import { mockCases, getUserById, getExpensesByCaseId, getPaymentsByCaseId } from "@/lib/mock-data"
import type { Case, CaseHistoryEntry } from "@/lib/types"

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [showAddHistoryDialog, setShowAddHistoryDialog] = useState(false)

  const caseData = mockCases.find((c) => c.id === id)
  const expenses = getExpensesByCaseId(id)
  const payment = getPaymentsByCaseId(id)

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Case Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The case you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/cases">Back to Cases</Link>
        </Button>
      </div>
    )
  }

  const isAdmin = user?.role === "head_advocate"
  const canEdit = isAdmin || caseData.assignedTo.includes(user?.id || "")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
      case "disposed":
        return <Badge variant="outline">Disposed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCaseTypeBadge = (type: string) => {
    switch (type) {
      case "civil":
        return <Badge variant="outline" className="border-chart-1 text-chart-1">Civil</Badge>
      case "criminal":
        return <Badge variant="outline" className="border-chart-2 text-chart-2">Criminal</Badge>
      case "family":
        return <Badge variant="outline" className="border-chart-3 text-chart-3">Family</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{caseData.caseNumber}</h1>
              {getStatusBadge(caseData.status)}
              {getCaseTypeBadge(caseData.caseType)}
            </div>
            <p className="text-muted-foreground mt-1">{caseData.title}</p>
          </div>
        </div>
        {canEdit && (
          <Button variant="outline" asChild>
            <Link href={`/cases/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Case
            </Link>
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Next Hearing</p>
              <p className="font-medium text-foreground">
                {caseData.nextHearingDate
                  ? new Date(caseData.nextHearingDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Not scheduled"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-2/10">
              <MapPin className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Court</p>
              <p className="font-medium text-foreground truncate max-w-[150px]">
                {caseData.courtName}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <IndianRupee className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="font-medium text-foreground">
                Rs. {totalExpenses.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <Clock className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Filed On</p>
              <p className="font-medium text-foreground">
                {new Date(caseData.filingDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Case History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Client Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium text-foreground">{caseData.client.name}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone
                  </span>
                  <span className="text-foreground">{caseData.client.phone}</span>
                </div>
                {caseData.client.email && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </span>
                      <span className="text-foreground">{caseData.client.email}</span>
                    </div>
                  </>
                )}
                <Separator />
                <div>
                  <span className="text-muted-foreground">Address</span>
                  <p className="text-foreground mt-1">{caseData.client.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Opponent Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-chart-5" />
                  Opponent Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {caseData.opponent ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-foreground">{caseData.opponent.name}</span>
                    </div>
                    {caseData.opponent.phone && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Phone
                          </span>
                          <span className="text-foreground">{caseData.opponent.phone}</span>
                        </div>
                      </>
                    )}
                    {caseData.opponent.advocateName && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Advocate</span>
                          <span className="text-foreground">{caseData.opponent.advocateName}</span>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No opponent information available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Case Details */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Case Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Court Name</span>
                  <span className="text-foreground">{caseData.courtName}</span>
                </div>
                <Separator />
                {caseData.policeStation && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Police Station</span>
                      <span className="text-foreground">{caseData.policeStation}</span>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Filing Date</span>
                  <span className="text-foreground">
                    {new Date(caseData.filingDate).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-foreground">
                    {new Date(caseData.updatedAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Team */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Assigned Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {caseData.assignedTo.map((userId) => {
                    const assignedUser = getUserById(userId)
                    if (!assignedUser) return null
                    return (
                      <div
                        key={userId}
                        className="flex items-center gap-3 rounded-lg border border-border bg-accent/30 p-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                          {assignedUser.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{assignedUser.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {assignedUser.role.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {caseData.tags && caseData.tags.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {caseData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Case Timeline</CardTitle>
                <CardDescription>Complete history and updates</CardDescription>
              </div>
              {canEdit && (
                <Dialog open={showAddHistoryDialog} onOpenChange={setShowAddHistoryDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Case Update</DialogTitle>
                      <DialogDescription>
                        Add a new entry to the case timeline
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Date</FieldLabel>
                        <Input type="date" className="bg-input" />
                      </Field>
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea placeholder="What happened?" className="bg-input" />
                      </Field>
                      <Field>
                        <FieldLabel>Next Hearing Date (Optional)</FieldLabel>
                        <Input type="date" className="bg-input" />
                      </Field>
                      <Field>
                        <FieldLabel>Expense (Optional)</FieldLabel>
                        <Input type="number" placeholder="0" className="bg-input" />
                      </Field>
                    </FieldGroup>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setShowAddHistoryDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowAddHistoryDialog(false)}>Save Update</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border">
                {caseData.history
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry, index) => {
                    const addedByUser = getUserById(entry.addedBy)
                    return (
                      <div key={entry.id} className="relative">
                        <div className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-primary border-2 border-background" />
                        <div className="rounded-lg border border-border bg-accent/30 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {new Date(entry.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                            {entry.expense && (
                              <Badge variant="outline" className="text-warning border-warning">
                                Rs. {entry.expense.toLocaleString()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-foreground">{entry.description}</p>
                          {entry.nextHearingDate && (
                            <p className="text-sm text-primary mt-2">
                              Next hearing: {new Date(entry.nextHearingDate).toLocaleDateString("en-IN")}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Added by {addedByUser?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Documents</CardTitle>
                <CardDescription>Case related files and attachments</CardDescription>
              </div>
              {canEdit && (
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {caseData.documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {caseData.documents.map((doc) => {
                    const uploadedBy = getUserById(doc.uploadedBy)
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded on {new Date(doc.uploadedAt).toLocaleDateString("en-IN")} by{" "}
                              {uploadedBy?.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Payment Summary */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payment ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-medium text-foreground">
                        Rs. {payment.amount.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Paid Amount</span>
                      <span className="font-medium text-success">
                        Rs. {payment.paidAmount.toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-medium text-warning">
                        Rs. {(payment.amount - payment.paidAmount).toLocaleString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="text-foreground">
                        {new Date(payment.dueDate).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No payment records found
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Expenses */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Expenses</CardTitle>
                <Badge variant="outline">Total: Rs. {totalExpenses.toLocaleString()}</Badge>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No expenses recorded</p>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((expense) => {
                      const addedBy = getUserById(expense.addedBy)
                      return (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-3"
                        >
                          <div>
                            <p className="font-medium text-foreground">{expense.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString("en-IN")} by{" "}
                              {addedBy?.name || "Unknown"}
                            </p>
                          </div>
                          <span className="font-medium text-warning">
                            Rs. {expense.amount.toLocaleString()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          {payment && payment.transactions.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payment.transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-success/10">
                          <IndianRupee className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Rs. {transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.method} - {transaction.notes}
                          </p>
                        </div>
                      </div>
                      <span className="text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
