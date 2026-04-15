"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Calendar,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { mockCauseList, getCauseListByUserId, getUserById } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function CauseListPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [courtFilter, setCourtFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  const isAdmin = user?.role === "head_advocate"

  // Get cause list based on role
  const baseCauseList = isAdmin ? mockCauseList : user ? getCauseListByUserId(user.id) : []

  // Get unique courts
  const courts = useMemo(() => {
    const courtSet = new Set(baseCauseList.map((c) => c.courtName))
    return Array.from(courtSet)
  }, [baseCauseList])

  // Filter by court
  const filteredCauseList = useMemo(() => {
    return baseCauseList.filter((c) => {
      const matchesCourt = courtFilter === "all" || c.courtName === courtFilter
      return matchesCourt
    })
  }, [baseCauseList, courtFilter])

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof filteredCauseList> = {}
    filteredCauseList.forEach((item) => {
      if (!groups[item.hearingDate]) {
        groups[item.hearingDate] = []
      }
      groups[item.hearingDate].push(item)
    })
    return groups
  }, [filteredCauseList])

  // Get today's hearings
  const todayStr = new Date().toISOString().split("T")[0]
  const todayHearings = filteredCauseList.filter((c) => c.hearingDate === todayStr)

  // Navigate dates
  const navigateDate = (direction: "prev" | "next") => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(date.toISOString().split("T")[0])
  }

  const getAssignedUsers = (assignedTo: string[]) => {
    return assignedTo.map((id) => getUserById(id)).filter(Boolean)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Cause List</h1>
          <p className="text-muted-foreground">
            Digital Lal Khata - Daily court schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Today's Quick Summary */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {todayHearings.length} hearing{todayHearings.length !== 1 ? "s" : ""} scheduled
                  today
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {courts.slice(0, 3).map((court) => {
                const count = todayHearings.filter((h) => h.courtName === court).length
                if (count === 0) return null
                return (
                  <Badge key={court} variant="secondary" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {court}: {count}
                  </Badge>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground"
              />
              <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(todayStr)}
                className="ml-2"
              >
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={courtFilter} onValueChange={setCourtFilter}>
                <SelectTrigger className="w-[200px] bg-input">
                  <SelectValue placeholder="Filter by court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courts</SelectItem>
                  {courts.map((court) => (
                    <SelectItem key={court} value={court}>
                      {court}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "calendar")}>
        <TabsList className="bg-muted">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Date-wise Cause List */}
          {Object.keys(groupedByDate)
            .sort()
            .map((date) => {
              const hearings = groupedByDate[date]
              const isToday = date === todayStr
              const isPast = new Date(date) < new Date(todayStr)

              return (
                <Card
                  key={date}
                  className={cn(
                    "bg-card border-border",
                    isToday && "ring-2 ring-primary"
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {new Date(date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        {isToday && (
                          <Badge className="bg-primary text-primary-foreground ml-2">
                            Today
                          </Badge>
                        )}
                      </CardTitle>
                      <Badge variant="secondary">{hearings.length} cases</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Attended</TableHead>
                          <TableHead>Case Number</TableHead>
                          <TableHead>Case Title</TableHead>
                          <TableHead>Court</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Assigned To</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hearings.map((hearing) => {
                          const assignedUsers = getAssignedUsers(hearing.assignedTo)
                          return (
                            <TableRow key={hearing.id}>
                              <TableCell>
                                <Checkbox
                                  checked={hearing.attended}
                                  disabled={isPast}
                                />
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/cases/${hearing.caseId}`}
                                  className="font-medium text-primary hover:underline"
                                >
                                  {hearing.caseNumber}
                                </Link>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate text-foreground">
                                {hearing.caseTitle}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate max-w-[150px]">
                                    {hearing.courtName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-foreground">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  {hearing.hearingTime || "-"}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {assignedUsers.slice(0, 2).map((u) => (
                                    <div
                                      key={u!.id}
                                      className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium"
                                      title={u!.name}
                                    >
                                      {u!.name.charAt(0)}
                                    </div>
                                  ))}
                                  {assignedUsers.length > 2 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{assignedUsers.length - 2}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )
            })}

          {Object.keys(groupedByDate).length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No hearings scheduled</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          {/* Calendar View */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
                {/* Generate calendar days for current month */}
                {(() => {
                  const date = new Date(selectedDate)
                  const year = date.getFullYear()
                  const month = date.getMonth()
                  const firstDay = new Date(year, month, 1).getDay()
                  const daysInMonth = new Date(year, month + 1, 0).getDate()

                  const days = []

                  // Empty cells for days before month starts
                  for (let i = 0; i < firstDay; i++) {
                    days.push(<div key={`empty-${i}`} className="h-24" />)
                  }

                  // Days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                      day
                    ).padStart(2, "0")}`
                    const dayHearings = filteredCauseList.filter(
                      (c) => c.hearingDate === dateStr
                    )
                    const isSelected = dateStr === selectedDate
                    const isCurrentDay = dateStr === todayStr

                    days.push(
                      <div
                        key={day}
                        className={cn(
                          "h-24 rounded-lg border border-border p-2 cursor-pointer transition-colors hover:bg-accent/50",
                          isSelected && "ring-2 ring-primary",
                          isCurrentDay && "bg-primary/5"
                        )}
                        onClick={() => setSelectedDate(dateStr)}
                      >
                        <div
                          className={cn(
                            "text-sm font-medium",
                            isCurrentDay ? "text-primary" : "text-foreground"
                          )}
                        >
                          {day}
                        </div>
                        {dayHearings.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {dayHearings.slice(0, 2).map((h) => (
                              <div
                                key={h.id}
                                className="text-xs truncate rounded bg-primary/10 px-1 py-0.5 text-primary"
                              >
                                {h.caseNumber}
                              </div>
                            ))}
                            {dayHearings.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{dayHearings.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return days
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          {groupedByDate[selectedDate] && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">
                  Hearings on{" "}
                  {new Date(selectedDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedByDate[selectedDate].map((hearing) => {
                    const assignedUsers = getAssignedUsers(hearing.assignedTo)
                    return (
                      <Link
                        key={hearing.id}
                        href={`/cases/${hearing.caseId}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{hearing.caseNumber}</p>
                            <p className="text-sm text-muted-foreground">{hearing.caseTitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{hearing.hearingTime}</p>
                          <p className="text-sm text-muted-foreground">{hearing.courtName}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Court-wise Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Court-wise Attendance Summary</CardTitle>
          <CardDescription>Overview of hearings by court location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courts.map((court) => {
              const courtHearings = filteredCauseList.filter((h) => h.courtName === court)
              const attended = courtHearings.filter((h) => h.attended).length

              return (
                <div
                  key={court}
                  className="flex items-center justify-between rounded-lg border border-border bg-accent/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-chart-2/10">
                      <MapPin className="h-4 w-4 text-chart-2" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground truncate max-w-[120px]">
                        {court}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {courtHearings.length} hearing{courtHearings.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">{attended}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">attended</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
