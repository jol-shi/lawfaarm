import type {
  User,
  Case,
  Payment,
  CauseListEntry,
  Notification,
  DashboardStats,
  Expense,
} from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Adv. Rajesh Kumar",
    email: "rajesh@lawchamber.com",
    role: "head_advocate",
    phone: "+91 98765 43210",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Adv. Priya Sharma",
    email: "priya@lawchamber.com",
    role: "associate",
    phone: "+91 98765 43211",
    createdAt: "2023-03-20",
  },
  {
    id: "3",
    name: "Adv. Amit Singh",
    email: "amit@lawchamber.com",
    role: "associate",
    phone: "+91 98765 43212",
    createdAt: "2023-06-10",
  },
  {
    id: "4",
    name: "Rohan Patel",
    email: "rohan@lawchamber.com",
    role: "intern",
    phone: "+91 98765 43213",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "Sneha Gupta",
    email: "sneha@lawchamber.com",
    role: "intern",
    phone: "+91 98765 43214",
    createdAt: "2024-02-15",
  },
]

export const mockCases: Case[] = [
  {
    id: "c1",
    caseNumber: "CIV/2024/001",
    title: "Property Dispute - Sharma vs. Verma",
    client: {
      id: "cl1",
      name: "Ramesh Sharma",
      phone: "+91 98765 11111",
      email: "ramesh.sharma@email.com",
      address: "123, MG Road, Mumbai",
    },
    opponent: {
      id: "op1",
      name: "Suresh Verma",
      phone: "+91 98765 22222",
      advocateName: "Adv. Sanjay Mehta",
    },
    courtName: "High Court Mumbai",
    policeStation: "Andheri PS",
    caseType: "civil",
    status: "active",
    filingDate: "2024-01-15",
    nextHearingDate: "2026-04-10",
    assignedTo: ["2", "4"],
    history: [
      {
        id: "h1",
        date: "2024-01-15",
        description: "Case filed. Initial hearing scheduled.",
        nextHearingDate: "2024-02-20",
        addedBy: "1",
      },
      {
        id: "h2",
        date: "2024-02-20",
        description: "Arguments heard. Documents submitted.",
        nextHearingDate: "2024-03-25",
        expense: 5000,
        addedBy: "2",
      },
      {
        id: "h3",
        date: "2024-03-25",
        description: "Cross-examination completed.",
        nextHearingDate: "2026-04-10",
        addedBy: "2",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Property Papers.pdf",
        type: "application/pdf",
        url: "/documents/property-papers.pdf",
        uploadedAt: "2024-01-15",
        uploadedBy: "1",
      },
    ],
    tags: ["property", "dispute", "urgent"],
    createdAt: "2024-01-15",
    updatedAt: "2024-03-25",
  },
  {
    id: "c2",
    caseNumber: "CRM/2024/045",
    title: "State vs. Anil Kumar - Theft",
    client: {
      id: "cl2",
      name: "Anil Kumar",
      phone: "+91 98765 33333",
      address: "456, Gandhi Nagar, Delhi",
    },
    courtName: "Sessions Court Delhi",
    policeStation: "Saket PS",
    caseType: "criminal",
    status: "active",
    filingDate: "2024-02-01",
    nextHearingDate: "2026-04-08",
    assignedTo: ["3", "5"],
    history: [
      {
        id: "h4",
        date: "2024-02-01",
        description: "Bail application filed.",
        nextHearingDate: "2024-02-10",
        expense: 10000,
        addedBy: "3",
      },
      {
        id: "h5",
        date: "2024-02-10",
        description: "Bail granted. Next hearing for evidence.",
        nextHearingDate: "2026-04-08",
        addedBy: "3",
      },
    ],
    documents: [],
    tags: ["criminal", "theft", "bail"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-10",
  },
  {
    id: "c3",
    caseNumber: "FAM/2024/012",
    title: "Divorce Petition - Mehra",
    client: {
      id: "cl3",
      name: "Sunita Mehra",
      phone: "+91 98765 44444",
      email: "sunita.mehra@email.com",
      address: "789, Sector 15, Noida",
    },
    opponent: {
      id: "op2",
      name: "Vikram Mehra",
      advocateName: "Adv. Neha Kapoor",
    },
    courtName: "Family Court Noida",
    caseType: "family",
    status: "pending",
    filingDate: "2024-03-01",
    nextHearingDate: "2026-04-15",
    assignedTo: ["2"],
    history: [
      {
        id: "h6",
        date: "2024-03-01",
        description: "Petition filed. Notice issued to respondent.",
        nextHearingDate: "2026-04-15",
        expense: 8000,
        addedBy: "2",
      },
    ],
    documents: [
      {
        id: "d2",
        name: "Marriage Certificate.pdf",
        type: "application/pdf",
        url: "/documents/marriage-cert.pdf",
        uploadedAt: "2024-03-01",
        uploadedBy: "2",
      },
    ],
    tags: ["family", "divorce"],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
  },
  {
    id: "c4",
    caseNumber: "CIV/2024/078",
    title: "Contract Breach - Tech Corp vs. Innovate Ltd",
    client: {
      id: "cl4",
      name: "Tech Corp India",
      phone: "+91 98765 55555",
      email: "legal@techcorp.in",
      address: "Tower A, IT Park, Bangalore",
    },
    opponent: {
      id: "op3",
      name: "Innovate Ltd",
      advocateName: "Adv. Ravi Desai",
    },
    courtName: "Commercial Court Bangalore",
    caseType: "civil",
    status: "active",
    filingDate: "2024-01-20",
    nextHearingDate: "2026-04-12",
    assignedTo: ["1", "3", "4"],
    history: [
      {
        id: "h7",
        date: "2024-01-20",
        description: "Suit filed for breach of contract.",
        nextHearingDate: "2024-02-28",
        expense: 25000,
        addedBy: "1",
      },
      {
        id: "h8",
        date: "2024-02-28",
        description: "Interim injunction granted.",
        nextHearingDate: "2026-04-12",
        addedBy: "1",
      },
    ],
    documents: [
      {
        id: "d3",
        name: "Contract Agreement.pdf",
        type: "application/pdf",
        url: "/documents/contract.pdf",
        uploadedAt: "2024-01-20",
        uploadedBy: "1",
      },
    ],
    tags: ["commercial", "contract", "corporate"],
    createdAt: "2024-01-20",
    updatedAt: "2024-02-28",
  },
  {
    id: "c5",
    caseNumber: "CRM/2024/089",
    title: "State vs. Mohan - Fraud",
    client: {
      id: "cl5",
      name: "Mohan Lal",
      phone: "+91 98765 66666",
      address: "321, Civil Lines, Lucknow",
    },
    courtName: "District Court Lucknow",
    policeStation: "Hazratganj PS",
    caseType: "criminal",
    status: "active",
    filingDate: "2024-02-15",
    nextHearingDate: "2026-04-09",
    assignedTo: ["3"],
    history: [
      {
        id: "h9",
        date: "2024-02-15",
        description: "Anticipatory bail filed.",
        nextHearingDate: "2024-02-20",
        addedBy: "3",
      },
      {
        id: "h10",
        date: "2024-02-20",
        description: "Anticipatory bail granted with conditions.",
        nextHearingDate: "2026-04-09",
        expense: 15000,
        addedBy: "3",
      },
    ],
    documents: [],
    tags: ["criminal", "fraud"],
    createdAt: "2024-02-15",
    updatedAt: "2024-02-20",
  },
]

export const mockPayments: Payment[] = [
  {
    id: "p1",
    caseId: "c1",
    caseNumber: "CIV/2024/001",
    clientName: "Ramesh Sharma",
    amount: 150000,
    paidAmount: 100000,
    dueDate: "2026-04-15",
    priority: "high",
    status: "partial",
    transactions: [
      {
        id: "t1",
        amount: 50000,
        date: "2024-01-15",
        method: "Bank Transfer",
        notes: "Initial payment",
      },
      {
        id: "t2",
        amount: 50000,
        date: "2024-02-20",
        method: "Cash",
        notes: "Second installment",
      },
    ],
  },
  {
    id: "p2",
    caseId: "c2",
    caseNumber: "CRM/2024/045",
    clientName: "Anil Kumar",
    amount: 200000,
    paidAmount: 200000,
    dueDate: "2024-03-01",
    priority: "medium",
    status: "paid",
    transactions: [
      {
        id: "t3",
        amount: 200000,
        date: "2024-02-01",
        method: "Bank Transfer",
        notes: "Full payment",
      },
    ],
  },
  {
    id: "p3",
    caseId: "c3",
    caseNumber: "FAM/2024/012",
    clientName: "Sunita Mehra",
    amount: 100000,
    paidAmount: 0,
    dueDate: "2026-04-01",
    priority: "high",
    status: "pending",
    transactions: [],
  },
  {
    id: "p4",
    caseId: "c4",
    caseNumber: "CIV/2024/078",
    clientName: "Tech Corp India",
    amount: 500000,
    paidAmount: 300000,
    dueDate: "2026-04-30",
    priority: "medium",
    status: "partial",
    transactions: [
      {
        id: "t4",
        amount: 200000,
        date: "2024-01-20",
        method: "Bank Transfer",
        notes: "Advance payment",
      },
      {
        id: "t5",
        amount: 100000,
        date: "2024-02-28",
        method: "Cheque",
        notes: "After injunction",
      },
    ],
  },
  {
    id: "p5",
    caseId: "c5",
    caseNumber: "CRM/2024/089",
    clientName: "Mohan Lal",
    amount: 180000,
    paidAmount: 50000,
    dueDate: "2026-04-10",
    priority: "low",
    status: "partial",
    transactions: [
      {
        id: "t6",
        amount: 50000,
        date: "2024-02-15",
        method: "Cash",
        notes: "Initial payment",
      },
    ],
  },
]

export const mockExpenses: Expense[] = [
  {
    id: "e1",
    caseId: "c1",
    description: "Court filing fees",
    amount: 5000,
    date: "2024-01-15",
    addedBy: "1",
  },
  {
    id: "e2",
    caseId: "c1",
    description: "Document photocopies",
    amount: 500,
    date: "2024-02-20",
    addedBy: "2",
  },
  {
    id: "e3",
    caseId: "c2",
    description: "Bail bond fees",
    amount: 10000,
    date: "2024-02-01",
    addedBy: "3",
  },
  {
    id: "e4",
    caseId: "c3",
    description: "Court fees",
    amount: 8000,
    date: "2024-03-01",
    addedBy: "2",
  },
  {
    id: "e5",
    caseId: "c4",
    description: "Expert witness fees",
    amount: 25000,
    date: "2024-01-20",
    addedBy: "1",
  },
]

export const mockCauseList: CauseListEntry[] = [
  {
    id: "cl1",
    caseId: "c2",
    caseNumber: "CRM/2024/045",
    caseTitle: "State vs. Anil Kumar - Theft",
    courtName: "Sessions Court Delhi",
    hearingDate: "2026-04-08",
    hearingTime: "10:30 AM",
    assignedTo: ["3", "5"],
    attended: false,
  },
  {
    id: "cl2",
    caseId: "c5",
    caseNumber: "CRM/2024/089",
    caseTitle: "State vs. Mohan - Fraud",
    courtName: "District Court Lucknow",
    hearingDate: "2026-04-09",
    hearingTime: "11:00 AM",
    assignedTo: ["3"],
    attended: false,
  },
  {
    id: "cl3",
    caseId: "c1",
    caseNumber: "CIV/2024/001",
    caseTitle: "Property Dispute - Sharma vs. Verma",
    courtName: "High Court Mumbai",
    hearingDate: "2026-04-10",
    hearingTime: "02:00 PM",
    assignedTo: ["2", "4"],
    attended: false,
  },
  {
    id: "cl4",
    caseId: "c4",
    caseNumber: "CIV/2024/078",
    caseTitle: "Contract Breach - Tech Corp vs. Innovate Ltd",
    courtName: "Commercial Court Bangalore",
    hearingDate: "2026-04-12",
    hearingTime: "10:00 AM",
    assignedTo: ["1", "3", "4"],
    attended: false,
  },
  {
    id: "cl5",
    caseId: "c3",
    caseNumber: "FAM/2024/012",
    caseTitle: "Divorce Petition - Mehra",
    courtName: "Family Court Noida",
    hearingDate: "2026-04-15",
    hearingTime: "11:30 AM",
    assignedTo: ["2"],
    attended: false,
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Hearing Tomorrow",
    message: "CRM/2024/045 - State vs. Anil Kumar has hearing tomorrow at Sessions Court Delhi",
    type: "reminder",
    read: false,
    createdAt: "2026-04-07T09:00:00",
    link: "/cases/c2",
  },
  {
    id: "n2",
    title: "Payment Due",
    message: "Payment of Rs. 100,000 pending from Sunita Mehra for case FAM/2024/012",
    type: "warning",
    read: false,
    createdAt: "2026-04-07T08:00:00",
    link: "/payments",
  },
  {
    id: "n3",
    title: "New Case Assigned",
    message: "You have been assigned to case CIV/2024/078 - Contract Breach",
    type: "info",
    read: true,
    createdAt: "2026-04-06T14:30:00",
    link: "/cases/c4",
  },
  {
    id: "n4",
    title: "Document Uploaded",
    message: "New document uploaded for case CIV/2024/001 - Property Dispute",
    type: "info",
    read: true,
    createdAt: "2026-04-05T16:00:00",
    link: "/cases/c1",
  },
]

export const mockDashboardStats: DashboardStats = {
  totalCasesToday: 2,
  totalActiveCases: 5,
  pendingPayments: 530000,
  upcomingHearings: 5,
  courtWiseSummary: [
    { court: "High Court Mumbai", count: 1 },
    { court: "Sessions Court Delhi", count: 1 },
    { court: "Family Court Noida", count: 1 },
    { court: "Commercial Court Bangalore", count: 1 },
    { court: "District Court Lucknow", count: 1 },
  ],
  caseTypeDistribution: [
    { type: "civil", count: 2 },
    { type: "criminal", count: 2 },
    { type: "family", count: 1 },
  ],
  monthlyIncome: 700000,
  monthlyExpense: 48500,
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id)
}

export function getCasesByUserId(userId: string): Case[] {
  return mockCases.filter((c) => c.assignedTo.includes(userId))
}

export function getCauseListByDate(date: string): CauseListEntry[] {
  return mockCauseList.filter((c) => c.hearingDate === date)
}

export function getCauseListByUserId(userId: string): CauseListEntry[] {
  return mockCauseList.filter((c) => c.assignedTo.includes(userId))
}

export function getPaymentsByCaseId(caseId: string): Payment | undefined {
  return mockPayments.find((p) => p.caseId === caseId)
}

export function getExpensesByCaseId(caseId: string): Expense[] {
  return mockExpenses.filter((e) => e.caseId === caseId)
}
