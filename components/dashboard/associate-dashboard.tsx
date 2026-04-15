"use client"

import Link from "next/link"
import { Briefcase, Calendar, Clock, ArrowRight, FileText } from "lucide-react"
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
import { useAuth } from "@/lib/auth-context"
import { getCasesByUserId, getCauseListByUserId, mockPayments, getUserById } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function AssociateDashboard() {
  const { user } = useAuth()

  if (!user) return null

  const myCases = getCasesByUserId(user.id)
  const myHearings = getCauseListByUserId(user.id)
  const activeCases = myCases.filter((c) => c.status === "active")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Your assigned cases and upcoming hearings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">My Cases</p>
                <p className="text-2xl font-bold text-foreground mt-1">{myCases.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total assigned</p>
              </div>
              <div className="p-3 rounded-lg bg-accent text-chart-1">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                <p className="text-2xl font-bold text-foreground mt-1">{activeCases.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Currently working</p>
              </div>
              <div className="p-3 rounded-lg bg-accent text-success">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Hearings</p>
                <p className="text-2xl font-bold text-foreground mt-1">{myHearings.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
              </div>
              <div className="p-3 rounded-lg bg-accent text-chart-2">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Cases Table */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">My Cases</CardTitle>
            <CardDescription>Cases assigned to you</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cases" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Next Hearing</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myCases.slice(0, 5).map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>
                    <Link
                      href={`/cases/${caseItem.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {caseItem.caseNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-foreground">
                    {caseItem.title}
                  </TableCell>
                  <TableCell>{getCaseTypeBadge(caseItem.caseType)}</TableCell>
                  <TableCell className="text-muted-foreground">{caseItem.courtName}</TableCell>
                  <TableCell>
                    {caseItem.nextHearingDate ? (
                      <span className="text-foreground">
                        {new Date(caseItem.nextHearingDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming Hearings */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">My Upcoming Hearings</CardTitle>
            <CardDescription>Your scheduled court appearances</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cause-list" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myHearings.slice(0, 4).map((hearing) => (
              <div
                key={hearing.id}
                className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-lg font-bold">
                      {new Date(hearing.hearingDate).getDate()}
                    </span>
                    <span className="text-xs">
                      {new Date(hearing.hearingDate).toLocaleDateString("en-IN", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{hearing.caseNumber}</p>
                    <p className="text-sm text-muted-foreground">{hearing.caseTitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{hearing.courtName}</p>
                  <p className="text-sm text-muted-foreground">{hearing.hearingTime}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
