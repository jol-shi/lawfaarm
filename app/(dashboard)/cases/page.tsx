"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { mockCases, getCasesByUserId, getUserById } from "@/lib/mock-data"
import type { Case, CaseType, CaseStatus } from "@/lib/types"

export default function CasesPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [typeFilter, setTypeFilter] = useState<CaseType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all")
  const [courtFilter, setCourtFilter] = useState("all")

  const isAdmin = user?.role === "head_advocate"

  // Get cases based on role
  const baseCases = isAdmin ? mockCases : user ? getCasesByUserId(user.id) : []

  // Get unique courts for filter
  const courts = useMemo(() => {
    const courtSet = new Set(baseCases.map((c) => c.courtName))
    return Array.from(courtSet)
  }, [baseCases])

  // Filter cases
  const filteredCases = useMemo(() => {
    return baseCases.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client.phone.includes(searchQuery) ||
        (c.policeStation?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

      const matchesType = typeFilter === "all" || c.caseType === typeFilter
      const matchesStatus = statusFilter === "all" || c.status === statusFilter
      const matchesCourt = courtFilter === "all" || c.courtName === courtFilter

      return matchesSearch && matchesType && matchesStatus && matchesCourt
    })
  }, [baseCases, searchQuery, typeFilter, statusFilter, courtFilter])

  const getStatusBadge = (status: CaseStatus) => {
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

  const getCaseTypeBadge = (type: CaseType) => {
    switch (type) {
      case "civil":
        return (
          <Badge variant="outline" className="border-chart-1 text-chart-1">
            Civil
          </Badge>
        )
      case "criminal":
        return (
          <Badge variant="outline" className="border-chart-2 text-chart-2">
            Criminal
          </Badge>
        )
      case "family":
        return (
          <Badge variant="outline" className="border-chart-3 text-chart-3">
            Family
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getAssignedUsers = (assignedTo: string[]) => {
    return assignedTo
      .map((id) => getUserById(id))
      .filter(Boolean)
      .map((u) => u!.name.split(" ")[0])
      .join(", ")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Cases</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Manage all cases" : "Your assigned cases"}
          </p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by case number, title, client, phone, or thana..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as CaseType | "all")}>
                <SelectTrigger className="w-[130px] bg-input">
                  <SelectValue placeholder="Case Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                  <SelectItem value="criminal">Criminal</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as CaseStatus | "all")}>
                <SelectTrigger className="w-[130px] bg-input">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={courtFilter} onValueChange={setCourtFilter}>
                <SelectTrigger className="w-[180px] bg-input">
                  <SelectValue placeholder="Court" />
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

      {/* Cases Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Next Hearing</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No cases found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((caseItem) => (
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
                    <TableCell>
                      <div>
                        <p className="text-foreground">{caseItem.client.name}</p>
                        <p className="text-xs text-muted-foreground">{caseItem.client.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getCaseTypeBadge(caseItem.caseType)}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[150px] truncate">
                      {caseItem.courtName}
                    </TableCell>
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
                    <TableCell className="text-muted-foreground max-w-[120px] truncate">
                      {getAssignedUsers(caseItem.assignedTo)}
                    </TableCell>
                    <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/cases/${caseItem.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link href={`/cases/${caseItem.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Case
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Case
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredCases.length} of {baseCases.length} cases
        </p>
        <div className="flex gap-4">
          <span>
            Active: {filteredCases.filter((c) => c.status === "active").length}
          </span>
          <span>
            Pending: {filteredCases.filter((c) => c.status === "pending").length}
          </span>
          <span>
            Closed: {filteredCases.filter((c) => c.status === "closed").length}
          </span>
        </div>
      </div>
    </div>
  )
}
