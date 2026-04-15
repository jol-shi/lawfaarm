"use client"

import { useState } from "react"
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Calendar, 
  CreditCard, 
  FileText, 
  AlertTriangle,
  Info,
  Trash2,
  Filter
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockNotifications } from "@/lib/mock-data"
import type { Notification } from "@/lib/types"
import { cn } from "@/lib/utils"

const typeIcons: Record<Notification["type"], React.ReactNode> = {
  hearing: <Calendar className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
  case_update: <FileText className="h-4 w-4" />,
  deadline: <AlertTriangle className="h-4 w-4" />,
  system: <Info className="h-4 w-4" />,
}

const typeColors: Record<Notification["type"], string> = {
  hearing: "bg-chart-2/20 text-chart-2",
  payment: "bg-success/20 text-success",
  case_update: "bg-primary/20 text-primary",
  deadline: "bg-warning/20 text-warning",
  system: "bg-muted text-muted-foreground",
}

const priorityColors: Record<Notification["priority"], string> = {
  high: "bg-destructive/20 text-destructive",
  medium: "bg-warning/20 text-warning",
  low: "bg-muted text-muted-foreground",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<"all" | Notification["type"]>("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter((n) => n.type === filter)

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with case hearings, payments, and deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("hearing")}>
                Hearings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("payment")}>
                Payments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("case_update")}>
                Case Updates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("deadline")}>
                Deadlines
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Stats Cards */}
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hearings</p>
                <p className="text-2xl font-bold text-foreground">
                  {notifications.filter((n) => n.type === "hearing").length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Calendar className="h-5 w-5 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deadlines</p>
                <p className="text-2xl font-bold text-foreground">
                  {notifications.filter((n) => n.type === "deadline").length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payments</p>
                <p className="text-2xl font-bold text-foreground">
                  {notifications.filter((n) => n.type === "payment").length}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CreditCard className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <NotificationsList 
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          <NotificationsList 
            notifications={filteredNotifications.filter((n) => !n.read)}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="high" className="mt-4">
          <NotificationsList 
            notifications={filteredNotifications.filter((n) => n.priority === "high")}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationsList({
  notifications,
  onMarkAsRead,
  onDelete,
  formatDate,
}: {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  formatDate: (date: string) => string
}) {
  if (notifications.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No notifications to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-4 p-4 transition-colors hover:bg-accent/50",
                !notification.read && "bg-primary/5"
              )}
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", typeColors[notification.type])}>
                {typeIcons[notification.type]}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={cn(
                        "text-sm",
                        !notification.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                      )}>
                        {notification.title}
                      </h4>
                      <Badge variant="outline" className={cn("text-xs", priorityColors[notification.priority])}>
                        {notification.priority}
                      </Badge>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(notification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
