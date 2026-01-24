# Milestone 6: Dashboards

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

Implement an internal executive dashboard with KPI cards and charts, plus a white-labeled client portal for external project visibility.

## Overview

The Dashboards section provides two distinct experiences:

**Internal Dashboard** (for team):

- Executive-level KPI metrics
- Revenue and pipeline charts
- Task completion trends
- Project status overview
- Upcoming deadline alerts
- Quick-add actions

**Client Portal** (for clients):

- White-labeled with client branding
- Project status and progress
- Task visibility (assigned to client)
- Activity feed of updates
- Next milestone tracking

## Recommended Approach: Test-Driven Development

Before implementing, read `product-plan/sections/dashboards/tests.md` for test-writing guidance.

**TDD Workflow:**

1. Write failing tests for API endpoints and business logic
2. Implement the minimum code to pass tests
3. Refactor while keeping tests green

## What to Implement

### 1. Internal Dashboard (`InternalDashboard`)

Copy from `product-plan/sections/dashboards/components/InternalDashboard.tsx`

**KPI Cards (top row):**
| Card | Metric | Trend |
|------|--------|-------|
| Pipeline Value | Sum of open opportunities | vs. last month |
| Active Projects | Count in progress | vs. last month |
| Open Tasks | Count not done | change this week |
| Avg Client Health | Average health score | vs. last month |

**Charts (Recharts library):**

- Revenue Forecast — Line chart with monthly projections
- Task Completion — Bar chart by week
- Pipeline by Stage — Horizontal bar chart
- Project Status — Donut chart by status

**Lists:**

- Upcoming Deadlines — Tasks/projects due soon
- Recent Activity — Latest system events

**Quick Actions:**

- New Client
- New Project
- New Task
- Log Time

**API Endpoints:**

```
GET /api/dashboard/kpis
GET /api/dashboard/charts/revenue
GET /api/dashboard/charts/tasks
GET /api/dashboard/charts/pipeline
GET /api/dashboard/deadlines
GET /api/dashboard/activity
```

### 2. Chart Components (Recharts)

Install Recharts:

```bash
npm install recharts
```

**Revenue Chart:**

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={revenueData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="actual" stroke="var(--color-primary-600)" />
    <Line
      type="monotone"
      dataKey="forecast"
      stroke="var(--color-primary-400)"
      strokeDasharray="5 5"
    />
  </LineChart>
</ResponsiveContainer>;
```

**Task Completion Chart:**

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

<ResponsiveContainer width="100%" height={200}>
  <BarChart data={taskData}>
    <XAxis dataKey="week" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="completed" fill="var(--color-lime-500)" />
  </BarChart>
</ResponsiveContainer>;
```

### 3. Time Period Filtering

**Filter Options:**

- This Week
- This Month
- This Quarter
- Last 30 Days
- Last 90 Days
- Custom Range

**API:**

```
GET /api/dashboard/kpis?period=this_month
GET /api/dashboard/charts/revenue?period=this_quarter
```

### 4. Client Portal (`ClientPortal`)

Copy from `product-plan/sections/dashboards/components/ClientPortal.tsx`

**Access:** `/portal/:token`

Token-based access (no login required):

```typescript
interface ClientPortalAccess {
  id: string;
  clientId: string;
  token: string;
  expiresAt: string | null;
  lastAccessedAt: string;
}
```

**Features:**

- Custom header with client name
- Client accent color theming
- Project cards with progress
- Phase-based status view
- Task list (client-visible tasks only)
- Activity feed
- Next milestone display

**API Endpoints:**

```
GET /api/portal/:token/validate
GET /api/portal/:token/projects
GET /api/portal/:token/tasks
GET /api/portal/:token/activity
```

### 5. Portal Theming

Client accent color overrides default amber:

```typescript
interface Client {
  // ...
  accentColor?: string; // hex color, e.g., "#2563eb"
}
```

**CSS Override:**

```css
.portal-theme {
  --color-accent-500: var(--client-accent);
  --color-accent-600: var(--client-accent-dark);
}
```

### 6. Portal Security

**Token Generation:**

```typescript
function generatePortalToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
```

**Token Validation:**

- Check token exists
- Check not expired
- Update `lastAccessedAt`
- Return client context

**Admin Controls:**

- Generate new token
- Set expiration date
- Revoke access (delete token)

**API:**

```
POST /api/clients/:id/portal-access
DELETE /api/clients/:id/portal-access
```

### 7. Dashboard Calculations

**Pipeline by Stage:**

```typescript
const pipelineByStage = opportunities.reduce(
  (acc, opp) => {
    acc[opp.stage] = (acc[opp.stage] || 0) + opp.value;
    return acc;
  },
  {} as Record<DealStage, number>,
);
```

**Weighted Pipeline:**

```typescript
const weightedPipeline = opportunities.reduce((sum, opp) => {
  return sum + (opp.value * opp.probability) / 100;
}, 0);
```

**Average Client Health:**

```typescript
const avgHealth =
  clients.reduce((sum, c) => sum + c.healthScore, 0) / clients.length;
```

**Trend Calculation:**

```typescript
function getTrend(
  current: number,
  previous: number,
): { value: number; direction: "up" | "down" | "flat" } {
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change),
    direction: change > 1 ? "up" : change < -1 ? "down" : "flat",
  };
}
```

## Expected User Flows

**Flow 1: Morning Check-in**

1. User opens `/dashboard` (landing page)
2. Views KPI cards for quick pulse
3. Scans upcoming deadlines
4. Clicks deadline to open task
5. Reviews recent activity feed

**Flow 2: Executive Review**

1. User opens dashboard
2. Selects "This Quarter" time period
3. Reviews revenue forecast chart
4. Clicks pipeline chart segment
5. Drills down to opportunity list

**Flow 3: Client Portal Access**

1. Client receives portal link via email
2. Opens `/portal/abc123token`
3. Views their project cards
4. Checks task progress
5. Sees upcoming milestone date

**Flow 4: Generate Portal Link**

1. Admin opens client detail
2. Clicks "Portal Access" section
3. Clicks "Generate Link"
4. Sets expiration (or never)
5. Copies link to share with client

## Files to Reference

- `product-plan/sections/dashboards/README.md` — Section overview
- `product-plan/sections/dashboards/components/` — React components
- `product-plan/sections/dashboards/tests.md` — Test-writing guidance
- `product-plan/data-model/types.ts` — Dashboard-related types

## Done When

- [ ] Internal dashboard loads as landing page
- [ ] KPI cards display with correct values
- [ ] KPI trends show up/down indicators
- [ ] Revenue chart renders with Recharts
- [ ] Task completion chart renders
- [ ] Pipeline by stage chart renders
- [ ] Time period filter changes data
- [ ] Upcoming deadlines list works
- [ ] Recent activity feed displays
- [ ] Quick-add buttons navigate correctly
- [ ] Client portal validates token
- [ ] Client portal shows filtered data
- [ ] Client accent color applies
- [ ] Portal token can be generated/revoked
- [ ] Empty states display when no data
