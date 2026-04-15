export type UserRole = "head_advocate" | "associate" | "intern"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: string
}

export type CaseType = "civil" | "criminal" | "family"
export type CaseStatus = "active" | "pending" | "closed" | "disposed"
export type PaymentPriority = "high" | "medium" | "low"

export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address: string
}

export interface Opponent {
  id: string
  name: string
  phone?: string
  advocateName?: string
}

export interface CaseHistoryEntry {
  id: string
  date: string
  description: string
  nextHearingDate?: string
  expense?: number
  addedBy: string
}

export interface Case {
  id: string
  caseNumber: string
  title: string
  client: Client
  opponent?: Opponent
  courtName: string
  policeStation?: string
  caseType: CaseType
  status: CaseStatus
  filingDate: string
  nextHearingDate?: string
  assignedTo: string[]
  history: CaseHistoryEntry[]
  documents: Document[]
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: string
  uploadedBy: string
}

export interface Payment {
  id: string
  caseId: string
  caseNumber: string
  clientName: string
  amount: number
  paidAmount: number
  dueDate: string
  priority: PaymentPriority
  status: "paid" | "partial" | "pending"
  transactions: PaymentTransaction[]
}

export interface PaymentTransaction {
  id: string
  amount: number
  date: string
  method: string
  notes?: string
}

export interface Expense {
  id: string
  caseId: string
  description: string
  amount: number
  date: string
  addedBy: string
}

export interface CauseListEntry {
  id: string
  caseId: string
  caseNumber: string
  caseTitle: string
  courtName: string
  hearingDate: string
  hearingTime?: string
  assignedTo: string[]
  attended: boolean
  attendedBy?: string[]
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "reminder" | "info" | "warning" | "success"
  read: boolean
  createdAt: string
  link?: string
}

export interface DashboardStats {
  totalCasesToday: number
  totalActiveCases: number
  pendingPayments: number
  upcomingHearings: number
  courtWiseSummary: { court: string; count: number }[]
  caseTypeDistribution: { type: CaseType; count: number }[]
  monthlyIncome: number
  monthlyExpense: number
}
