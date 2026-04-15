"use client"

import Link from "next/link"
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getCasesByUserId, getCauseListByUserId } from "@/lib/mock-data"

export function InternDashboard() {
  const { user } = useAuth()

  if (!user) return null

  const myCases = getCasesByUserId(user.id)
  const mySchedule = getCauseListByUserId(user.id)

  // Group hearings by date
  const todayStr = new Date().toISOString().split("T")[0]
  const todayHearings = mySchedule.filter((h) => h.hearingDate === todayStr)
  const upcomingHearings = mySchedule.filter((h) => h.hearingDate > todayStr)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">Your daily schedule and assigned tasks.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today&apos;s Hearings</p>
                <p className="text-2xl font-bold text-foreground mt-1">{todayHearings.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Courts to attend</p>
              </div>
              <div className="p-3 rounded-lg bg-accent text-chart-1">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Cases</p>
                <p className="text-2xl font-bold text-foreground mt-1">{myCases.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total assigned</p>
              </div>
              <div className="p-3 rounded-lg bg-accent text-chart-2">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-foreground mt-1">{upcomingHearings.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Scheduled hearings</p>
              </div>
              <div className="p-3 rounded-lg bg-accent text-warning">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Schedule - Today */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            My Schedule - Today
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayHearings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hearings scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayHearings.map((hearing) => (
                <div
                  key={hearing.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-primary/5 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{hearing.caseNumber}</p>
                      <p className="text-sm text-muted-foreground">{hearing.caseTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-foreground">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {hearing.courtName}
                    </div>
                    <p className="text-sm text-primary font-medium">{hearing.hearingTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Hearings */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Upcoming Hearings</CardTitle>
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
            {upcomingHearings.slice(0, 5).map((hearing) => (
              <div
                key={hearing.id}
                className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
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
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {hearing.caseTitle}
                    </p>
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

      {/* Assigned Cases */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">My Assigned Cases</CardTitle>
            <CardDescription>Cases you are working on</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cases" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myCases.slice(0, 4).map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-4 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{caseItem.caseNumber}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                    {caseItem.title}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      caseItem.caseType === "civil"
                        ? "border-chart-1 text-chart-1"
                        : caseItem.caseType === "criminal"
                        ? "border-chart-2 text-chart-2"
                        : "border-chart-3 text-chart-3"
                    }
                  >
                    {caseItem.caseType}
                  </Badge>
                  {caseItem.nextHearingDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Next: {new Date(caseItem.nextHearingDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
