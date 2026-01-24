# Milestone 5: Tasks

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

Implement task management with Kanban board, list view, bulk actions, priority/status tracking, time estimates, and critical path indicators.

## Overview

The Tasks section provides day-to-day work management:

- Kanban board for visual task flow
- List view with multi-select and bulk actions
- Priority and status tracking
- Time estimation and logging
- Due date monitoring with overdue alerts
- Critical path indicators for key deliverables

**Key Features:**

- Dual views: Kanban board and list table
- Drag-and-drop between status columns
- Bulk selection and batch updates
- Priority levels with color coding
- Due date with overdue warnings
- Time tracking (estimated vs. actual)
- Milestone and critical path flags
- Assignee management

## Recommended Approach: Test-Driven Development

Before implementing, read `product-plan/sections/tasks/tests.md` for test-writing guidance.

**TDD Workflow:**

1. Write failing tests for API endpoints and business logic
2. Implement the minimum code to pass tests
3. Refactor while keeping tests green

## What to Implement

### 1. Tasks Board (`TasksBoard`)

Copy from `product-plan/sections/tasks/components/TasksBoard.tsx`

**Kanban Columns:**
| Column | Status | Color |
|--------|--------|-------|
| Backlog | `backlog` | Stone |
| In Progress | `in_progress` | Sky |
| Review | `review` | Violet |
| Done | `done` | Lime |

**Card Display:**

- Task title
- Priority badge
- Assignee avatar
- Due date (red if overdue)
- Milestone/critical path indicator
- Estimated hours

**Drag & Drop:**

- Drag cards between columns
- Updates task status via API
- Optimistic UI update

**API Endpoints:**

```
GET /api/tasks?view=board
PATCH /api/tasks/:id/status
```

### 2. Tasks List (`TasksList`)

Copy from `product-plan/sections/tasks/components/TasksList.tsx`

**Features:**

- Checkbox selection for bulk actions
- Sortable columns
- Filter by status, priority, assignee, project
- Search by task title

**Columns:**

- Checkbox (for selection)
- Task title + project name
- Status badge
- Priority badge
- Assignee avatar
- Due date
- Estimated hours
- Actions menu

**Bulk Actions:**

- Change status
- Change priority
- Assign to user
- Delete selected

**API Endpoints:**

```
GET /api/tasks
GET /api/tasks?projectId=xxx
GET /api/tasks?assigneeId=xxx
GET /api/tasks?status=in_progress
PATCH /api/tasks/bulk (for batch updates)
```

### 3. Task Detail (`TaskDetail`)

Copy from `product-plan/sections/tasks/components/TaskDetail.tsx`

**Sections:**

- Title and description
- Status and priority selectors
- Assignee picker
- Due date picker
- Time tracking (estimated vs. logged)
- Phase/milestone association
- Comments/activity log

**API Endpoints:**

```
GET /api/tasks/:id
PATCH /api/tasks/:id
DELETE /api/tasks/:id
GET /api/tasks/:id/time-entries
POST /api/tasks/:id/comments
```

### 4. Task Status

**Status Values:**

```typescript
type TaskStatus = "backlog" | "in_progress" | "review" | "done";
```

**Status Colors:**
| Status | Background | Text |
|--------|------------|------|
| backlog | stone-100 | stone-700 |
| in_progress | sky-100 | sky-700 |
| review | violet-100 | violet-700 |
| done | lime-100 | lime-700 |

### 5. Task Priority

**Priority Values:**

```typescript
type TaskPriority = "low" | "medium" | "high" | "critical";
```

**Priority Colors:**
| Priority | Background | Text |
|----------|------------|------|
| low | stone-100 | stone-600 |
| medium | sky-100 | sky-700 |
| high | amber-100 | amber-700 |
| critical | red-100 | red-700 |

Copy `PriorityBadge` from shared components.

### 6. Due Date & Overdue Logic

**Display Rules:**

```typescript
function getDueDateDisplay(dueDate: string) {
  const days = daysBetween(now, dueDate);

  if (days < 0) return { label: "Overdue", color: "red" };
  if (days === 0) return { label: "Today", color: "amber" };
  if (days === 1) return { label: "Tomorrow", color: "amber" };
  if (days <= 7) return { label: `${days}d`, color: "stone" };
  return { label: formatDate(dueDate), color: "stone" };
}
```

**Summary Stats:**

- Due Soon: Tasks due within 7 days
- Overdue: Tasks past due date (status !== done)

### 7. Time Tracking

**Fields:**

- `estimatedHours` — Initial estimate
- `loggedHours` — Sum of time entries

**Display:**

```
2.5h / 4h (62%)
```

Progress bar shows logged vs. estimated.

**API:**

```
POST /api/tasks/:id/time-entries
GET /api/tasks/:id/time-entries
```

### 8. Critical Path

Tasks can be marked as critical path items — key deliverables that block other work.

**Schema:**

```typescript
interface Task {
  // ...
  isMilestone: boolean;
  isCriticalPath: boolean;
}
```

**Display:**

- Flag icon for milestones
- Warning icon for critical path
- Summary count in header

### 9. Bulk Actions

**Selection:**

```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
```

**Bulk API:**

```
PATCH /api/tasks/bulk
Body: {
  ids: string[]
  updates: { status?: string, priority?: string, assigneeId?: string }
}

DELETE /api/tasks/bulk
Body: { ids: string[] }
```

## Expected User Flows

**Flow 1: Triage Tasks**

1. User navigates to `/tasks` (board view)
2. Sees tasks in Backlog column
3. Drags high-priority task to "In Progress"
4. Status updates immediately
5. Card appears in new column

**Flow 2: Bulk Update**

1. User switches to list view (`/tasks/list`)
2. Checks multiple task checkboxes
3. Clicks "Change Status" bulk action
4. Selects "Review"
5. All selected tasks update

**Flow 3: Track Time**

1. User opens task detail
2. Views estimated hours (4h)
3. Clicks "Log Time"
4. Enters 1.5 hours
5. Progress bar updates (1.5h / 4h = 37%)

**Flow 4: Filter & Search**

1. User opens task list
2. Types in search box "API"
3. Filters by priority = "Critical"
4. Filters by assignee = self
5. Sees filtered results

## Files to Reference

- `product-plan/sections/tasks/README.md` — Section overview
- `product-plan/sections/tasks/components/` — React components
- `product-plan/sections/tasks/tests.md` — Test-writing guidance
- `product-plan/data-model/types.ts` — Task type definition
- `product-plan/data-model/sample-data.json` — Test data

## Done When

- [ ] Kanban board renders with 4 columns
- [ ] Drag-and-drop updates task status
- [ ] List view displays with sortable columns
- [ ] Search filters tasks by title
- [ ] Filters work (status, priority, assignee)
- [ ] Bulk selection works with checkboxes
- [ ] Bulk actions update multiple tasks
- [ ] Task detail shows all fields
- [ ] Priority badges display with correct colors
- [ ] Due dates show overdue state
- [ ] Time tracking displays estimated vs. logged
- [ ] Critical path indicators display
- [ ] Empty states display when no tasks
- [ ] Navigation between board and list works
