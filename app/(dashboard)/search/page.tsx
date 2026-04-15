"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  Search, 
  FileText, 
  Users, 
  CreditCard, 
  Calendar,
  ArrowRight,
  Filter
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockCases, mockUsers, mockPayments, mockCauseList } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type SearchCategory = "all" | "cases" | "clients" | "payments" | "hearings"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<SearchCategory>("all")

  const results = useMemo(() => {
    if (!query.trim()) {
      return { cases: [], clients: [], payments: [], hearings: [], total: 0 }
    }

    const lowerQuery = query.toLowerCase()

    const cases = mockCases.filter(
      (c) =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.caseNumber.toLowerCase().includes(lowerQuery) ||
        c.clientName.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
    )

    const clients = [...new Set(mockCases.map((c) => c.clientName))]
      .filter((name) => name.toLowerCase().includes(lowerQuery))
      .map((name) => {
        const clientCases = mockCases.filter((c) => c.clientName === name)
        return {
          name,
          caseCount: clientCases.length,
          totalDue: clientCases.reduce((sum, c) => sum + c.pendingAmount, 0),
        }
      })

    const payments = mockPayments.filter(
      (p) =>
        p.caseTitle.toLowerCase().includes(lowerQuery) ||
        p.clientName.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    )

    const hearings = mockCauseList.filter(
      (h) =>
        h.caseTitle.toLowerCase().includes(lowerQuery) ||
        h.caseNumber.toLowerCase().includes(lowerQuery) ||
        h.court.toLowerCase().includes(lowerQuery) ||
        h.clientName.toLowerCase().includes(lowerQuery)
    )

    return {
      cases,
      clients,
      payments,
      hearings,
      total: cases.length + clients.length + payments.length + hearings.length,
    }
  }, [query])

  const statusColors: Record<string, string> = {
    active: "bg-success/20 text-success",
    pending: "bg-warning/20 text-warning",
    disposed: "bg-muted text-muted-foreground",
    won: "bg-primary/20 text-primary",
    lost: "bg-destructive/20 text-destructive",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Search</h1>
        <p className="text-muted-foreground">
          Search across cases, clients, payments, and hearings
        </p>
      </div>

      {/* Search Bar */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by case number, client name, court..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 bg-input"
              />
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v as SearchCategory)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-input">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cases">Cases</SelectItem>
                <SelectItem value="clients">Clients</SelectItem>
                <SelectItem value="payments">Payments</SelectItem>
                <SelectItem value="hearings">Hearings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {query.trim() ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-medium text-foreground">{results.total}</span> results for{" "}
              <span className="font-medium text-foreground">&quot;{query}&quot;</span>
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-secondary">
              <TabsTrigger value="all">All ({results.total})</TabsTrigger>
              <TabsTrigger value="cases">Cases ({results.cases.length})</TabsTrigger>
              <TabsTrigger value="clients">Clients ({results.clients.length})</TabsTrigger>
              <TabsTrigger value="payments">Payments ({results.payments.length})</TabsTrigger>
              <TabsTrigger value="hearings">Hearings ({results.hearings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-6">
              {results.cases.length > 0 && (
                <ResultSection title="Cases" icon={<FileText className="h-4 w-4" />} count={results.cases.length}>
                  {results.cases.slice(0, 3).map((caseItem) => (
                    <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{caseItem.title}</h4>
                            <Badge variant="outline" className={cn("text-xs", statusColors[caseItem.status])}>
                              {caseItem.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {caseItem.caseNumber} | {caseItem.clientName}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </ResultSection>
              )}

              {results.clients.length > 0 && (
                <ResultSection title="Clients" icon={<Users className="h-4 w-4" />} count={results.clients.length}>
                  {results.clients.slice(0, 3).map((client) => (
                    <div key={client.name} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{client.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {client.caseCount} case{client.caseCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      {client.totalDue > 0 && (
                        <Badge variant="outline" className="bg-warning/20 text-warning">
                          Due: Rs. {client.totalDue.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  ))}
                </ResultSection>
              )}

              {results.hearings.length > 0 && (
                <ResultSection title="Upcoming Hearings" icon={<Calendar className="h-4 w-4" />} count={results.hearings.length}>
                  {results.hearings.slice(0, 3).map((hearing) => (
                    <div key={hearing.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{hearing.caseTitle}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {hearing.caseNumber} | {hearing.court}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(hearing.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })} at {hearing.time}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn("text-xs", 
                        hearing.status === "scheduled" ? "bg-chart-2/20 text-chart-2" : "bg-muted text-muted-foreground"
                      )}>
                        {hearing.status}
                      </Badge>
                    </div>
                  ))}
                </ResultSection>
              )}

              {results.payments.length > 0 && (
                <ResultSection title="Payments" icon={<CreditCard className="h-4 w-4" />} count={results.payments.length}>
                  {results.payments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{payment.caseTitle}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {payment.clientName} | {payment.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">Rs. {payment.amount.toLocaleString()}</p>
                        <Badge variant="outline" className={cn("text-xs mt-1",
                          payment.status === "received" ? "bg-success/20 text-success" : 
                          payment.status === "pending" ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"
                        )}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </ResultSection>
              )}
            </TabsContent>

            <TabsContent value="cases" className="mt-4">
              <div className="space-y-3">
                {results.cases.map((caseItem) => (
                  <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{caseItem.title}</h4>
                          <Badge variant="outline" className={cn("text-xs", statusColors[caseItem.status])}>
                            {caseItem.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {caseItem.caseNumber} | {caseItem.clientName} | {caseItem.court}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
                {results.cases.length === 0 && (
                  <EmptyState message="No cases found matching your search" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="clients" className="mt-4">
              <div className="space-y-3">
                {results.clients.map((client) => (
                  <div key={client.name} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{client.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {client.caseCount} case{client.caseCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    {client.totalDue > 0 && (
                      <Badge variant="outline" className="bg-warning/20 text-warning">
                        Due: Rs. {client.totalDue.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                ))}
                {results.clients.length === 0 && (
                  <EmptyState message="No clients found matching your search" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-4">
              <div className="space-y-3">
                {results.payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{payment.caseTitle}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {payment.clientName} | {payment.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(payment.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">Rs. {payment.amount.toLocaleString()}</p>
                      <Badge variant="outline" className={cn("text-xs mt-1",
                        payment.status === "received" ? "bg-success/20 text-success" : 
                        payment.status === "pending" ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"
                      )}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {results.payments.length === 0 && (
                  <EmptyState message="No payments found matching your search" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="hearings" className="mt-4">
              <div className="space-y-3">
                {results.hearings.map((hearing) => (
                  <div key={hearing.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{hearing.caseTitle}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {hearing.caseNumber} | {hearing.court}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(hearing.date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })} at {hearing.time}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", 
                      hearing.status === "scheduled" ? "bg-chart-2/20 text-chart-2" : "bg-muted text-muted-foreground"
                    )}>
                      {hearing.status}
                    </Badge>
                  </div>
                ))}
                {results.hearings.length === 0 && (
                  <EmptyState message="No hearings found matching your search" />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Start searching</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Enter a case number, client name, court, or any keyword to search across all your data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ResultSection({
  title,
  icon,
  count,
  children,
}: {
  title: string
  icon: React.ReactNode
  count: number
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <h3 className="font-medium text-foreground">{title}</h3>
          <Badge variant="secondary" className="text-xs">{count}</Badge>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View all
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
