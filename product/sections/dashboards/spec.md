# Dashboards Section Specification

## Overview

The Dashboards section provides two distinct views: an internal dashboard for team members with pipeline metrics, project health, and activity tracking; and a configurable client portal for external stakeholders to view project status and progress.

## Navigation

**Primary Nav:** Dashboard (first item, home view)
**URL Structure:**
- `/` or `/dashboard` → InternalDashboard (default landing page)
- `/portal/:token` → ClientPortal (public, token-authenticated)

---

## Screens

### InternalDashboard

The team's command center for monitoring pipeline, projects, tasks, and client health at a glance.

**Header:**
- Welcome message with user name
- Date range selector: Today, This Week, This Month, This Quarter, Custom
- Quick action buttons: Log Activity, Create Opportunity, Add Task

**Layout:**
```
+------------------------------------------+
| Welcome, Alex!          [Today ▼] [+ ▼]  |
+------------------------------------------+
| Pipeline    | Projects  | Overdue | Health|
| $247.5K     | 3 active  | 3 tasks | 72%   |
| +12% ↑      | 42% avg   | ⚠       | 2 risk|
+------------------------------------------+
| Pipeline by Stage      | Revenue Forecast |
| [========= Lead      ] | [line chart     ]|
| [======== Qualified  ] | [monthly proj   ]|
+------------------------------------------+
| Task Completion        | Hours by Project |
| [donut chart]          | [stacked bar    ]|
+------------------------------------------+
| Recent Activity                          |
| [avatar] Alex logged call with Sarah...  |
| [avatar] Jamie moved task to Review...   |
+------------------------------------------+
```

**Metric Cards (4 columns):**

| Card | Primary Value | Secondary | Color | Click Action |
|------|---------------|-----------|-------|--------------|
| Pipeline Value | Weighted value ($) | % change from period | `blue-500` | → Clients pipeline view |
| Active Projects | Count | Avg progress % | `emerald-500` | → Projects list |
| Overdue Tasks | Count | Warning indicator | `rose-500` | → Tasks list (filtered) |
| Client Health | Avg score (0-100) | At-risk count | `amber-500` | → Clients (sorted by health) |

**Charts:**

| Chart | Type | Data Source | Interaction |
|-------|------|-------------|-------------|
| Pipeline by Stage | Horizontal bar | Opportunities grouped by stage | Click bar → filter to stage |
| Revenue Forecast | Line | Monthly expected close values | Hover for details |
| Task Completion | Donut | Tasks by status | Click segment → filter tasks |
| Hours by Project | Stacked bar | Weekly time entries by project | Hover for breakdown |

**Activity Feed:**
- Real-time feed of activities across all clients
- Each item shows: User avatar, action description, target, relative timestamp
- Filter buttons: All, Calls, Meetings, Emails, Status Changes
- Maximum 20 items visible, "Load more" pagination
- Click activity → navigate to related entity

**Upcoming Deadlines (sidebar or below):**
- Tasks, phases, and opportunities due within 7 days
- Sorted by due date (soonest first)
- Color-coded: Today (amber), Tomorrow (blue), This Week (stone)
- Click → navigate to entity detail

---

### ClientPortal

External-facing status page for clients to view their project progress.

**Purpose:** Provide transparency to clients without granting internal system access.

**Access Control:**
- Unique access token per client portal
- Optional password protection
- Configurable expiration date
- Audit log of all portal views

**Configuration (set by internal user):**

| Setting | Options | Default |
|---------|---------|---------|
| Authentication | Link-only, Password, SSO (future) | Link-only |
| Expiration | None, 7 days, 30 days, 90 days, Custom | None |
| Visible Sections | Projects, Tasks, Timeline, Status | All |
| Branding | Logo upload, Accent color | YourCo defaults |

**Portal Layout:**
```
+------------------------------------------+
| [Client Logo]           Powered by YourCo|
+------------------------------------------+
| Project Status          Overall: Healthy |
+------------------------------------------+
| EasyVista Implementation                 |
| [==========75%==========]    Active      |
| Phases: Setup ✓ | Config ● | Testing ○   |
+------------------------------------------+
| Upcoming Tasks                           |
| ○ User Acceptance Testing    Due Mar 28  |
| ○ Go-Live Preparation        Due Apr 5   |
+------------------------------------------+
| Last updated: 2 hours ago                |
+------------------------------------------+
```

**Portal Sections:**

| Section | Content | Visibility |
|---------|---------|------------|
| Projects | Cards with progress bars, phase status | Configurable |
| Tasks | List of active tasks with due dates | Configurable |
| Timeline | Simplified Gantt view of phases | Configurable |
| Status | Overall health indicator, summary | Always visible |

**Branding Options:**
- Upload client logo (displayed in header)
- Set accent color (buttons, progress bars)
- Custom welcome message (optional)

**Security Features:**
- Access tokens are UUID v4, not guessable
- Revoke access instantly from admin
- All portal views logged in audit trail
- No PII visible (stakeholder names only, no emails/phones)

---

## User Flows

### Flow 1: Morning Dashboard Review

1. User logs in, lands on Internal Dashboard
2. Scans metric cards for anomalies
3. Notices 3 overdue tasks - clicks card
4. Task list opens with overdue filter applied
5. Reviews and updates task statuses
6. Returns to dashboard, overdue count decreases

### Flow 2: Pipeline Health Check

1. User views Pipeline by Stage chart
2. Notices many deals stuck in "Qualified" stage
3. Clicks the Qualified bar
4. Clients view opens filtered to Qualified opportunities
5. Reviews each opportunity, identifies blockers
6. Logs activities for follow-up calls

### Flow 3: Configure Client Portal

1. User opens Client Detail for "Acme Corp"
2. Navigates to Portal tab
3. Clicks "Create Portal Access"
4. Configures:
   - Authentication: Password-protected
   - Sections: Projects, Tasks, Status (not Timeline)
   - Accent color: Acme's brand blue (#2563EB)
5. Saves configuration
6. Copies generated link and password
7. Emails to client's Champion (Sarah Chen)

### Flow 4: Client Views Their Portal

1. Client clicks shared portal link
2. Enters password
3. Sees branded status page with their projects
4. Clicks project card to see phase breakdown
5. Reviews upcoming tasks and due dates
6. Notes overall "Healthy" status
7. Portal view logged for internal audit

### Flow 5: Revoke Portal Access

1. User notices security concern or project ends
2. Opens Client Detail → Portal tab
3. Clicks "Revoke Access"
4. Confirms revocation
5. Old link immediately stops working
6. Audit log records revocation

---

## UI Components

### MetricCard
```
+---------------------------+
| Pipeline Value      📈    |
| $247,500                  |
| +12% from last month      |
+---------------------------+
```
- Icon on right (pipeline, folder, alert, heart)
- Large value with formatting ($, %, count)
- Change indicator with direction arrow
- Hover shows tooltip with details
- Click navigates to related section

### ActivityItem
```
+------------------------------------------+
| [👤] Alex Rivera           2 hours ago   |
| Logged call with Sarah Chen at Acme Corp |
| "Discussed Q2 timeline and budget..."    |
+------------------------------------------+
```
- User avatar on left
- Action description with linked entity names
- Truncated description (expand on click)
- Relative timestamp

### DeadlineItem
```
+------------------------------------------+
| ⚡ User Acceptance Testing    Due Today  |
| EasyVista Implementation • Acme Corp     |
+------------------------------------------+
```
- Priority/type icon
- Task/phase/opportunity title
- Due date badge (color-coded by urgency)
- Project and client context

### PortalProjectCard
```
+------------------------------------------+
| EasyVista ITSM Implementation            |
| [==========75%==========]    Active      |
| Phases: Setup ✓ | Config ● | Testing ○   |
+------------------------------------------+
```
- Project name (large)
- Progress bar with percentage
- Status badge
- Phase indicators (✓ complete, ● active, ○ pending)

### PortalConfigForm
```
+------------------------------------------+
| Portal Access Configuration              |
|------------------------------------------|
| Authentication: [Password ▼]             |
| Password: [••••••••] [Generate]          |
| Expires: [Never ▼]                       |
|------------------------------------------|
| Visible Sections:                        |
| [✓] Projects  [✓] Tasks                  |
| [ ] Timeline  [✓] Status                 |
|------------------------------------------|
| Branding:                                |
| Logo: [Upload]  Color: [#3B82F6]         |
|------------------------------------------|
| [Cancel]              [Save & Generate]  |
+------------------------------------------+
```

---

## Keyboard Shortcuts

| Shortcut | Context | Action |
|----------|---------|--------|
| `r` | Dashboard | Refresh all data |
| `1` | Dashboard | Focus Pipeline card |
| `2` | Dashboard | Focus Projects card |
| `3` | Dashboard | Focus Tasks card |
| `4` | Dashboard | Focus Health card |
| `a` | Dashboard | Open quick Log Activity modal |
| `o` | Dashboard | Open quick Create Opportunity modal |
| `t` | Dashboard | Open quick Add Task modal |
| `/` | Dashboard | Focus global search |
| `f` | Dashboard | Open date range filter |
| `?` | Any view | Show keyboard shortcuts |

---

## Responsive Behavior

**Desktop (≥1024px):**
- 4-column metric cards
- 2x2 chart grid
- Activity feed in right sidebar (30% width)
- Upcoming deadlines below charts

**Tablet (768-1023px):**
- 2-column metric cards (2 rows)
- Full-width charts, stacked vertically
- Activity feed below charts
- Upcoming deadlines as horizontal scroll

**Mobile (<768px):**
- Single column metric cards (swipeable carousel)
- Charts as full-width, swipeable carousel
- Activity feed as separate tab
- Upcoming deadlines as vertical list
- Floating action button for quick actions

**Client Portal Responsive:**
- Desktop: Full layout with sidebars
- Tablet: Stacked sections
- Mobile: Accordion sections, expandable

---

## Accessibility

### General
- All charts have table-based fallback for screen readers
- Metric cards are focusable with arrow key navigation
- Activity feed items are announced with full context
- Color is never the sole indicator (icons + text labels)

### Metric Cards
- `role="button"` with `aria-label` describing value and context
- Focus visible state (ring + slight scale)
- Arrow keys navigate between cards
- Enter/Space activates (navigates to related section)

### Charts
- Each chart has `aria-label` with summary
- Table fallback: "View as table" link below chart
- Focus traps within chart for data point navigation
- Escape returns focus to chart container

### Activity Feed
- `role="feed"` with `aria-busy` during load
- Each item is `role="article"` with `aria-label`
- New items announced via `aria-live="polite"`
- Keyboard navigation: Arrow keys between items, Enter to open

### Client Portal
- Fully keyboard navigable
- High contrast mode support
- Reduced motion preference respected
- All images have alt text
- Progress bars have `aria-valuenow` and `aria-valuetext`

---

## Design Notes

### Color Palette

**Metric Card Colors:**
- Pipeline: `blue-500` (primary blue)
- Projects: `emerald-500` (success green)
- Overdue: `rose-500` (warning red)
- Health: `amber-500` (caution yellow)

**Change Indicators:**
- Positive: `emerald-500` with ↑ arrow
- Negative: `rose-500` with ↓ arrow
- Neutral: `stone-400` with → arrow

**Health Levels:**
- Healthy (70-100): `emerald-500`
- At Risk (40-69): `amber-500`
- Critical (0-39): `rose-500`

### Typography

- Welcome message: `text-2xl font-bold`
- Metric value: `text-3xl font-semibold tabular-nums`
- Metric label: `text-sm font-medium text-stone-500`
- Chart title: `text-sm font-semibold`
- Activity text: `text-sm text-stone-700`
- Timestamp: `text-xs text-stone-400`

### Spacing

- Section gap: 24px
- Card gap: 16px
- Internal padding: 16px
- Chart margins: 12px

### Shadows & Borders

- Metric cards: `rounded-xl shadow-sm border border-stone-200`
- Charts: `rounded-lg bg-white shadow-sm`
- Activity items: No shadow, `border-b border-stone-100`
- Portal cards: `rounded-lg shadow-md` (more prominent)

### Animations

- Metric value changes: Count-up animation
- Chart transitions: 300ms ease-out
- Activity feed: Slide-in for new items
- Page load: Skeleton loaders for each section

### Charts Library

Recommended: **Recharts** or **Chart.js** with React wrapper
- Consistent styling with design system colors
- Responsive by default
- Accessibility features built-in

---

## Integration Points

### Data Sources

| Metric | Source | Calculation |
|--------|--------|-------------|
| Pipeline Value | Opportunities table | SUM(value * probability) |
| Active Projects | Projects table | COUNT where status='active' |
| Overdue Tasks | Tasks table | COUNT where due_date < today AND status != 'done' |
| Client Health | Clients + Stakeholders | Composite score (see master plan) |

### Real-Time Updates

- Activity feed: Supabase Realtime subscription
- Metric cards: Polling every 60 seconds (or on focus)
- Charts: Cached, refresh on explicit action

### Portal Data

- Filtered to single client's projects/tasks
- No user PII (emails, phones) exposed
- Cached with 5-minute TTL
- Invalidated on project/task changes

---

## Security Considerations

### Internal Dashboard
- Requires authentication
- Shows data based on user's client assignments
- Consultant sees only assigned clients' data
- Admin sees all data

### Client Portal
- Public access via unique token
- Optional password layer
- No mutation endpoints (read-only)
- All access logged to audit trail
- Token can be revoked instantly
- Expiration enforced server-side
