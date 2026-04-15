"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { useAuth } from "@/lib/auth-context"
import { mockUsers, getCasesByUserId } from "@/lib/mock-data"
import type { UserRole } from "@/lib/types"

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

  // Only admins can access this page
  if (user?.role !== "head_advocate") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          You don&apos;t have permission to access this page.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    )
  }

  // Filter users
  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      searchQuery === "" ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "head_advocate":
        return (
          <Badge className="bg-primary text-primary-foreground gap-1">
            <Shield className="h-3 w-3" />
            Head Advocate
          </Badge>
        )
      case "associate":
        return (
          <Badge className="bg-chart-2 text-chart-2-foreground gap-1">
            <Briefcase className="h-3 w-3" />
            Associate
          </Badge>
        )
      case "intern":
        return (
          <Badge variant="secondary" className="gap-1">
            <GraduationCap className="h-3 w-3" />
            Intern
          </Badge>
        )
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "head_advocate":
        return Shield
      case "associate":
        return Briefcase
      case "intern":
        return GraduationCap
      default:
        return Users
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Stats
  const headAdvocates = mockUsers.filter((u) => u.role === "head_advocate").length
  const associates = mockUsers.filter((u) => u.role === "associate").length
  const interns = mockUsers.filter((u) => u.role === "intern").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage team members and their roles</p>
        </div>
        <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new team member account</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input placeholder="e.g., Adv. John Doe" className="bg-input" />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" placeholder="email@lawchamber.com" className="bg-input" />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input placeholder="+91 XXXXX XXXXX" className="bg-input" />
              </Field>
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select>
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="associate">Associate Advocate</SelectItem>
                    <SelectItem value="intern">Intern (Trainee)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input type="password" placeholder="Temporary password" className="bg-input" />
              </Field>
            </FieldGroup>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddUserDialog(false)}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Head Advocates</p>
                <p className="text-2xl font-bold text-foreground mt-1">{headAdvocates}</p>
                <p className="text-xs text-muted-foreground mt-1">Admin access</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Associates</p>
                <p className="text-2xl font-bold text-foreground mt-1">{associates}</p>
                <p className="text-xs text-muted-foreground mt-1">Case handlers</p>
              </div>
              <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interns</p>
                <p className="text-2xl font-bold text-foreground mt-1">{interns}</p>
                <p className="text-xs text-muted-foreground mt-1">Trainees</p>
              </div>
              <div className="p-3 rounded-lg bg-accent text-muted-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-input"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as UserRole | "all")}
            >
              <SelectTrigger className="w-[180px] bg-input">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="head_advocate">Head Advocate</SelectItem>
                <SelectItem value="associate">Associate</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Cases</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((teamUser) => {
                  const userCases = getCasesByUserId(teamUser.id)
                  const RoleIcon = getRoleIcon(teamUser.role)

                  return (
                    <TableRow key={teamUser.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(teamUser.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{teamUser.name}</p>
                            <p className="text-sm text-muted-foreground">{teamUser.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {teamUser.phone || "-"}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {teamUser.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(teamUser.role)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{userCases.length} cases</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(teamUser.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Briefcase className="mr-2 h-4 w-4" />
                              View Cases
                            </DropdownMenuItem>
                            {teamUser.role !== "head_advocate" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove User
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Role Permissions</CardTitle>
          <CardDescription>Overview of access levels for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-accent/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Head Advocate</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Full system control</li>
                <li>Manage all cases</li>
                <li>Create/delete users</li>
                <li>Access reports & analytics</li>
                <li>Manage payments</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-accent/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Briefcase className="h-4 w-4 text-chart-2" />
                </div>
                <span className="font-medium text-foreground">Associate</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>View assigned cases</li>
                <li>Update case progress</li>
                <li>Monitor intern activities</li>
                <li>Access court schedules</li>
                <li>View client info</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-accent/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-accent">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground">Intern</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>View assigned cases</li>
                <li>Update hearing dates</li>
                <li>Record case expenses</li>
                <li>View daily schedule</li>
                <li>Limited access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
