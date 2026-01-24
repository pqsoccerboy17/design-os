# Clients Section Specification

## Overview

The Clients section is the primary hub for managing client relationships, pipeline opportunities, and stakeholder engagement. It combines CRM functionality with MEDDPICC sales methodology to provide a complete view of each client's health and deal status.

## Navigation

**Primary Nav:** Clients (second item after Dashboard)
**URL Structure:**
- `/clients` → ClientsList
- `/clients/new` → ClientOnboarding
- `/clients/:id` → ClientDetail
- `/clients/:id/opportunities/:oppId` → OpportunityDetail

---

## Screens

### ClientsList

The main clients view with pipeline overview and health indicators.

**Layout:**
- Header with title, search, and "New Client" button
- View toggle: List | Pipeline (kanban by deal stage)
- Filterable table/kanban with sorting

**List View Columns:**

| Column | Description | Sortable |
|--------|-------------|----------|
| Client | Name + status badge (prospect/active/churned) | Yes |
| Champion | Avatar/initials of Champion stakeholder, or "—" | No |
| Pipeline Value | Sum of open opportunity values | Yes |
| Health | Score indicator (🟢🟡🔴) | Yes |
| Last Activity | Relative date ("2 days ago") | Yes |
| Actions | Menu (View, Edit, Archive) | No |

**Pipeline View (Kanban):**
- Columns: Lead → Qualified → Discovery → Proposal → Negotiation → Closed
- Cards show: Client name, Opportunity name, Value, Days in stage
- Drag-and-drop to change stage (creates Activity log)
- Color-coded by health score

**Filters:**
- Status: All, Prospect, Active, Churned
- Health: All, Healthy, At Risk, Critical
- Assigned To: User multi-select (for consultants)

**Empty State:**
"No clients yet. Add your first client to start tracking relationships."
[+ Add Client] button

---

### ClientDetail

Comprehensive view of a single client with tabbed navigation.

**Header:**
- Client name (large)
- Status badge
- Health score with breakdown tooltip
- Action buttons: Edit, Log Activity, New Opportunity

**Tabs:**

#### Overview Tab
- **Summary Card:** Status, budget, deadline, created date
- **MEDDPICC Progress:** Visual indicator showing completion (e.g., "4/6 fields")
- **Key Stakeholders:** Champion and Economic Buyer cards with contact info
- **Recent Activity:** Last 5 activities with timeline

#### MEDDPICC Tab
- Six editable text fields in card layout:
  - Metrics
  - Economic Buyer (note: stakeholder, not field)
  - Decision Criteria
  - Decision Process
  - Paper Process
  - Identified Pain
  - Competition
- Each field has: Label, rich text editor, last updated timestamp
- Auto-save on blur

#### Stakeholders Tab
- Table of all stakeholders for this client
- Columns: Name, Title, Role Tags (badges), Engagement, Last Contact, Actions
- "+ Add Stakeholder" button
- Click row → Stakeholder detail slide-over

**Stakeholder Slide-over:**
- Name, Title, Email, Phone
- Role tags (multi-select chips): Champion, Economic Buyer, etc.
- Engagement level dropdown
- Notes (rich text)
- Activity timeline for this stakeholder

#### Opportunities Tab
- Table of opportunities for this client
- Columns: Name, Stage, Type, Value, Probability, Expected Close, Days in Stage
- Click row → Navigate to OpportunityDetail
- "+ New Opportunity" button

#### Projects Tab
- Table of projects for this client
- Columns: Name, Status, Budget, Timeline, Progress
- Click row → Navigate to ProjectDetail (Projects section)
- Shows link to originating Opportunity if applicable

#### Activity Tab
- Full activity timeline (newest first)
- Filter by type: All, Calls, Meetings, Emails, Notes
- Each entry shows: Type icon, Subject, Stakeholders involved, Date, Sentiment
- "+ Log Activity" button opens quick-log modal

---

### OpportunityDetail

Detailed view of a single opportunity/deal.

**Header:**
- Opportunity name
- Stage badge with probability
- Value (large, formatted currency)
- Client name (link back to ClientDetail)
- Action buttons: Edit, Log Activity, Mark Won/Lost

**Stage Progress Bar:**
- Visual pipeline showing current stage
- Click stage to advance (with confirmation)
- Shows days in current stage

**Layout (2-column on desktop):**

**Left Column (60%):**

*Deal Information Card:*
- Type: New / Renewal / Expansion
- Source: Referral / Inbound / Outbound / Event / Partner
- Expected Close Date (editable)
- Created by, Created date

*Competitor Intelligence Card:*
- List of competitors mentioned
- Each shows: Name, Status (Active/Displaced/Lost To), Notes
- "+ Add Competitor" button

*Activity Timeline:*
- All activities linked to this opportunity
- Same format as ClientDetail activity tab

**Right Column (40%):**

*Key Stakeholders Card:*
- Stakeholders involved in this deal
- Shows role tags prominently
- Quick indicators: ✓ Champion identified, ✓ EB engaged

*Deal Health Card:*
- Health score specific to this opportunity
- Warnings: "No Champion identified", "EB not engaged in 14 days"
- Suggestions for next actions

**Won/Lost Modal:**

*If Won:*
- Confirm close date
- Option to create Project immediately
- Project name pre-filled from opportunity name
- Budget pre-filled from deal value

*If Lost:*
- Required: Loss reason (dropdown + text)
- Competitor lost to (if applicable)
- Lessons learned (optional text)

---

### ClientOnboarding

Wizard for adding a new client.

**Step 1: Basic Info**
- Client name (required)
- Status: Prospect (default) / Active
- Website (optional)
- Industry (optional)

**Step 2: Primary Contact**
- Name (required)
- Title
- Email
- Phone
- Role tags (default: Champion suggested)

**Step 3: First Opportunity (Optional)**
- Skip or create first deal
- If creating:
  - Opportunity name
  - Type (default: New)
  - Source
  - Estimated value
  - Expected close date

**Step 4: Review**
- Summary of entered data
- [Create Client] button

**After Creation:**
- Navigate to new ClientDetail
- Toast: "Client created successfully"

---

## User Flows

### Flow 1: Add New Client with Opportunity

1. User clicks "+ New Client" from ClientsList
2. Completes wizard steps 1-3
3. Reviews and submits
4. Redirected to ClientDetail
5. Opportunity visible in Opportunities tab

### Flow 2: Log Activity from Client

1. User views ClientDetail
2. Clicks "Log Activity" button
3. Modal opens with:
   - Type dropdown (Call, Meeting, Email, Note)
   - Subject (required)
   - Description (rich text)
   - Date/time (defaults to now)
   - Duration (optional)
   - Stakeholders involved (multi-select from client's stakeholders)
   - Sentiment (optional: Positive, Neutral, Negative)
   - Link to Opportunity (optional dropdown)
4. User submits
5. Activity appears in timeline
6. Stakeholder "last contact" dates updated

### Flow 3: Move Opportunity Through Pipeline

1. User views Pipeline kanban
2. Drags opportunity card from "Discovery" to "Proposal"
3. Confirmation modal: "Move to Proposal stage?"
4. User confirms
5. Stage updated, probability recalculated
6. Activity auto-logged: "Stage changed from Discovery to Proposal"

### Flow 4: Close Won → Create Project

1. User on OpportunityDetail clicks "Mark Won"
2. Modal asks for close date and project creation option
3. User selects "Create Project"
4. Project created with inherited data
5. Opportunity marked closed_won
6. User redirected to new ProjectDetail

### Flow 5: Update MEDDPICC Fields

1. User on ClientDetail navigates to MEDDPICC tab
2. Clicks into "Identified Pain" field
3. Types/edits content
4. Field auto-saves on blur
5. Toast: "Saved"
6. Health score recalculates (if completeness changed)

---

## UI Components

### ClientCard (for kanban)
```
┌─────────────────────────────┐
│ 🏢 Acme Corp                │
│ EasyVista Implementation    │
│ $45,000        12 days      │
│ 🟢 ⭐ Champion: Jane Doe    │
└─────────────────────────────┘
```

### StakeholderChip
```
┌─────────────────────────┐
│ 👤 Jane Doe  ⭐💰       │
│    VP Engineering       │
└─────────────────────────┘
```
Role icons: ⭐ Champion, 💰 EB, 🔧 Tech, 🎯 Coach, 🚫 Blocker, 👤 User

### HealthIndicator
- 🟢 70-100: Green circle
- 🟡 40-69: Yellow circle
- 🔴 0-39: Red circle
- Hover shows score breakdown

### StageProgressBar
```
[Lead]──[Qualified]──[Discovery]──●[Proposal]──[Negotiation]──[Closed]
                                  ▲ Current
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `n` | New Client (from ClientsList) |
| `a` | Log Activity (from ClientDetail) |
| `o` | New Opportunity (from ClientDetail) |
| `e` | Edit current item |
| `/` | Focus search |
| `1-5` | Switch tabs (on ClientDetail) |

---

## Responsive Behavior

**Desktop (≥1024px):**
- Full table with all columns
- Pipeline kanban with all stages visible
- ClientDetail has 2-column layout

**Tablet (768-1023px):**
- Table hides less critical columns (Champion, Health)
- Pipeline kanban scrolls horizontally
- ClientDetail stacks to single column

**Mobile (<768px):**
- Card list instead of table
- Pipeline shows as list grouped by stage
- Tabs become bottom sheet navigation

---

## Accessibility

- All interactive elements have focus states
- Role tag badges have aria-label with full role name
- Health indicators have aria-label with score
- Kanban drag-and-drop has keyboard alternative (select card, press Enter, arrow to stage, Enter to confirm)
- Activity timeline has proper heading structure

---

## Design Notes

- Use `amber` accent for Champion indicators and CTAs
- Health colors: `emerald-500` (healthy), `amber-500` (at risk), `rose-500` (critical)
- Pipeline stage colors: Gradient from `stone-300` (Lead) to `emerald-500` (Closed Won)
- Stakeholder role badges use muted versions of icon colors
- Cards use `rounded-xl` consistent with shell spec
- Activity timeline uses vertical line with dot markers
