# Milestone 4: Projects

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

Implement project management with multi-view lists, phase-based planning, team assignments, budget tracking, and timeline visualization.

## Overview

The Projects section enables delivery management for client engagements:

- View projects in list, Kanban, or timeline format
- Track progress with phases and tasks
- Manage team assignments and workload
- Monitor budgets and billable hours
- Visualize project timelines (Gantt-style)

**Key Features:**

- Project list with three views: List, Kanban (by status), Timeline
- Project detail with tabs: Overview, Phases, Team, Time, Files
- Phase-based project structure
- Team member assignment with avatars
- Budget tracking (total and hourly)
- Progress calculation from completed tasks
- Health status indicators (on track, at risk, behind)

## Recommended Approach: Test-Driven Development

Before implementing, read `product-plan/sections/projects/tests.md` for test-writing guidance.

**TDD Workflow:**

1. Write failing tests for API endpoints and business logic
2. Implement the minimum code to pass tests
3. Refactor while keeping tests green

## What to Implement

### 1. Project List (`ProjectsList`)

Copy from `product-plan/sections/projects/components/ProjectsList.tsx`

**Views:**
| View | Display |
|------|---------|
| List | Table with sortable columns |
| Kanban | Cards grouped by status |
| Timeline | Gantt-style horizontal bars |

**Summary Cards:**

- Active Projects (count)
- Total Budget (sum)
- Average Progress (%)
- Projects At Risk (count)

**Columns (List View):**

- Project name + client
- Status badge
- Progress bar (%)
- Team avatars
- Budget
- Days remaining

**API Endpoints:**

```
GET /api/projects
GET /api/projects?status=active
GET /api/projects?clientId=xxx
GET /api/projects/stats
```

### 2. Project Detail (`ProjectDetail`)

Copy from `product-plan/sections/projects/components/ProjectDetail.tsx`

**Header:**

- Project name, client link, status badge
- Progress bar with percentage
- Health indicator (on_track, at_risk, behind)
- Budget and deadline info

**Tabs:**
| Tab | Content |
|-----|---------|
| Overview | Summary cards + recent activity |
| Phases | Phase list with tasks |
| Team | Member assignments |
| Time | Time entries and hours |
| Files | Project documents |

**API Endpoints:**

```
GET /api/projects/:id
PATCH /api/projects/:id
GET /api/projects/:id/phases
GET /api/projects/:id/team
GET /api/projects/:id/time-entries
```

### 3. Project Status & Health

**Status Values:**

- `planning` — Not yet started
- `active` — In progress
- `on_hold` — Paused
- `completed` — Finished

**Health Calculation:**

```typescript
function calculateHealth(project: Project): "on_track" | "at_risk" | "behind" {
  const daysRemaining = daysBetween(now, project.deadline);
  const expectedProgress =
    ((project.duration - daysRemaining) / project.duration) * 100;

  if (project.progress >= expectedProgress - 5) return "on_track";
  if (project.progress >= expectedProgress - 15) return "at_risk";
  return "behind";
}
```

### 4. Phase Management

Projects contain ordered phases, each with tasks.

**Phase Schema:**

```typescript
interface Phase {
  id: string;
  projectId: string;
  name: string;
  description: string;
  order: number;
  startDate: string;
  endDate: string;
  status: "not_started" | "in_progress" | "completed";
}
```

**API:**

```
POST /api/projects/:id/phases
PATCH /api/phases/:id
DELETE /api/phases/:id
PATCH /api/phases/:id/reorder
```

### 5. Team Assignments

Track who's assigned to a project and their role.

**Assignment Schema:**

```typescript
interface ProjectAssignment {
  id: string;
  projectId: string;
  userId: string;
  role: "lead" | "member" | "reviewer";
  allocatedHours: number;
}
```

**Display:**

- Avatar stack on list view
- Full list with roles on detail view
- Add/remove team members

**API:**

```
GET /api/projects/:id/team
POST /api/projects/:id/team
DELETE /api/projects/:id/team/:userId
```

### 6. Budget Tracking

**Budget Fields:**

- `budget` — Total project budget (fixed fee)
- `hourlyBudget` — Budget in hours (for T&M)
- `hoursLogged` — Actual hours from time entries
- `amountBilled` — Total invoiced

**Calculations:**

```typescript
const budgetUsed = (hoursLogged / hourlyBudget) * 100;
const burnRate = hoursLogged / weeksElapsed;
const projectedTotal = burnRate * totalWeeks;
```

### 7. Project Timeline (`ProjectTimeline`)

Copy from `product-plan/sections/projects/components/ProjectTimeline.tsx`

**Features:**

- Gantt-style horizontal bar chart
- Phases as swimlanes
- Tasks as bars within phases
- Today marker
- Drag to adjust dates (optional)

**API:**

```
GET /api/projects/:id/timeline
```

### 8. Project Onboarding (`ProjectOnboarding`)

Copy from `product-plan/sections/projects/components/ProjectOnboarding.tsx`

**Steps:**

1. Project Details — Name, client, type, dates
2. Phases — Define project phases
3. Team — Assign team members
4. Review — Confirm and create

**API:**

```
POST /api/projects (creates with nested phases/team)
```

## Expected User Flows

**Flow 1: Browse Projects**

1. User navigates to `/projects`
2. Views summary cards (Active, Budget, Progress, At Risk)
3. Toggles between List, Kanban, Timeline views
4. Filters by status or client
5. Clicks project to view detail

**Flow 2: Track Progress**

1. User opens project detail
2. Views progress bar and health indicator
3. Opens Phases tab
4. Marks tasks complete within a phase
5. Progress bar updates automatically

**Flow 3: Manage Team**

1. User opens project detail → Team tab
2. Views current team members with roles
3. Clicks "Add Member"
4. Selects user and assigns role (Lead, Member, Reviewer)
5. Sets allocated hours
6. Member appears in team list

**Flow 4: Create Project**

1. User clicks "New Project"
2. Enters project name, selects client
3. Sets dates and budget
4. Defines phases
5. Assigns team
6. Reviews and confirms

## Files to Reference

- `product-plan/sections/projects/README.md` — Section overview
- `product-plan/sections/projects/components/` — React components
- `product-plan/sections/projects/tests.md` — Test-writing guidance
- `product-plan/data-model/types.ts` — Project, Phase types
- `product-plan/data-model/sample-data.json` — Test data

## Done When

- [ ] Project list displays with three view options
- [ ] Summary cards show correct metrics
- [ ] Status badges display correctly
- [ ] Progress bars calculate from tasks
- [ ] Health indicators show on_track/at_risk/behind
- [ ] Project detail loads with all tabs
- [ ] Phases can be created, edited, reordered
- [ ] Team members can be assigned and removed
- [ ] Budget tracking shows hours and costs
- [ ] Timeline view renders phases and tasks
- [ ] Project onboarding wizard works
- [ ] Empty states display when no records exist
- [ ] Linking from client to project works
