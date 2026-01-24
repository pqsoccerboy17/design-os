# Projects Section Specification

## Overview

The Projects section provides comprehensive project lifecycle management for consulting engagements. It tracks projects through phases, manages tasks and time entries, and provides visual timeline views. Projects can originate from won Opportunities (inheriting budget and stakeholders) or be created independently.

## Navigation

**Primary Nav:** Projects (third item after Dashboard, Clients)
**URL Structure:**
- `/projects` → ProjectsList
- `/projects/new` → ProjectOnboarding
- `/projects/:id` → ProjectDetail
- `/projects/:id/timeline` → ProjectTimeline

---

## Screens

### ProjectsList

The main projects view with status overview and progress indicators.

**Layout:**
- Header with title, search, and "New Project" button
- View toggle: List | Kanban (by status) | Timeline (mini-gantt)
- Filterable table/kanban with sorting

**List View Columns:**

| Column | Description | Sortable |
|--------|-------------|----------|
| Project | Name + status badge (planning/active/on_hold/completed/cancelled) | Yes |
| Client | Client name (link to ClientDetail) | Yes |
| Progress | Visual progress bar (% tasks complete) | Yes |
| Budget | Total budget / Hours used indicator | Yes |
| Timeline | Start - End date range, overdue warning | Yes |
| Team | Avatars of assigned consultants | No |
| Actions | Menu (View, Edit, Archive) | No |

**Kanban View:**
- Columns: Planning, Active, On Hold, Completed, Cancelled
- Cards show: Project name, Client name, Progress bar, Timeline
- Drag-and-drop to change status (creates Activity log)
- Color-coded by health/on-track status

**Timeline View (Mini-Gantt):**
- Horizontal bars showing project timelines
- Color-coded by status
- Click to navigate to ProjectDetail

**Filters:**
- Status: All, Planning, Active, On Hold, Completed, Cancelled
- Client: Client multi-select
- Assigned To: User multi-select
- Date Range: Projects active in date range

**Empty State:**
"No projects yet. Create a project to start tracking work."
[+ New Project] button

---

### ProjectDetail

Comprehensive view of a single project with tabbed navigation.

**Header:**
- Project name (large)
- Status badge (pill with color)
- Client name (link back to ClientDetail)
- Source badge if from Opportunity (link to OpportunityDetail)
- Progress indicator (circular or bar)
- Action buttons: Edit, Log Time, Add Task, Add Phase

**Tabs (6 total):**

#### Overview Tab
- **Summary Card:** Status, Budget, Timeline (start/end), Created date
- **Progress Metrics:** Tasks (x/y complete), Phases (x/y complete), Hours (used/budget)
- **Key Stakeholders:** Inherited from Client, shows Champion and project contacts
- **Recent Activity:** Last 5 activities with timeline

#### Phases Tab
- Ordered list of project phases
- Each phase shows: Name, Status badge, Date range, Task count, Progress bar
- Drag to reorder phases
- Click phase to expand inline task list
- "+ Add Phase" button
- Phase detail slide-over for editing

**Phase Slide-over:**
- Name (required)
- Status (pending/active/completed)
- Start Date, End Date
- Description (optional)
- Task list for this phase

#### Tasks Tab
- Table of all tasks for this project
- Columns: Title, Phase, Assignee, Status, Priority, Due Date, Hours (est/actual), Actions
- Bulk actions: Assign, Change Status, Change Priority
- "+ Add Task" button
- Click row opens Task slide-over

**Task Slide-over:**
- Title (required)
- Description (rich text)
- Phase (dropdown, optional)
- Assigned To (user dropdown)
- Stakeholders (multi-select from client stakeholders)
- Status: Backlog, In Progress, Review, Done
- Priority: Low, Medium, High, Critical
- Effort: Light, Medium, Heavy
- Due Date
- Estimated Hours, Actual Hours
- Is Milestone checkbox
- Is Critical Path checkbox
- Activity timeline for this task

#### Time Tab
- Time entries for this project
- Summary at top: Total Hours, Billable Hours, Budget Remaining
- Table columns: Date, User, Task, Hours, Description, Billable, Invoice Status
- Filter by: Date range, User, Billable status
- "+ Log Time" button
- Quick time entry form (inline)

**Time Entry Form:**
- Date (defaults to today)
- Task (dropdown, optional)
- Hours (required)
- Description (optional)
- Billable checkbox (defaults based on project settings)

#### Invoices Tab (read-only, links to Invoicing section)
- Table of invoices covering this project
- Columns: Invoice #, Amount, Status, Due Date, Paid Date
- Click row navigates to Invoicing section
- Summary: Total Invoiced, Total Paid, Outstanding

#### Activity Tab
- Full activity timeline (newest first)
- Filter by type: All, Tasks, Time, Status Changes, Notes
- Each entry shows: Type icon, Subject, User, Date
- Auto-logged: Phase changes, Status changes, Task completions, Time entries
- "+ Add Note" button for manual entries

---

### ProjectTimeline (Gantt)

Visual timeline view of project phases and tasks.

**Header:**
- Project name
- View controls: Zoom (Day/Week/Month/Quarter), Scroll to Today
- Export button (PNG, CSV)

**Timeline View:**
- Horizontal time axis (configurable granularity)
- Rows for each Phase (expandable to show Tasks)
- Bars show: Start date to End date, filled by progress
- Milestones as diamond markers
- Critical path highlighting (optional toggle)
- Dependencies shown as connecting lines (future enhancement)

**Sidebar (collapsible):**
- Phase/Task list matching timeline rows
- Status indicators
- Assignee avatars

**Interactions:**
- Drag bar ends to adjust dates
- Click bar to open Task/Phase slide-over
- Hover shows tooltip with details
- Pinch/scroll to zoom on touch devices

**Today Marker:**
- Vertical line showing current date
- Projects behind schedule: Red tint on overdue portions

---

### ProjectOnboarding

Wizard for creating a new project.

**Step 1: Basic Info**
- Project name (required)
- Client (dropdown, required)
- Description (optional)
- Status: Planning (default)

**Step 2: Timeline & Budget**
- Start Date
- End Date
- Budget (optional, pre-filled if from Opportunity)

**Step 3: Initial Phases (Optional)**
- Skip or add phases
- Quick add: Name, Start Date, End Date
- Can add multiple

**Step 4: Review**
- Summary of entered data
- [Create Project] button

**After Creation:**
- Navigate to new ProjectDetail
- Toast: "Project created successfully"

**From Won Opportunity:**
- Pre-fills: Name (from Opportunity), Client, Budget (from deal value)
- Shows source badge linking back to Opportunity

---

## User Flows

### Flow 1: Create Project from Won Opportunity

1. User marks Opportunity as "Won" in Clients section
2. Modal offers "Create Project" option
3. Project name pre-filled from Opportunity name
4. Budget pre-filled from Opportunity value
5. Client automatically linked
6. Stakeholders inherited from Client
7. User confirms and Project created
8. Redirected to new ProjectDetail
9. Activity logged on both Opportunity and Project

### Flow 2: Add Phase with Tasks

1. User on ProjectDetail Phases tab
2. Clicks "+ Add Phase"
3. Phase slide-over opens
4. Enters: Name "Discovery", Status "Pending", Dates
5. Saves phase
6. Clicks into phase row to expand
7. Clicks "+ Add Task" within phase
8. Task form: "Stakeholder Interviews", Due Date, Assignee
9. Saves task
10. Phase shows 1 task, 0% complete

### Flow 3: Log Time Entry

1. User on ProjectDetail Time tab
2. Clicks "+ Log Time" or uses quick entry
3. Selects Task (optional)
4. Enters: Date (defaults today), Hours, Description
5. Billable checkbox (defaults based on project/client settings)
6. Submits
7. Time entry appears in list
8. Project hours summary updates
9. If task selected, Task.actualHours increments

### Flow 4: View Gantt and Adjust Timeline

1. User navigates to `/projects/:id/timeline`
2. Gantt renders with phases and tasks
3. User notices Phase 2 overlaps deadline
4. Drags end of Phase 1 bar earlier
5. Confirmation modal: "Update end date to March 15?"
6. Confirms
7. Phase dates updated
8. Gantt re-renders with new layout
9. Activity logged: "Phase 1 end date changed"

### Flow 5: Mark Task Complete and Update Progress

1. User on ProjectDetail Tasks tab
2. Finds task "Deliver Final Report"
3. Clicks status dropdown, selects "Done"
4. Task row updates with checkmark
5. Phase progress bar updates (e.g., 3/5 tasks)
6. Project progress updates
7. Activity auto-logged: "Task completed: Deliver Final Report"
8. If milestone, special notification appears

---

## UI Components

### ProjectCard (for kanban)
```
+-----------------------------+
| EasyVista Implementation    |
| Acme Corporation            |
| [========    ] 65%          |
| Apr 1 - Sep 30    3 tasks   |
| [Alex] [Jamie]              |
+-----------------------------+
```

### ProgressBar
```
[##########--------] 65%
```
Colors: Emerald for on-track, Amber for at-risk, Rose for behind

### PhaseRow (expandable)
```
+- Phase 1: Discovery (Completed) -------- Apr 1-30 -- [4/4] --+
|  > Task 1: Stakeholder Interviews        Done    Alex        |
|  > Task 2: Current State Doc             Done    Alex        |
|  > Task 3: Technical Architecture        Done    Jamie       |
|  > Task 4: Project Kickoff               Done    Alex        |
+--------------------------------------------------------------+
```

### GanttBar
```
Discovery    [==========] 100%  <> Milestone
Setup        [======    ]  60%
Config       [----------]   0%
```

### TimeEntryRow
```
Mar 20  |  Alex Rivera  |  Workflow Optimization  |  4h  |  Billable  |  -
```

### TaskStatusBadge
- Backlog: `stone-400` with dashed border
- In Progress: `blue-500`
- Review: `amber-500`
- Done: `emerald-500` with checkmark

---

## Keyboard Shortcuts

| Shortcut | Context | Action |
|----------|---------|--------|
| `n` | ProjectsList | New Project |
| `t` | ProjectDetail | Add Task |
| `p` | ProjectDetail | Add Phase |
| `l` | ProjectDetail | Log Time |
| `e` | Any detail view | Edit current item |
| `/` | Any list view | Focus search |
| `1-6` | ProjectDetail | Switch tabs (Overview, Phases, Tasks, Time, Invoices, Activity) |
| `g` then `t` | ProjectDetail | Go to Timeline view |
| `Escape` | Slide-over open | Close slide-over |
| `Enter` | Task row | Open task slide-over |
| `Space` | Task row | Toggle task status |
| `Cmd+S` | Edit mode | Save changes |

---

## Responsive Behavior

**Desktop (>=1024px):**
- Full table with all columns
- Kanban with 5 columns visible
- Gantt with month/week zoom
- Two-column layout for detail views

**Tablet (768-1023px):**
- Table hides Team, Budget columns
- Kanban scrolls horizontally
- Gantt scrolls, shows week view
- Single-column layout for details

**Mobile (<768px):**
- Card list instead of table
- Kanban shows as grouped list by status
- Gantt shows as phase list with progress bars
- Tabs become bottom sheet navigation
- Slide-overs become full-screen modals

---

## Accessibility

- All interactive elements have focus states
- Status badges have `aria-label` with full status name (e.g., "Status: Active")
- Progress indicators announce percentage (e.g., "Progress: 65% complete")
- Timeline/Gantt has text alternatives and screen reader-friendly summary
- Keyboard navigation for all actions
- Logical focus order (left-to-right, top-to-bottom)
- Focus trapped in modals/slide-overs until dismissed
- Skip links for main content areas
- Gantt chart has keyboard alternative (list view with date editing)

**Progress Bars:**
- `role="progressbar"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Text label with percentage

**Gantt Chart:**
- `role="application"` for interactive region
- Each bar is a button with descriptive label
- Alternative table view for full accessibility
- Keyboard navigation: Arrow keys to move between bars

**Drag-and-Drop (Kanban, Phases):**
- Keyboard alternative: Select with Enter, arrow to destination, Enter to drop
- Live region announces move confirmation

---

## Design Notes

### Status Colors
- Planning: `stone-400`
- Active: `emerald-500`
- On Hold: `amber-500`
- Completed: `emerald-600`
- Cancelled: `rose-500`

### Priority Colors
- Low: `stone-400`
- Medium: `amber-500`
- High: `orange-500`
- Critical: `rose-500`

### Health/Progress Colors
- On Track: `emerald-500`
- At Risk: `amber-500`
- Behind: `rose-500`

### Typography
- Project name: `text-2xl font-semibold`
- Phase name: `text-lg font-medium`
- Task title: `text-base`
- Labels: `text-sm text-stone-500`

### Spacing
- Card padding: 16px (mobile), 24px (desktop)
- Section margins: 24px (mobile), 32px (desktop)
- Consistent 8px grid

### Borders & Shadows
- `rounded-xl` for cards (16px)
- `rounded-lg` for buttons (12px)
- Subtle shadows for elevated elements
- 1px borders in `stone-200`

### Icons
- Phase: Folder icon
- Task: Checkbox icon
- Time: Clock icon
- Milestone: Diamond icon
- Critical: Flag icon
