// Invoicing Section Types
// Time tracking, invoice generation, and payment management

// =============================================================================
// Tier 1: Enums
// =============================================================================

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'check' | 'ach' | 'other'
export type PaymentTerms = 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'due_on_receipt' | 'custom'
export type TimeEntryView = 'list' | 'week' | 'month'

// =============================================================================
// Tier 2: Core Entities
// =============================================================================

export interface Invoice {
  id: string
  clientId: string
  projectIds: string[]
  invoiceNumber: string
  amount: number // Stored in cents
  currency: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  sentDate: string | null
  paidDate: string | null
  paymentMethod: PaymentMethod | null
  recipientStakeholderId: string | null // Economic Buyer preferred
  lineItems: InvoiceLineItem[]
  notes: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceLineItem {
  id: string
  invoiceId: string
  description: string
  quantity: number // Hours or units
  unitPrice: number // Rate in cents
  amount: number // quantity * unitPrice in cents
  projectId: string | null
  taskId: string | null
}

export interface TimeEntry {
  id: string
  userId: string
  projectId: string
  taskId: string | null
  invoiceId: string | null // null = uninvoiced
  date: string
  hours: number
  description: string | null
  billable: boolean
  hourlyRate: number | null // Override rate in cents, null = use project rate
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number // in cents
  paymentDate: string
  paymentMethod: PaymentMethod
  reference: string | null // Check number, transaction ID, etc.
  notes: string | null
  createdBy: string
  createdAt: string
}

// =============================================================================
// Tier 3: Computed/Aggregated Types
// =============================================================================

export interface InvoiceWithRelations extends Invoice {
  client: { id: string; name: string; logoUrl: string | null }
  recipient: { id: string; name: string; email: string; isEconomicBuyer: boolean } | null
  projects: { id: string; name: string }[]
  payments: Payment[]
  timeEntriesCount: number
  totalHours: number
}

export interface TimeEntryWithContext extends TimeEntry {
  user: { id: string; name: string; avatarUrl: string | null }
  project: { id: string; name: string; clientName: string }
  task: { id: string; title: string } | null
  invoice: { id: string; invoiceNumber: string; status: InvoiceStatus } | null
}

export interface InvoiceSummary {
  totalOutstanding: number
  totalOverdue: number
  paidThisMonth: number
  draftCount: number
  sentCount: number
  overdueCount: number
}

export interface TimeEntrySummary {
  hoursThisWeek: number
  hoursTarget: number
  billableHours: number
  billablePercentage: number
  uninvoicedHours: number
  uninvoicedValue: number
  byProject: { projectId: string; projectName: string; hours: number; color: string }[]
}

export interface ProjectBillingStatus {
  projectId: string
  projectName: string
  budget: number | null
  invoiced: number
  uninvoiced: number
  utilizationPercentage: number
}

// =============================================================================
// Tier 4: Form/Input Types
// =============================================================================

export interface TimeEntryInput {
  projectId: string
  taskId?: string
  date: string
  hours: number
  description?: string
  billable: boolean
}

export interface InvoiceGenerateInput {
  clientId: string
  projectIds: string[]
  dateRangeStart: string
  dateRangeEnd: string
  includeBillableOnly: boolean
}

export interface InvoiceDetailsInput {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  paymentTerms: PaymentTerms
  recipientStakeholderId: string
  notes?: string
  currency: string
}

export interface PaymentInput {
  invoiceId: string
  amount: number
  paymentDate: string
  paymentMethod: PaymentMethod
  reference?: string
  notes?: string
}

export interface LineItemEdit {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

// =============================================================================
// Tier 5: Component Props
// =============================================================================

export interface InvoicesListProps {
  invoices: InvoiceWithRelations[]
  summary: InvoiceSummary
  filters: InvoiceFilters
  onFilterChange?: (filters: InvoiceFilters) => void
  onCreateInvoice?: () => void
  onInvoiceClick?: (invoiceId: string) => void
  onSendInvoice?: (invoiceId: string) => void
  onMarkPaid?: (invoiceId: string) => void
}

export interface InvoiceFilters {
  status: InvoiceStatus | 'all'
  clientIds: string[]
  dateRange: 'this_month' | 'last_30_days' | 'this_quarter' | 'custom'
  customDateStart?: string
  customDateEnd?: string
  amountMin?: number
  amountMax?: number
}

export interface InvoiceDetailProps {
  invoice: InvoiceWithRelations
  onEdit?: () => void
  onSend?: () => void
  onDownloadPdf?: () => void
  onMarkPaid?: () => void
  onVoid?: () => void
  onSendReminder?: () => void
}

export interface InvoiceGenerateProps {
  clients: { id: string; name: string }[]
  onGenerate?: (input: InvoiceGenerateInput) => void
  onCancel?: () => void
}

export interface InvoicePreviewProps {
  invoice: Partial<Invoice>
  client: { name: string; address?: string }
  recipient: { name: string; email: string; title?: string; isEconomicBuyer: boolean }
  lineItems: LineItemEdit[]
  organization: { name: string; address?: string; logoUrl?: string }
}

export interface TimeEntryListProps {
  entries: TimeEntryWithContext[]
  summary: TimeEntrySummary
  view: TimeEntryView
  onViewChange?: (view: TimeEntryView) => void
  onAddEntry?: (entry: TimeEntryInput) => void
  onEditEntry?: (entryId: string, updates: Partial<TimeEntryInput>) => void
  onDeleteEntry?: (entryId: string) => void
  onBulkAssignInvoice?: (entryIds: string[], invoiceId: string) => void
}

export interface TimeEntryFormProps {
  projects: { id: string; name: string; clientName: string; tasks: { id: string; title: string }[] }[]
  initialValues?: Partial<TimeEntryInput>
  onSubmit?: (entry: TimeEntryInput) => void
  onCancel?: () => void
}

export interface TimeEntryWeekViewProps {
  entries: TimeEntryWithContext[]
  weekStart: string
  projects: { id: string; name: string; color: string }[]
  onCellClick?: (date: string, projectId?: string) => void
  onEntryClick?: (entryId: string) => void
  onWeekChange?: (weekStart: string) => void
}

export interface PaymentModalProps {
  invoice: InvoiceWithRelations
  onSubmit?: (payment: PaymentInput) => void
  onCancel?: () => void
}

export interface SendInvoiceModalProps {
  invoice: InvoiceWithRelations
  recipient: { name: string; email: string }
  onSend?: (options: { cc?: string[]; bcc?: string[]; message?: string }) => void
  onCancel?: () => void
}

// =============================================================================
// Tier 6: Utility Types
// =============================================================================

export interface CurrencyConfig {
  code: string
  symbol: string
  decimals: number
  locale: string
}

export interface InvoiceTemplate {
  id: string
  name: string
  headerHtml?: string
  footerHtml?: string
  primaryColor: string
  logoPosition: 'left' | 'center' | 'right'
}

export interface InvoiceActivity {
  id: string
  invoiceId: string
  type: 'created' | 'sent' | 'viewed' | 'paid' | 'reminder_sent' | 'voided'
  occurredAt: string
  userId: string | null
  metadata?: Record<string, unknown>
}
