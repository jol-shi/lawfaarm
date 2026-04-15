"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { mockUsers } from "@/lib/mock-data"
import type { CaseType } from "@/lib/types"

const courts = [
  "High Court Mumbai",
  "High Court Delhi",
  "Sessions Court Delhi",
  "District Court Lucknow",
  "Family Court Noida",
  "Commercial Court Bangalore",
  "Supreme Court",
  "Consumer Court",
]

export default function NewCasePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would create the case in the database
    router.push("/cases")
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Create New Case</h1>
          <p className="text-muted-foreground">Add a new case to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
            <CardDescription>Primary case details</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="caseNumber">Case Number *</FieldLabel>
                  <Input
                    id="caseNumber"
                    placeholder="e.g., CIV/2024/001"
                    required
                    className="bg-input"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="caseType">Case Type *</FieldLabel>
                  <Select required>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil</SelectItem>
                      <SelectItem value="criminal">Criminal</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="title">Case Title *</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g., Property Dispute - Sharma vs. Verma"
                  required
                  className="bg-input"
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="courtName">Court Name *</FieldLabel>
                  <Select required>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((court) => (
                        <SelectItem key={court} value={court}>
                          {court}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="filingDate">Filing Date *</FieldLabel>
                  <Input id="filingDate" type="date" required className="bg-input" />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="policeStation">Police Station (Thana)</FieldLabel>
                <Input
                  id="policeStation"
                  placeholder="e.g., Andheri PS"
                  className="bg-input"
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Client Information</CardTitle>
            <CardDescription>Details of your client</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="clientName">Client Name *</FieldLabel>
                  <Input
                    id="clientName"
                    placeholder="Full name"
                    required
                    className="bg-input"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="clientPhone">Phone Number *</FieldLabel>
                  <Input
                    id="clientPhone"
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className="bg-input"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="clientEmail">Email (Optional)</FieldLabel>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="email@example.com"
                  className="bg-input"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="clientAddress">Address *</FieldLabel>
                <Textarea
                  id="clientAddress"
                  placeholder="Complete address"
                  required
                  className="bg-input"
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Opponent Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Opponent Information</CardTitle>
            <CardDescription>Details of the opposing party (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="opponentName">Opponent Name</FieldLabel>
                  <Input id="opponentName" placeholder="Full name" className="bg-input" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="opponentPhone">Phone Number</FieldLabel>
                  <Input
                    id="opponentPhone"
                    placeholder="+91 XXXXX XXXXX"
                    className="bg-input"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="opponentAdvocate">Opponent&apos;s Advocate</FieldLabel>
                <Input
                  id="opponentAdvocate"
                  placeholder="Advocate name"
                  className="bg-input"
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Case Assignment</CardTitle>
            <CardDescription>Assign team members to this case</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {mockUsers.filter((u) => u.role !== "head_advocate").map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-accent/30 hover:bg-accent/50"
                  }`}
                  onClick={() => toggleUser(user.id)}
                >
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => toggleUser(user.id)}
                  />
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Payment Information</CardTitle>
            <CardDescription>Initial fee structure (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="totalFees">Total Fees (Rs.)</FieldLabel>
                  <Input
                    id="totalFees"
                    type="number"
                    placeholder="0"
                    className="bg-input"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="advancePayment">Advance Payment (Rs.)</FieldLabel>
                  <Input
                    id="advancePayment"
                    type="number"
                    placeholder="0"
                    className="bg-input"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="paymentPriority">Priority</FieldLabel>
                  <Select>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Tags</CardTitle>
            <CardDescription>Add tags for easy categorization</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="tags">Tags (comma-separated)</FieldLabel>
              <Input
                id="tags"
                placeholder="e.g., urgent, property, dispute"
                className="bg-input"
              />
            </Field>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/cases">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Case"}
          </Button>
        </div>
      </form>
    </div>
  )
}
