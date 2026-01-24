# Invoicing Section Specification

## Overview

The Invoicing section manages financial operations including time tracking, invoice generation, and payment status monitoring. It integrates with clients (recipients), projects (billable work), and stakeholders (Economic Buyer as default recipient).

## Screens

### InvoicesList

Primary view for managing all invoices across clients.

**Layout:**
- Header with "New Invoice" button and filter controls
- Stats bar showing totals: Outstanding, Overdue, Paid This Month
- Table with sortable columns

**Table Columns:**
| Column | Content | Sort |
|--------|---------|------|
| Invoice # | INV-2025-001 format, clickable | Yes |
| Client | Client name with avatar | Yes |
| Amount | Formatted currency (e.g., $12,500.00) | Yes |
| Status | Badge (Draft, Sent, Paid, Overdue, Cancelled) | Yes |
| Due Date | Relative or absolute date | Yes |
| Recipient | Stakeholder name + Economic Buyer badge if applicable | No |
| Actions | View, Send, Mark Paid, Void | No |

**Filters:**
- Status: All, Draft, Sent, Paid, Overdue
- Client: Multi-select
- Date Range: This month, Last 30 days, This quarter, Custom
- Amount Range: Min/Max

**Empty State:**
"No invoices yet. Create your first invoice or log time entries to get started."

---

### TimeEntryList

Track billable and non-billable hours against projects.

**Layout:**
- Week/Month toggle view
- Quick entry row at top
- Grouped by day with daily totals
- Running weekly/monthly totals in sidebar

**Quick Entry Row:**
| Field | Type | Required |
|-------|------|----------|
| Date | Date picker (defaults to today) | Yes |
| Project | Select (grouped by client) | Yes |
| Task | Select (filtered by project) | No |
| Hours | Number input (0.25 increments) | Yes |
| Description | Text input | No |
| Billable | Checkbox (default: true) | Yes |

**Time Entry Card:**
```
┌─────────────────────────────────────────────────────┐
│ [Project Badge] EasyVista ITSM Implementation       │
│ AD Integration Setup · 2.5 hours                    │
│ "Configured LDAP sync for department OUs"           │
│ [$] Billable                            [Edit] [×]  │
└─────────────────────────────────────────────────────┘
```

**Bulk Actions:**
- Mark selected as billable/non-billable
- Assign to invoice
- Delete

**Summary Sidebar:**
- Hours this week: 32.5 / 40 target
- Billable: 28.0 (86%)
- By project breakdown (bar chart)
- Uninvoiced hours: 45.5 ($6,825 at $150/hr)

---

### InvoiceDetail

View and manage a single invoice.

**Header:**
- Invoice number and status badge
- Client name and logo
- Action buttons: Edit, Send, Download PDF, Mark Paid, Void

**Invoice Content:**
```
┌─────────────────────────────────────────────────────────────┐
│  INVOICE #INV-2025-003                                      │
│  ─────────────────────────────────────────────────────────  │
│  From: YourCo Consulting            To: Acme Corporation    │
│        123 Main St                      David Chen          │
│        San Francisco, CA                Economic Buyer 💰    │
│                                         david@acme.corp     │
│  ─────────────────────────────────────────────────────────  │
│  Issue Date: January 15, 2025       Due Date: Feb 14, 2025  │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Line Items:                                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Description                    Qty    Rate    Amount  │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ EasyVista Implementation       32 hrs  $150   $4,800  │  │
│  │ - AD Integration (16 hrs)                             │  │
│  │ - CMDB Setup (10 hrs)                                 │  │
│  │ - Training Sessions (6 hrs)                           │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Q2 Optimization Sprint         8 hrs   $175   $1,400  │  │
│  │ - Performance Audit                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│                                    Subtotal:    $6,200.00   │
│                                    Tax (0%):        $0.00   │
│                                    ─────────────────────    │
│                                    TOTAL:       $6,200.00   │
│                                                             │
│  Notes:                                                     │
│  Payment terms: Net 30. Please reference invoice number.    │
│  Paper Process: PO required, route through procurement.     │
└─────────────────────────────────────────────────────────────┘
```

**Activity Timeline:**
- Invoice created (date, by user)
- Invoice sent (date, to recipient)
- Payment received (date, amount)
- Reminders sent (dates)

**Related:**
- Projects covered by this invoice
- Time entries included
- Previous invoices to same client

---

### InvoiceGenerate

Create new invoice from unbilled time entries.

**Step 1: Select Scope**
- Client: Required dropdown
- Projects: Multi-select (filtered by client, defaults to all)
- Date Range: Start/end date for time entries
- "Include only billable entries" checkbox (default: checked)

**Step 2: Review Time Entries**
- Table of matching time entries
- Checkboxes to include/exclude individual entries
- Group by project with subtotals
- Edit hourly rate per project
- Running total displayed prominently

**Step 3: Invoice Details**
- Invoice number (auto-generated, editable)
- Issue date (defaults to today)
- Due date (defaults to +30 days)
- Recipient: Dropdown of client stakeholders
  - Auto-selects Economic Buyer if one exists
  - Shows role badges in dropdown
- Payment terms: Net 15/30/45/60/Custom
- Notes field (pre-populated with Paper Process if exists)
- Currency (defaults to organization setting)

**Step 4: Preview & Send**
- Full invoice preview (PDF-style)
- Edit button to go back
- Save as Draft button
- Send Invoice button (opens email compose modal)

---

### TimeEntryWeekView

Calendar-style weekly time entry.

**Layout:**
```
┌────────────────────────────────────────────────────────────────────┐
│  ← Week of Jan 20, 2025 →                          [+ Quick Entry] │
├────────┬────────┬────────┬────────┬────────┬────────┬────────┬─────┤
│  Mon   │  Tue   │  Wed   │  Thu   │  Fri   │  Sat   │  Sun   │Total│
│  1/20  │  1/21  │  1/22  │  1/23  │  1/24  │  1/25  │  1/26  │     │
├────────┼────────┼────────┼────────┼────────┼────────┼────────┼─────┤
│ EV-Acme│        │ EV-Acme│ EV-Acme│        │        │        │     │
│  4.0h  │        │  6.0h  │  5.5h  │        │        │        │15.5h│
├────────┼────────┼────────┼────────┼────────┼────────┼────────┼─────┤
│ HR-Init│ HR-Init│ HR-Init│        │ HR-Init│        │        │     │
│  2.0h  │  3.5h  │  2.0h  │        │  4.0h  │        │        │11.5h│
├────────┼────────┼────────┼────────┼────────┼────────┼────────┼─────┤
│        │ Q2-Acme│        │ Q2-Acme│        │        │        │     │
│        │  1.5h  │        │  1.5h  │        │        │        │ 3.0h│
├────────┼────────┼────────┼────────┼────────┼────────┼────────┼─────┤
│  6.0h  │  5.0h  │  8.0h  │  7.0h  │  4.0h  │  0.0h  │  0.0h  │30.0h│
└────────┴────────┴────────┴────────┴────────┴────────┴────────┴─────┘
```

**Interactions:**
- Click cell to add/edit time entry
- Drag to resize duration
- Color-coded by project
- Dim non-billable entries

---

## User Flows

### Log Time Entry (Happy Path)
1. User clicks "Log Time" or navigates to Time Entries
2. Selects project from dropdown (client auto-filled)
3. Enters hours and optional description
4. Clicks "Save" → Entry appears in list
5. Toast: "Time entry saved"

### Generate Invoice from Time
1. User clicks "New Invoice" on InvoicesList
2. Selects client → Projects auto-populate
3. Adjusts date range if needed
4. Reviews time entries, adjusts rates if needed
5. Fills invoice details (recipient auto-selected as EB)
6. Previews invoice
7. Clicks "Send" → Email modal opens
8. Confirms send → Invoice status changes to "Sent"
9. Toast: "Invoice sent to David Chen"

### Mark Invoice Paid
1. User opens invoice detail (status: Sent)
2. Clicks "Mark Paid" button
3. Modal: Enter payment date, amount received, payment method
4. Confirms → Status changes to "Paid"
5. Related time entries marked as invoiced
6. Toast: "Payment recorded"

### Handle Overdue Invoice
1. Invoice due date passes → Status auto-changes to "Overdue"
2. Invoice row highlighted in red on list
3. User clicks "Send Reminder"
4. Email modal pre-populated with overdue template
5. Sends reminder → Activity logged on invoice

---

## UI Requirements

### Color System

| Status | Badge Color | Background |
|--------|-------------|------------|
| Draft | gray-500 | gray-100 |
| Sent | blue-500 | blue-100 |
| Paid | emerald-500 | emerald-100 |
| Overdue | rose-500 | rose-100 |
| Cancelled | gray-400 | gray-50 |

### Currency Formatting

- Display: $12,500.00 (locale-aware)
- Input: Allow 1234.56 or 1,234.56
- Storage: Cents as integer (1250000 = $12,500.00)
- Default currency: USD (configurable per org)

### Date Handling

- Due dates: Relative ("Due in 5 days") until urgent, then absolute
- Overdue: "3 days overdue" in red
- Time entries: Relative for today/yesterday, then absolute

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `n` | New invoice |
| `t` | New time entry |
| `e` | Edit selected |
| `s` | Send selected invoice |
| `p` | Mark selected as paid |
| `f` | Focus filter |
| `?` | Show shortcuts |

---

## Data Dependencies

### Required Entities
- **Client** - Invoice recipient organization
- **Stakeholder** - Individual recipient (Economic Buyer preferred)
- **Project** - Billable work source
- **Task** - Optional granularity for time entries
- **User** - Who logged time / created invoice

### Cross-References
- `clients/data.json` - Client details, Paper Process field
- `projects/data.json` - Project budget, hourly rate
- `tasks/data.json` - Task assignments for time entry context

### Computed Fields
- **Invoice.amount** - Sum of line item totals
- **Invoice.status** - Auto-transitions to "Overdue" past due date
- **TimeEntry.invoiced** - True when assigned to sent/paid invoice
- **Project.uninvoiced_hours** - Sum of billable, uninvoiced time entries

---

## Integration Points

### Email (Invoice Delivery)
- Generate PDF attachment
- Send to recipient stakeholder email
- CC option for other stakeholders
- BCC to internal team

### Paper Process Integration
- If client has Paper Process notes in MEDDPICC fields:
  - Display in invoice generation flow
  - Pre-populate invoice notes
  - Show warning if no PO number provided

### Budget Tracking
- Compare invoiced amount to Project budget
- Show utilization % on project cards
- Alert when approaching budget limit

---

## Validation Rules

### Time Entry
- Hours: 0.25 - 24 per entry
- Date: Cannot be future, max 30 days past
- Project: Must be active project
- Description: Max 500 characters

### Invoice
- Amount: Must be > 0
- Due date: Must be >= issue date
- Recipient: Must be valid stakeholder
- Line items: At least one required

---

## Error States

### Invoice Generation
- "No unbilled time entries for selected criteria"
- "Selected project has no hourly rate configured"
- "Client has no stakeholders to send invoice"

### Payment Recording
- "Payment amount exceeds invoice total"
- "Payment date cannot be before issue date"

### Time Entry
- "Cannot log time to completed project"
- "Exceeds maximum hours per day (24)"

---

## Accessibility

- All inputs have visible labels
- Status badges include text, not just color
- Currency amounts announced with proper formatting
- Table rows navigable with arrow keys
- Send confirmation has focus trap
- PDF preview has text alternative
