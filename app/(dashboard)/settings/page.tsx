"use client"

import { useState } from "react"
import {
  Settings,
  Building,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  MessageSquare,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  // Only admins can access
  if (user?.role !== "head_advocate") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Settings className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          You don&apos;t have permission to access settings.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your law chamber preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Chamber Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                Chamber Information
              </CardTitle>
              <CardDescription>Basic details about your law chamber</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="chamberName">Chamber Name</FieldLabel>
                  <Input
                    id="chamberName"
                    defaultValue="Kumar & Associates Law Chamber"
                    className="bg-input"
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                    <Input
                      id="phone"
                      defaultValue="+91 98765 43210"
                      className="bg-input"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="contact@lawchamber.com"
                      className="bg-input"
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Textarea
                    id="address"
                    defaultValue="123, Law Chambers Building, MG Road, Mumbai - 400001"
                    className="bg-input"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="barCouncil">Bar Council Registration</FieldLabel>
                  <Input
                    id="barCouncil"
                    defaultValue="MH/1234/2020"
                    className="bg-input"
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Regional Settings
              </CardTitle>
              <CardDescription>Language and format preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Language</FieldLabel>
                    <Select defaultValue="en">
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Date Format</FieldLabel>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Timezone</FieldLabel>
                  <Select defaultValue="ist">
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Hearing Reminders</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">1 day before hearing</p>
                      <p className="text-xs text-muted-foreground">
                        Receive reminder 24 hours before
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Same day morning</p>
                      <p className="text-xs text-muted-foreground">
                        Receive reminder at 8:00 AM
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">1 hour before hearing</p>
                      <p className="text-xs text-muted-foreground">
                        Last minute reminder
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Payment Reminders</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Payment due alerts</p>
                      <p className="text-xs text-muted-foreground">
                        Notify when payment is due
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Overdue payments</p>
                      <p className="text-xs text-muted-foreground">
                        Alert for overdue amounts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Notification Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">Email notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">SMS notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive updates via SMS
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">In-app notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Show notifications in app
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage account security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Password</h4>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Current Password</FieldLabel>
                    <Input type="password" className="bg-input" />
                  </Field>
                  <Field>
                    <FieldLabel>New Password</FieldLabel>
                    <Input type="password" className="bg-input" />
                  </Field>
                  <Field>
                    <FieldLabel>Confirm New Password</FieldLabel>
                    <Input type="password" className="bg-input" />
                  </Field>
                </FieldGroup>
                <Button variant="outline">Change Password</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">Enable 2FA</p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Session Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Auto logout</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically logout after inactivity
                      </p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[150px] bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                External Integrations
              </CardTitle>
              <CardDescription>Connect with external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">SMS Gateway</h4>
                <FieldGroup>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Provider</FieldLabel>
                      <Select defaultValue="msg91">
                        <SelectTrigger className="bg-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="msg91">MSG91</SelectItem>
                          <SelectItem value="twilio">Twilio</SelectItem>
                          <SelectItem value="textlocal">TextLocal</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>API Key</FieldLabel>
                      <Input type="password" placeholder="Enter API key" className="bg-input" />
                    </Field>
                  </div>
                </FieldGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Email Service</h4>
                <FieldGroup>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>SMTP Host</FieldLabel>
                      <Input placeholder="smtp.example.com" className="bg-input" />
                    </Field>
                    <Field>
                      <FieldLabel>SMTP Port</FieldLabel>
                      <Input placeholder="587" className="bg-input" />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Username</FieldLabel>
                      <Input placeholder="Email username" className="bg-input" />
                    </Field>
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <Input type="password" placeholder="Email password" className="bg-input" />
                    </Field>
                  </div>
                </FieldGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground">Backup Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Auto backup</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically backup data daily
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">Backup frequency</p>
                      <p className="text-xs text-muted-foreground">
                        How often to create backups
                      </p>
                    </div>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-[150px] bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
