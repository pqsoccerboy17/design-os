# YourCo Complete Build Instructions

> **Provide alongside:** `product-overview.md`
> **This document:** Complete implementation guide for building YourCo in a single session

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

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, and routing structure.

## What to Implement

### 1. Design Tokens

Configure your styling system with the YourCo design tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Color Palette:**

- Primary: `stone` (warm neutral for backgrounds, text, borders)
- Secondary: `amber` (accent for CTAs, active states, brand elements)
- Neutral: `zinc` (cool neutral for dark mode)

**Typography:**

- Heading: Space Grotesk
- Body: Inter
- Mono: IBM Plex Mono

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for complete interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Core Entities (15 total):**

- User, Client, Stakeholder, Opportunity, Activity
- Project, Phase, Task, TimeEntry
- Invoice, Competitor, CompetitorMention
- ClientAssignment, AuditLog, ClientPortalAccess

**Key Enums:**

- MeddpiccRole: champion, economic_buyer, technical_evaluator, coach, blocker, user
- DealStage: lead, qualified, discovery, proposal, negotiation, closed_won, closed_lost
- UserRole: admin, consultant, viewer, client
- ProjectStatus, TaskStatus, InvoiceStatus, etc.

### 3. Routing Structure

Create routes for all sections:

| Route                               | Component         | Description                       |
| ----------------------------------- | ----------------- | --------------------------------- |
| `/` or `/dashboard`                 | Dashboard         | Internal dashboard (landing page) |
| `/clients`                          | ClientsList       | Client list and pipeline          |
| `/clients/new`                      | ClientOnboarding  | New client wizard                 |
| `/clients/:id`                      | ClientDetail      | Client detail with tabs           |
| `/clients/:id/opportunities/:oppId` | OpportunityDetail | Deal detail                       |
| `/projects`                         | ProjectsList      | Project list                      |
| `/projects/new`                     | ProjectOnboarding | New project wizard                |
| `/projects/:id`                     | ProjectDetail     | Project detail with tabs          |
| `/projects/:id/timeline`            | ProjectTimeline   | Gantt view                        |
| `/tasks`                            | TasksBoard        | Kanban board (default)            |
| `/tasks/list`                       | TasksList         | Table view                        |
| `/tasks/:id`                        | TaskDetail        | Task detail                       |
| `/invoicing`                        | InvoicesList      | Invoice list                      |
| `/invoicing/time`                   | TimeEntryList     | Time entries                      |
| `/invoicing/:id`                    | InvoiceDetail     | Invoice detail                    |
| `/invoicing/new`                    | InvoiceGenerate   | Invoice wizard                    |
| `/admin`                            | UserManagement    | User list                         |
| `/admin/assignments`                | ClientAssignments | User-client matrix                |
| `/admin/audit`                      | AuditLog          | Audit log                         |
| `/admin/settings`                   | Settings          | Org settings                      |
| `/portal/:token`                    | ClientPortal      | External portal (public)          |

### 4. Database Schema

Based on the data model, create your database schema. Key considerations:

**Relationships:**

- Client → Stakeholders (1:N)
- Client → Opportunities (1:N)
- Client → Projects (1:N)
- Project → Phases (1:N)
- Project → Tasks (1:N)
- Opportunity → Project (1:1, when won)
- User → ClientAssignments (N:M with role)

**Security:**

- Encrypt PII fields: email, phone, notes
- Use ClientAssignment for RBAC
- Log all mutations to AuditLog

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions and relationships
- `product-plan/data-model/sample-data.json` — Sample data for testing

## Done When

- [ ] Design tokens are configured (colors, typography, spacing)
- [ ] Google Fonts are loaded (Space Grotesk, Inter, IBM Plex Mono)
- [ ] Data model types are defined in TypeScript
- [ ] Database schema is created and migrated
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Sample data can be loaded for testing

---

# Milestone 2: Shell

## Goal

Implement the application shell with Arc Browser-inspired sidebar navigation, user menu, and responsive layout.

## Overview

The shell provides the core layout structure for YourCo:

- Collapsible sidebar with navigation icons and labels
- User menu with avatar and dropdown
- Responsive design with mobile menu overlay
- Keyboard shortcuts for power users

**Key Features:**

- View sidebar in collapsed (icons only) or expanded (icons + labels) mode
- Hover to "peek" navigation labels when collapsed
- Toggle sidebar with `Cmd/Ctrl + B`
- Mobile: hamburger menu with overlay navigation

## Components

Copy the shell components from `product-plan/shell/components/`:

| Component         | Description                                       |
| ----------------- | ------------------------------------------------- |
| `AppShell`        | Main layout wrapper with sidebar and content area |
| `MainNav`         | Navigation links with Lucide icons                |
| `UserMenu`        | User avatar, name, and dropdown menu              |
| `useLocalStorage` | Hook for persisting sidebar state                 |

### Dependencies

The shell components require:

- `lucide-react` for icons
- React 18+

```bash
npm install lucide-react
```

## Integration

### 1. Wrap Your App

```tsx
import { AppShell } from "./shell/components";

function App() {
  const navigationItems = [
    { label: "Dashboard", href: "/", isActive: location.pathname === "/" },
    {
      label: "Clients",
      href: "/clients",
      isActive: location.pathname.startsWith("/clients"),
    },
    {
      label: "Projects",
      href: "/projects",
      isActive: location.pathname.startsWith("/projects"),
    },
    {
      label: "Tasks",
      href: "/tasks",
      isActive: location.pathname.startsWith("/tasks"),
    },
    {
      label: "Invoicing",
      href: "/invoicing",
      isActive: location.pathname.startsWith("/invoicing"),
    },
    {
      label: "Settings",
      href: "/admin",
      isActive: location.pathname.startsWith("/admin"),
    },
  ];

  const user = {
    name: "Alex Rivera",
    avatarUrl: undefined,
  };

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => navigate(href)}
      onLogout={() => signOut()}
    >
      <Routes>{/* Your routes */}</Routes>
    </AppShell>
  );
}
```

### 2. Wire Up Navigation

The `onNavigate` callback receives the `href` when a nav item is clicked.

### 3. Wire Up User Menu

The shell expects user info from your auth context.

## Sidebar States

| State     | Width | Labels  | When                      |
| --------- | ----- | ------- | ------------------------- |
| Collapsed | 64px  | Hidden  | User collapsed via toggle |
| Peek      | 200px | Visible | Hover when collapsed      |
| Expanded  | 240px | Visible | Default or user expanded  |

The sidebar state persists to localStorage (`yourco-sidebar-state`).

## Keyboard Shortcuts

| Shortcut       | Action                            |
| -------------- | --------------------------------- |
| `Cmd/Ctrl + B` | Toggle sidebar collapsed/expanded |

## Files to Reference

- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — React components

## Done When

- [ ] Shell renders with navigation sidebar
- [ ] Navigation links to correct routes
- [ ] Active state highlights current section
- [ ] Sidebar collapses and expands
- [ ] Peek works on hover when collapsed
- [ ] `Cmd/Ctrl + B` toggles sidebar
- [ ] User menu shows current user
- [ ] Logout works
- [ ] Responsive on mobile (hamburger menu)

---

# Milestone 3: Clients

## Goal

Implement client relationship management with MEDDPICC qualification framework, stakeholder mapping, opportunity tracking, and pipeline visualization.

## Overview

The Clients section is the heart of YourCo's CRM functionality:

- Manage client relationships with health scoring
- Track stakeholders with MEDDPICC roles (Champion, Economic Buyer, etc.)
- Manage opportunities through deal stages
- Visualize pipeline in list or Kanban view
- Onboard new clients with a guided wizard

## What to Implement

### 1. Client List (`ClientsList`)

**Features:**

- Summary cards: Active Clients, Total Pipeline, Avg Health Score, At Risk
- Search by client name
- View toggle: List (table) or Pipeline (Kanban by status)
- Columns: Client name, Champion, Health score, Pipeline value, Open opportunities

**API Endpoints:**

```
GET /api/clients
GET /api/clients?status=active
GET /api/clients/stats
```

### 2. Client Detail (`ClientDetail`)

**Tabs:**
| Tab | Content |
|-----|---------|
| Overview | Key stakeholders + recent activity |
| MEDDPICC | 6-field qualification grid |
| Stakeholders | Contact cards with roles |
| Opportunities | Deal list with stage progress |
| Activity | Timeline of interactions |

### 3. MEDDPICC Framework

| Field             | Description                          |
| ----------------- | ------------------------------------ |
| Metrics           | Quantifiable outcomes customer wants |
| Decision Criteria | Technical and business requirements  |
| Decision Process  | Steps and timeline to buy            |
| Paper Process     | Legal, procurement, contracts        |
| Identified Pain   | Current challenges and impact        |
| Competition       | Alternatives being evaluated         |

### 4. Stakeholder Management

**MEDDPICC Roles:** champion, economic_buyer, technical_evaluator, coach, blocker, user

**Engagement Levels:** high, medium, low, disengaged

### 5. Opportunity Pipeline

**Deal Stages:** lead → qualified → discovery → proposal → negotiation → closed_won/closed_lost

### 6. Client Onboarding Wizard

**4 Steps:** Company Details → Key Contacts → Documents → Review & Launch

## Files to Reference

- `product-plan/sections/clients/` — Components and tests
- `product-plan/data-model/types.ts` — Client, Stakeholder, Opportunity types

## Done When

- [ ] Client list displays with search and filter
- [ ] List/Pipeline view toggle works
- [ ] Client detail loads with all tabs
- [ ] MEDDPICC fields can be edited and saved
- [ ] Stakeholders can be added, edited, deleted
- [ ] Opportunities display with stage progress bar
- [ ] Client onboarding wizard completes successfully

---

# Milestone 4: Projects

## Goal

Implement project management with multi-view lists, phase-based planning, team assignments, budget tracking, and timeline visualization.

## Overview

The Projects section enables delivery management for client engagements:

- View projects in list, Kanban, or timeline format
- Track progress with phases and tasks
- Manage team assignments and workload
- Monitor budgets and billable hours

## What to Implement

### 1. Project List (`ProjectsList`)

**Views:** List, Kanban (by status), Timeline

**Summary Cards:** Active Projects, Total Budget, Average Progress, Projects At Risk

### 2. Project Detail (`ProjectDetail`)

**Tabs:** Overview, Phases, Team, Time, Files

### 3. Project Status & Health

**Status:** planning, active, on_hold, completed

**Health Calculation:** on_track, at_risk, behind (based on progress vs. timeline)

### 4. Phase Management

Projects contain ordered phases, each with tasks.

### 5. Team Assignments

Track who's assigned to a project and their role (lead, member, reviewer).

### 6. Budget Tracking

- `budget` — Total project budget
- `hourlyBudget` — Budget in hours
- `hoursLogged` — Actual hours from time entries

### 7. Project Timeline (`ProjectTimeline`)

Gantt-style horizontal bar chart with phases and tasks.

### 8. Project Onboarding

**Steps:** Project Details → Phases → Team → Review

## Files to Reference

- `product-plan/sections/projects/` — Components and tests
- `product-plan/data-model/types.ts` — Project, Phase types

## Done When

- [ ] Project list displays with three view options
- [ ] Progress bars calculate from tasks
- [ ] Health indicators show correctly
- [ ] Phases can be created, edited, reordered
- [ ] Team members can be assigned
- [ ] Timeline view renders phases and tasks

---

# Milestone 5: Tasks

## Goal

Implement task management with Kanban board, list view, bulk actions, priority/status tracking, and time estimates.

## Overview

The Tasks section provides day-to-day work management:

- Kanban board for visual task flow
- List view with multi-select and bulk actions
- Priority and status tracking
- Time estimation and logging
- Due date monitoring with overdue alerts

## What to Implement

### 1. Tasks Board (`TasksBoard`)

**Kanban Columns:** Backlog, In Progress, Review, Done

**Drag & Drop:** Drag cards between columns to update status.

### 2. Tasks List (`TasksList`)

**Features:** Checkbox selection, sortable columns, filters, search

**Bulk Actions:** Change status, change priority, assign, delete

### 3. Task Detail (`TaskDetail`)

Title, description, status, priority, assignee, due date, time tracking.

### 4. Task Priority

**Values:** low, medium, high, critical

### 5. Due Date & Overdue Logic

Display overdue warning when past due date.

### 6. Time Tracking

Estimated hours vs. logged hours with progress bar.

## Files to Reference

- `product-plan/sections/tasks/` — Components and tests
- `product-plan/data-model/types.ts` — Task type

## Done When

- [ ] Kanban board renders with 4 columns
- [ ] Drag-and-drop updates task status
- [ ] List view with bulk actions works
- [ ] Priority and status badges display correctly
- [ ] Due dates show overdue state
- [ ] Time tracking displays correctly

---

# Milestone 6: Dashboards

## Goal

Implement an internal executive dashboard with KPI cards and charts, plus a white-labeled client portal for external project visibility.

## What to Implement

### 1. Internal Dashboard (`InternalDashboard`)

**KPI Cards:** Pipeline Value, Active Projects, Open Tasks, Avg Client Health

**Charts (Recharts):**

- Revenue Forecast — Line chart
- Task Completion — Bar chart
- Pipeline by Stage — Horizontal bar
- Project Status — Donut chart

**Lists:** Upcoming Deadlines, Recent Activity

Install Recharts: `npm install recharts`

### 2. Client Portal (`ClientPortal`)

**Access:** `/portal/:token` (token-based, no login required)

**Features:**

- Custom header with client name
- Client accent color theming
- Project cards with progress
- Task list (client-visible only)
- Activity feed

### 3. Portal Security

Token generation, validation, and revocation.

## Files to Reference

- `product-plan/sections/dashboards/` — Components and tests

## Done When

- [ ] Internal dashboard loads with KPI cards
- [ ] Charts render with Recharts
- [ ] Time period filter works
- [ ] Client portal validates token
- [ ] Client portal shows filtered data
- [ ] Client accent color applies

---

# Milestone 7: Invoicing

## Goal

Implement invoicing with time entry logging, invoice generation, payment tracking, and billing workflow management.

## What to Implement

### 1. Invoice List (`InvoicesList`)

**Summary Cards:** Outstanding, Overdue, Paid This Month, Uninvoiced Hours

**Status:** draft, sent, paid, overdue

### 2. Invoice Detail (`InvoiceDetail`)

Line items, totals, actions (Send, Download PDF, Mark Paid).

### 3. Invoice Generation (`InvoiceGenerate`)

**Steps:** Select Client → Select Time Entries → Review & Adjust → Finalize

### 4. Time Entry List (`TimeEntryList`)

Log time against tasks and projects with billable flag.

### 5. Time Entry Week View (`TimeEntryWeekView`)

Grid of projects × days for quick entry.

### 6. Currency Formatting

Store amounts in cents, display in dollars.

### 7. Invoice Number Generation

Format: `INV-2024-001`

## Files to Reference

- `product-plan/sections/invoicing/` — Components and tests
- `product-plan/data-model/types.ts` — Invoice, TimeEntry types

## Done When

- [ ] Invoice list displays with filtering
- [ ] Invoice generation wizard works
- [ ] Time entries can be logged
- [ ] Week view allows quick entry
- [ ] Send and Mark Paid actions work
- [ ] Currency formatting correct

---

# Milestone 8: Admin

## Goal

Implement admin functionality with user management, role-based access control, client assignments, audit logging, and organization settings.

## What to Implement

### 1. User Management (`UserManagement`)

**Summary Cards:** Total Users, Active Users, Pending Invites, MFA Enabled %

**Actions:** Invite, edit, deactivate, reset password

### 2. User Roles

**Roles:** admin, consultant, viewer, client

Each role has specific permissions for clients, projects, invoices, and admin access.

### 3. User Invitation

Invite by email, user accepts and sets password.

### 4. Client Assignments (`ClientAssignments`)

Matrix of consultants × clients with assignment roles (lead, support).

### 5. Audit Log (`AuditLog`)

Log all system actions with user, action, entity, changes, timestamp.

### 6. Settings (`Settings`)

Organization, invoicing, security, and integration settings.

### 7. Data Management

Export, import, backup, and GDPR deletion.

## Files to Reference

- `product-plan/sections/admin/` — Components and tests
- `product-plan/data-model/types.ts` — User, AuditLog types

## Done When

- [ ] User list with roles and status
- [ ] User invitation workflow works
- [ ] Client assignments matrix works
- [ ] Audit log captures actions
- [ ] Settings can be updated
- [ ] Admin routes protected by role

---

# Implementation Checklist

## Foundation (Milestone 1)

- [ ] Design tokens configured
- [ ] Data model types defined
- [ ] Database schema created
- [ ] All routes defined

## Shell (Milestone 2)

- [ ] App shell with sidebar
- [ ] Navigation working
- [ ] User menu working
- [ ] Responsive design

## Core Sections (Milestones 3-8)

- [ ] Clients section complete
- [ ] Projects section complete
- [ ] Tasks section complete
- [ ] Dashboards section complete
- [ ] Invoicing section complete
- [ ] Admin section complete

## Quality Checks

- [ ] All empty states implemented
- [ ] Error handling in place
- [ ] Loading states displayed
- [ ] Tests passing
- [ ] Responsive on mobile
