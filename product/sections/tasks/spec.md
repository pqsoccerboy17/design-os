# Tasks Section Specification

## Overview

The Tasks section provides a cross-project task management hub. While tasks are created within Projects, this section offers consolidated views for managing work across all projects: a kanban board for workflow management, a filterable list for detailed tracking, and individual task detail views with stakeholder mentions and time logging.

## Navigation

**Primary Nav:** Tasks (fourth item after Dashboard, Clients, Projects)
**URL Structure:**
- `/tasks` → TasksBoard (default)
- `/tasks/list` → TasksList
- `/tasks/:id` → TaskDetail

---

## Screens

### TasksBoard

Kanban board for visual task workflow management across all projects.

**Layout:**
- Header with title, search, and view toggle (Board | List)
- Filter bar with project/assignee/priority filters
- Four-column kanban board

**Kanban Columns:**

| Column | Status | Color |
|--------|--------|-------|
| Backlog | `backlog` | `stone-400` |
| In Progress | `in_progress` | `blue-500` |
| Review | `review` | `amber-500` |
| Done | `done` | `emerald-500` |

**Task Card Content:**
```
+-----------------------------+
| ⚑ Critical  🔴 High         |
| Task Title Here             |
| Project Name                |
| ⭐ Jane Doe  💰 Mike Brown  |
| Due: Mar 25    ⏱ 4h est    |
+-----------------------------+
```
- Critical flag (if applicable)
- Priority indicator
- Task title
- Project name (link to ProjectDetail)
- Stakeholder role badges (Champion ⭐, EB 💰, etc.)
- Due date with overdue warning
- Estimated hours

**Filters:**
- Project: Multi-select dropdown
- Assigned To: User multi-select
- Priority: Low, Medium, High, Critical
- Phase: Phase multi-select (grouped by project)
- Stakeholder Role: Filter by MEDDPICC role (Champion, EB, etc.)
- Due Date: Overdue, Today, This Week, This Month, No Date
- Effort: Light, Medium, Heavy

**Drag-and-Drop:**
- Drag cards between columns to change status
- Activity auto-logged: "Task status changed from X to Y"
- Optimistic update with rollback on failure

**Empty State:**
"No tasks match your filters. Try adjusting your filters or create a task from a project."
[View All Tasks] button (clears filters)

---

### TasksList

Filterable table view for detailed task tracking and bulk operations.

**Layout:**
- Header with title, search, and view toggle (Board | List)
- Same filter bar as TasksBoard
- Sortable data table with bulk actions

**Table Columns:**

| Column | Description | Sortable |
|--------|-------------|----------|
| Task | Title + milestone/critical badges | Yes |
| Project | Project name (link) | Yes |
| Phase | Phase name | Yes |
| Assignee | User avatar + name | Yes |
| Stakeholders | Role badges (max 3, +N indicator) | No |
| Status | Badge (Backlog, In Progress, Review, Done) | Yes |
| Priority | Badge (Low, Medium, High, Critical) | Yes |
| Due Date | Date with overdue indicator | Yes |
| Hours | Est / Actual (e.g., "4h / 2.5h") | Yes |
| Actions | Menu (View, Edit, Log Time, Delete) | No |

**Bulk Actions:**
- Select multiple rows via checkbox
- Available actions:
  - Change Status (dropdown)
  - Change Priority (dropdown)
  - Change Assignee (dropdown)
  - Delete (with confirmation)

**Row Indicators:**
- 🔴 Overdue: Red left border
- 💎 Milestone: Diamond icon
- ⚑ Critical Path: Flag icon

**Keyboard Navigation:**
- Arrow keys to navigate rows
- Enter to open TaskDetail
- Space to toggle selection
- `s` to change status of selected

**Empty State:**
"No tasks found. Create your first task from a project's task list."
[Go to Projects] button

---

### TaskDetail

Full task view with activity, comments, and time logging.

**Header:**
- Task title (large, editable inline)
- Status badge (clickable to change)
- Priority badge (clickable to change)
- Milestone indicator (if applicable)
- Critical path indicator (if applicable)
- Action buttons: Edit, Log Time, Delete

**Breadcrumb:**
`Projects / [Project Name] / [Phase Name] / [Task Title]`

**Layout (2-column on desktop):**

**Left Column (65%):**

*Description Card:*
- Rich text description
- Inline editing with markdown support
- Auto-save on blur

*Stakeholder Mentions Card:*
- List of stakeholders linked to this task
- Each shows: Avatar, Name, Title, Role badges
- "Add Stakeholder" button (multi-select from client's stakeholders)
- Click stakeholder → Slide-over with contact info
- Filter tasks by clicking a role badge

*Activity & Comments Card:*
- Timeline of all task activity (newest first)
- Types: Status change, Assignment change, Time logged, Comment
- "Add Comment" input at top
- Comments show: User avatar, Name, Timestamp, Content
- Edit/Delete own comments

**Right Column (35%):**

*Details Card:*
- Project: Link to ProjectDetail
- Phase: Name (or "No Phase")
- Assigned To: User avatar + name (editable)
- Created: Date + "by [User]"
- Updated: Relative date

*Timeline Card:*
- Due Date: Editable date picker
- Effort: Light / Medium / Heavy (editable)
- Estimated Hours: Editable number
- Actual Hours: Calculated from time entries

*Time Entries Card:*
- List of time entries for this task
- Each shows: Date, User, Hours, Description, Billable badge
- "Log Time" button → Quick time entry form
- Total hours at bottom

**Quick Time Entry Form (inline):**
```
+--------------------------------+
| Date: [Today ▼]  Hours: [___]  |
| Description: [______________]  |
| [✓] Billable    [Log Time]     |
+--------------------------------+
```

**Status Change Confirmation:**
When changing to "Done":
- If estimated hours but no actual hours → Prompt to log time
- If milestone → Celebration animation + notification

---

## User Flows

### Flow 1: Triage Tasks on Board

1. User navigates to `/tasks`
2. Board shows all tasks grouped by status
3. User filters by "Assigned To: Me"
4. Sees their tasks across all projects
5. Drags high-priority task from Backlog to In Progress
6. Status change auto-logged
7. Drags completed task to Done
8. If milestone, celebration notification appears

### Flow 2: Filter by Stakeholder Role

1. User wants to see all tasks involving Champions
2. Opens Stakeholder Role filter
3. Selects "Champion"
4. Board/List updates to show only tasks with Champion-tagged stakeholders
5. User can quickly follow up on Champion-related items

### Flow 3: Log Time from Task Detail

1. User opens TaskDetail for "Stakeholder Interviews"
2. Clicks "Log Time" button
3. Quick form appears inline
4. Enters: Date (today), Hours (2.5), Description ("Initial discovery calls")
5. Billable checkbox defaulted from project settings
6. Submits
7. Time entry appears in card
8. Actual Hours updates (0 → 2.5h)
9. Activity logged: "Alex logged 2.5 hours"

### Flow 4: Add Stakeholder Mention

1. User on TaskDetail for "Budget Approval"
2. Clicks "Add Stakeholder" in Stakeholder Mentions card
3. Multi-select modal shows client's stakeholders with role badges
4. Selects "Michael Torres (Economic Buyer 💰)"
5. Stakeholder added to task
6. Activity logged: "Added Michael Torres to task"
7. EB can now be easily contacted for budget questions

### Flow 5: Bulk Status Update

1. User on TasksList
2. Selects 5 tasks via checkboxes (all from same sprint)
3. Clicks "Change Status" in bulk actions bar
4. Selects "Done"
5. Confirmation: "Mark 5 tasks as Done?"
6. Confirms
7. All tasks updated
8. Activity logged for each
9. Project progress bars update

---

## UI Components

### TaskCard (for kanban)
```
+-----------------------------+
| ⚑ Critical  🔴 High         |
| Design System Review        |
| EasyVista Implementation    |
| ⭐ Sarah  💰 Michael        |
| Due: Mar 25    ⏱ 4h        |
+-----------------------------+
```
- Compact for board density
- Color-coded priority/status indicators
- Truncated stakeholder list

### TaskRow (for list)
```
| ✓ | 💎 API Integration | EasyVista Impl | Setup | [Alex] | ⭐💰🔧 | In Progress | High | Mar 28 | 8h/3h | ⋮ |
```
- Full details in horizontal layout
- Checkbox for bulk selection
- Expandable stakeholder badges

### StatusBadge
```
[Backlog]      → stone-400, dashed border
[In Progress]  → blue-500, solid
[Review]       → amber-500, solid
[Done]         → emerald-500, checkmark icon
```

### PriorityBadge
```
[Low]      → stone-400
[Medium]   → amber-500
[High]     → orange-500
[Critical] → rose-500, pulse animation
```

### StakeholderBadgeGroup
```
[⭐ Sarah] [💰 Michael] [+2]
```
- Shows up to 3 stakeholders with role icons
- "+N" indicator for overflow
- Hover shows full list
- Click opens stakeholder filter

### TimeEntryRow
```
Mar 24 | Alex Rivera | 2.5h | Discovery calls | Billable ✓
```

### CommentBlock
```
┌─────────────────────────────────────┐
│ [👤] Alex Rivera        2 hours ago │
│ Updated the requirements doc based  │
│ on Sarah's feedback from the call.  │
│                         [Edit] [🗑] │
└─────────────────────────────────────┘
```

---

## Keyboard Shortcuts

| Shortcut | Context | Action |
|----------|---------|--------|
| `b` | Tasks section | Switch to Board view |
| `l` | Tasks section | Switch to List view |
| `t` | Tasks section | Log Time (on selected/current task) |
| `e` | TaskDetail | Edit task |
| `c` | TaskDetail | Add comment |
| `/` | Any view | Focus search |
| `f` | Any view | Open filters |
| `1-4` | TasksBoard | Filter by column (Backlog, In Progress, Review, Done) |
| `Space` | TasksList | Toggle row selection |
| `Enter` | TasksList | Open selected task |
| `Escape` | Any modal/filter | Close |
| `Cmd+Enter` | Comment input | Submit comment |
| `?` | Any view | Show keyboard shortcuts |

---

## Responsive Behavior

**Desktop (≥1024px):**
- Full 4-column kanban board
- All table columns visible
- 2-column TaskDetail layout
- Filters in horizontal bar

**Tablet (768-1023px):**
- Kanban scrolls horizontally
- Table hides Phase, Hours columns
- TaskDetail stacks to single column
- Filters collapse to dropdown

**Mobile (<768px):**
- Kanban shows as grouped card list by status
- Table becomes stacked cards
- TaskDetail full-width cards
- Filters in bottom sheet
- Floating action button for Log Time

---

## Accessibility

### General
- All interactive elements have visible focus states
- Keyboard navigation for all actions
- Skip links: "Skip to task board", "Skip to filters"
- Logical tab order (filters → board/list → actions)

### Kanban Board
- Columns have `role="region"` with `aria-label`
- Cards are `role="button"` with full task description
- Drag-and-drop has keyboard alternative:
  - Focus card, press Enter to pick up
  - Arrow keys to move between columns
  - Enter to drop, Escape to cancel
- Live region announces: "Task moved to [Status]"

### Task Cards
- Priority announced: "Priority: High"
- Status announced: "Status: In Progress"
- Due date announced: "Due March 25th" or "Overdue by 3 days"
- Stakeholder roles announced by name

### Data Table
- Proper table semantics with `scope` attributes
- Sortable columns have `aria-sort`
- Row selection announced via `aria-selected`
- Bulk actions region has `aria-live="polite"`

### Status/Priority Badges
- Color is not sole indicator (text + icon)
- `aria-label` includes full context

### Forms
- All inputs have associated labels
- Error messages linked via `aria-describedby`
- Required fields marked with `aria-required`

---

## Design Notes

### Color Palette

**Status Colors:**
- Backlog: `stone-400`
- In Progress: `blue-500`
- Review: `amber-500`
- Done: `emerald-500`

**Priority Colors:**
- Low: `stone-400`
- Medium: `amber-500`
- High: `orange-500`
- Critical: `rose-500`

**Effort Colors:**
- Light: `emerald-400`
- Medium: `amber-400`
- Heavy: `rose-400`

### Typography

- Task title (card): `text-sm font-medium`
- Task title (detail): `text-2xl font-semibold`
- Project/Phase: `text-xs text-stone-500`
- Timestamps: `text-xs text-stone-400`
- Comments: `text-sm text-stone-700`

### Spacing

- Card padding: 12px
- Card gap: 12px
- Column gap: 16px
- Section gap: 24px

### Borders & Shadows

- Cards: `rounded-lg`, `shadow-sm`, `border border-stone-200`
- Kanban columns: `rounded-xl`, `bg-stone-50`
- Hover state: `shadow-md`, slight scale (1.01)
- Drag state: `shadow-lg`, `rotate-2deg`

### Icons

- Backlog: Inbox icon
- In Progress: Play icon
- Review: Eye icon
- Done: Check circle icon
- Milestone: Diamond icon
- Critical: Flag icon
- Time: Clock icon
- Comment: Chat bubble icon

### Animations

- Card drag: Smooth with shadow trail
- Status change: Brief flash of new color
- Milestone complete: Confetti burst (subtle)
- Loading: Skeleton cards matching layout

---

## Integration Points

### From Projects Section
- Tasks created in ProjectDetail flow here
- Task changes sync to project progress
- Phase assignments maintained

### To Time/Invoicing
- Time entries logged here appear on invoices
- Billable status set per entry
- Actual hours calculated for project budgets

### Stakeholder Context
- Stakeholder data from Clients section
- Role tags (Champion, EB, etc.) displayed
- Filter by role to focus on key contacts

### Activity Logging
- All status changes auto-logged
- Comments logged as activities
- Time entries logged as activities
- Stakeholder additions logged
