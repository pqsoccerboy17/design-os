# Milestone 3: Clients

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

Implement client relationship management with MEDDPICC qualification framework, stakeholder mapping, opportunity tracking, and pipeline visualization.

## Overview

The Clients section is the heart of YourCo's CRM functionality:

- Manage client relationships with health scoring
- Track stakeholders with MEDDPICC roles (Champion, Economic Buyer, etc.)
- Manage opportunities through deal stages
- Visualize pipeline in list or Kanban view
- Onboard new clients with a guided wizard

**Key Features:**

- Client list with search, filter, and dual views (list/pipeline)
- Client detail with tabs: Overview, MEDDPICC, Stakeholders, Opportunities, Activity
- MEDDPICC qualification tracking (Metrics, Decision Criteria, Decision Process, Paper Process, Identified Pain, Competition)
- Stakeholder management with engagement levels and contact info
- Opportunity pipeline with stages and win probability
- Activity timeline (calls, emails, meetings, notes)
- 4-step client onboarding wizard

## Recommended Approach: Test-Driven Development

Before implementing, read `product-plan/sections/clients/tests.md` for test-writing guidance.

**TDD Workflow:**

1. Write failing tests for API endpoints and business logic
2. Implement the minimum code to pass tests
3. Refactor while keeping tests green

## What to Implement

### 1. Client List (`ClientsList`)

Copy from `product-plan/sections/clients/components/ClientsList.tsx`

**Features:**

- Summary cards: Active Clients, Total Pipeline, Avg Health Score, At Risk
- Search by client name
- View toggle: List (table) or Pipeline (Kanban by status)
- Columns: Client name, Champion, Health score, Pipeline value, Open opportunities
- Click row to navigate to detail

**API Endpoints:**

```
GET /api/clients
GET /api/clients?status=active
GET /api/clients/stats (summary metrics)
```

**Calculations:**

- Pipeline value: Sum of opportunity values where outcome is null
- Weighted pipeline: Sum of (value × probability / 100)
- At risk: Clients with health score < 50

### 2. Client Detail (`ClientDetail`)

Copy from `product-plan/sections/clients/components/ClientDetail.tsx`

**Tabs:**
| Tab | Content |
|-----|---------|
| Overview | Key stakeholders + recent activity |
| MEDDPICC | 6-field qualification grid |
| Stakeholders | Contact cards with roles |
| Opportunities | Deal list with stage progress |
| Activity | Timeline of interactions |

**API Endpoints:**

```
GET /api/clients/:id
PATCH /api/clients/:id
GET /api/clients/:id/stakeholders
GET /api/clients/:id/opportunities
GET /api/clients/:id/activities
```

### 3. MEDDPICC Framework

The MEDDPICC tab tracks 6 qualification criteria:

| Field             | Description                          |
| ----------------- | ------------------------------------ |
| Metrics           | Quantifiable outcomes customer wants |
| Decision Criteria | Technical and business requirements  |
| Decision Process  | Steps and timeline to buy            |
| Paper Process     | Legal, procurement, contracts        |
| Identified Pain   | Current challenges and impact        |
| Competition       | Alternatives being evaluated         |

**Schema:**

```typescript
meddpicc: {
  metrics: string | null;
  decisionCriteria: string | null;
  decisionProcess: string | null;
  paperProcess: string | null;
  identifiedPain: string | null;
  competition: string | null;
}
```

**API:**

```
PATCH /api/clients/:id/meddpicc
```

### 4. Stakeholder Management

Copy `StakeholderChip` from shared components.

**MEDDPICC Roles:**

- `champion` — Internal advocate
- `economic_buyer` — Budget authority
- `technical_evaluator` — Technical decision-maker
- `coach` — Provides insider guidance
- `blocker` — Resistant to change
- `user` — End user of solution

**Engagement Levels:** `high`, `medium`, `low`, `disengaged`

**API:**

```
POST /api/clients/:id/stakeholders
PATCH /api/stakeholders/:id
DELETE /api/stakeholders/:id
```

### 5. Opportunity Pipeline

Copy `StageProgressBar` and `getDealStages` from shared components.

**Deal Stages (in order):**

1. `lead` — Initial contact
2. `qualified` — Meets criteria
3. `discovery` — Understanding needs
4. `proposal` — Presenting solution
5. `negotiation` — Terms discussion
6. `closed_won` or `closed_lost` — Outcome

**API:**

```
POST /api/clients/:id/opportunities
PATCH /api/opportunities/:id
PATCH /api/opportunities/:id/stage
```

### 6. Activity Timeline

Copy `ActivityTimeline` from shared components.

**Activity Types:** `call`, `email`, `meeting`, `note`

**API:**

```
POST /api/clients/:id/activities
GET /api/clients/:id/activities?limit=10
```

### 7. Client Onboarding Wizard (`ClientOnboarding`)

Copy from `product-plan/sections/clients/components/ClientOnboarding.tsx`

**4 Steps:**

1. Company Details — Name, industry, website, budget
2. Key Contacts — Add initial stakeholders
3. Documents — Upload contracts, proposals
4. Review & Launch — Summary and confirmation

**API:**

```
POST /api/clients (creates with nested stakeholders)
```

## Expected User Flows

**Flow 1: Browse Pipeline**

1. User navigates to `/clients`
2. Views summary cards for quick metrics
3. Toggles to Pipeline view
4. Sees clients grouped by status (Prospect, Active, Churned)
5. Clicks client card to view detail

**Flow 2: Qualify a Deal with MEDDPICC**

1. User opens client detail → MEDDPICC tab
2. Sees 6 qualification fields (some empty)
3. Fills in "Identified Pain" field
4. Progress bar updates (e.g., 3/6 complete)
5. Repeats until fully qualified

**Flow 3: Add Stakeholder**

1. User opens client detail → Stakeholders tab
2. Clicks "Add Stakeholder"
3. Enters name, title, email, phone
4. Selects MEDDPICC role(s) (Champion, Economic Buyer, etc.)
5. Saves — new stakeholder appears in list

**Flow 4: Track Opportunity**

1. User opens client detail → Opportunities tab
2. Clicks "New Opportunity"
3. Enters name, value, probability, expected close date
4. Selects deal stage
5. Views stage progress bar visualization

## Files to Reference

- `product-plan/sections/clients/README.md` — Section overview
- `product-plan/sections/clients/components/` — React components
- `product-plan/sections/clients/tests.md` — Test-writing guidance
- `product-plan/data-model/types.ts` — Client, Stakeholder, Opportunity types
- `product-plan/data-model/sample-data.json` — Test data

## Done When

- [ ] Client list displays with search and filter
- [ ] List/Pipeline view toggle works
- [ ] Summary cards show correct metrics
- [ ] Client detail loads with all tabs
- [ ] MEDDPICC fields can be edited and saved
- [ ] Stakeholders can be added, edited, deleted
- [ ] Stakeholder roles display correctly (Champion badge, etc.)
- [ ] Opportunities display with stage progress bar
- [ ] Activities display in timeline format
- [ ] Client onboarding wizard completes successfully
- [ ] Empty states display when no records exist
- [ ] Navigation between list and detail works
