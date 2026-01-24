# Milestone 7: Invoicing

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-2 complete (Foundation + Shell)

---

## About These Instructions

**What you're receiving:**

- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**

- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**

- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement invoicing with time entry logging, invoice generation, payment tracking, and billing workflow management.

## Overview

The Invoicing section handles billing operations:

- Log time entries against tasks and projects
- Generate invoices from time entries
- Track invoice status and payments
- Monitor outstanding and overdue amounts
- Weekly time entry view for quick logging

**Key Features:**

- Invoice list with status filtering
- Invoice detail with line items
- Invoice generation wizard
- Time entry logging
- Week view for rapid time entry
- Payment status tracking
- Outstanding/overdue alerts
- PDF export

## Recommended Approach: Test-Driven Development

Before implementing, read `product-plan/sections/invoicing/tests.md` for test-writing guidance.

**TDD Workflow:**

1. Write failing tests for API endpoints and business logic
2. Implement the minimum code to pass tests
3. Refactor while keeping tests green

## What to Implement

### 1. Invoice List (`InvoicesList`)

Copy from `product-plan/sections/invoicing/components/InvoicesList.tsx`

**Summary Cards:**
| Card | Metric | Color |
|------|--------|-------|
| Outstanding | Sum of sent invoices | Sky |
| Overdue | Sum of overdue invoices | Red |
| Paid This Month | Sum of paid this month | Lime |
| Uninvoiced Hours | Hours not yet billed | Amber |

**Columns:**

- Invoice number
- Client name
- Amount
- Status badge
- Due date
- Actions (view, send, download)

**Status Filters:**

- All
- Draft
- Sent
- Paid
- Overdue

**API Endpoints:**

```
GET /api/invoices
GET /api/invoices?status=overdue
GET /api/invoices/stats
```

### 2. Invoice Status

**Status Values:**

```typescript
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
```

**Status Colors:**
| Status | Background | Text |
|--------|------------|------|
| draft | stone-100 | stone-700 |
| sent | sky-100 | sky-700 |
| paid | lime-100 | lime-700 |
| overdue | red-100 | red-700 |

**Overdue Logic:**

```typescript
function isOverdue(invoice: Invoice): boolean {
  if (invoice.status === "paid") return false;
  return new Date(invoice.dueDate) < new Date();
}
```

### 3. Invoice Detail (`InvoiceDetail`)

Copy from `product-plan/sections/invoicing/components/InvoiceDetail.tsx`

**Header:**

- Invoice number and client
- Status badge
- Amount and due date
- Actions: Send, Download PDF, Mark Paid

**Line Items Table:**
| Column | Description |
|--------|-------------|
| Description | Task/project name |
| Quantity | Hours or units |
| Rate | Hourly or unit rate |
| Amount | Quantity × Rate |

**Footer:**

- Subtotal
- Tax (if applicable)
- Total

**API Endpoints:**

```
GET /api/invoices/:id
PATCH /api/invoices/:id
POST /api/invoices/:id/send
POST /api/invoices/:id/mark-paid
```

### 4. Invoice Generation (`InvoiceGenerate`)

Copy from `product-plan/sections/invoicing/components/InvoiceGenerate.tsx`

**Steps:**

1. Select Client — Choose client to invoice
2. Select Time Entries — Check entries to include
3. Review & Adjust — Edit rates, add line items
4. Finalize — Set due date, add notes, create

**API:**

```
GET /api/clients/:id/uninvoiced-time
POST /api/invoices
```

### 5. Time Entry List (`TimeEntryList`)

Copy from `product-plan/sections/invoicing/components/TimeEntryList.tsx`

**Columns:**

- Date
- Task name
- Project name
- User
- Hours
- Billable (checkbox)
- Invoiced (status)

**Filters:**

- Date range
- Project
- User
- Billable only
- Uninvoiced only

**API Endpoints:**

```
GET /api/time-entries
GET /api/time-entries?projectId=xxx
GET /api/time-entries?userId=xxx
GET /api/time-entries?billable=true&invoiced=false
POST /api/time-entries
PATCH /api/time-entries/:id
DELETE /api/time-entries/:id
```

### 6. Time Entry Week View (`TimeEntryWeekView`)

Copy from `product-plan/sections/invoicing/components/TimeEntryWeekView.tsx`

**Layout:**

- Rows: Projects/tasks
- Columns: Days of the week (Mon-Sun)
- Cells: Hour inputs

**Features:**

- Quick entry by clicking cells
- Tab to move between cells
- Daily and weekly totals
- Previous/next week navigation

**API:**

```
GET /api/time-entries?week=2024-W12
POST /api/time-entries/bulk
```

### 7. Time Entry Schema

```typescript
interface TimeEntry {
  id: string;
  userId: string;
  taskId: string | null;
  projectId: string;
  date: string; // ISO date
  hours: number;
  description: string | null;
  billable: boolean;
  invoiceId: string | null;
  createdAt: string;
}
```

### 8. Invoice Schema

```typescript
interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., "INV-2024-001"
  clientId: string;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number; // in cents
  taxRate: number; // percentage
  taxAmount: number; // in cents
  total: number; // in cents
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
}

interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number; // in cents
  amount: number; // in cents
  timeEntryIds: string[]; // linked time entries
}
```

### 9. Currency Formatting

Store amounts in cents, display in dollars:

```typescript
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

// formatCurrency(125000) → "$1,250.00"
```

### 10. Invoice Number Generation

```typescript
function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const sequence = await getNextSequence("invoice");
  return `INV-${year}-${sequence.toString().padStart(3, "0")}`;
}

// INV-2024-001, INV-2024-002, etc.
```

## Expected User Flows

**Flow 1: Log Time**

1. User navigates to `/invoicing/time`
2. Clicks "Log Time"
3. Selects project and task
4. Enters hours and description
5. Marks as billable
6. Saves entry

**Flow 2: Quick Week Entry**

1. User opens week view
2. Sees grid of projects × days
3. Clicks cell for Tuesday
4. Types "2" for 2 hours
5. Tabs to next cell
6. Weekly total updates

**Flow 3: Generate Invoice**

1. User clicks "New Invoice"
2. Selects client from dropdown
3. Views uninvoiced time entries
4. Checks entries to include
5. Adjusts rates if needed
6. Sets due date (Net 30 default)
7. Creates invoice

**Flow 4: Send & Track Invoice**

1. User opens invoice detail
2. Reviews line items
3. Clicks "Send Invoice"
4. Invoice status changes to "Sent"
5. Later, clicks "Mark Paid" when payment received

## Files to Reference

- `product-plan/sections/invoicing/README.md` — Section overview
- `product-plan/sections/invoicing/components/` — React components
- `product-plan/sections/invoicing/tests.md` — Test-writing guidance
- `product-plan/data-model/types.ts` — Invoice, TimeEntry types
- `product-plan/data-model/sample-data.json` — Test data

## Done When

- [ ] Invoice list displays with filtering
- [ ] Summary cards show correct amounts
- [ ] Status badges display correctly
- [ ] Invoice detail shows line items
- [ ] Send invoice changes status
- [ ] Mark paid records payment date
- [ ] Invoice generation wizard works
- [ ] Time entries can be selected for invoicing
- [ ] Time entry list displays
- [ ] Time entry week view renders grid
- [ ] Week view allows quick entry
- [ ] Billable flag works correctly
- [ ] Currency formatting shows dollars
- [ ] Invoice numbers auto-generate
- [ ] Empty states display when no records
