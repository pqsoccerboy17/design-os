# YourCo Consulting Platform - Design OS Adoption Plan

**Date:** 2026-01-22
**Methodology:** Design OS (local at `/Users/mdmac/Projects/design-os`)
**Test Client:** EasyVista (data in `/Users/mdmac/Projects/client-timelines/config.json`)

---

## 🚦 SESSION HANDOFF (Updated: 2026-01-22)

### ✅ Phase 0: COMPLETE
All repos synced to GitHub:
- `YourCo` - RW methodology in `.claude/commands/`, pushed to main
- `design-os` - package-lock.json committed, pushed
- `client-timelines` - easyvista-timeline.md committed, pushed
- `consulting-framework` - NEW repo created, plan copied, pushed

### 🎯 NEXT SESSION: Phase 1 Step 1
**Create product-overview.md** in design-os with YourCo vision

Product info already defined:
- **Name:** YourCo (multi-client consulting platform)
- **Description:** Multi-client consulting business management system for small teams (2-5 people) with role-based access
- **Test Client:** EasyVista (March 31, 2026 deadline)
- **Sections:** Client Mgmt, Project Tracking, Task/Stakeholder CRM, Reporting, Invoicing

**To resume:**
```bash
cd /Users/mdmac/Projects/design-os
claude
# Then: Create /product/product-overview.md with the vision above
# Then: Run /product-roadmap
```

---

## Development Ethos (Ralph Wiggum Methodology)

### Core Principles

| Principle | Application |
|-----------|-------------|
| **Test after every change** | Run tests after each file/feature, not just at the end |
| **Incremental commits** | Small, focused commits with `/safe-commit` pattern |
| **Clear success criteria** | Define checkboxes BEFORE starting each phase |
| **Multi-agent strategy** | Match tool to task (see below) |
| **Context window management** | Conservative iterations, completion promises |

### Multi-Agent Strategy

| Task Type | Tool | Why |
|-----------|------|-----|
| Planning, exploration | Claude Code CLI | Better context handling |
| Single file edits | Cursor AI (Cmd+K) | Visual, inline editing |
| Overnight automation | Ralph Wiggum loop | Autonomous with clear exit criteria |
| Quick questions | Cowork (Claude Desktop) | Fast, conversational |

### Completion Promise Pattern

For autonomous runs, define:
```
Task: [description]
Success Criteria: [ ] checklist
Constraints: [scope limits, test requirements]
Completion: Output <promise>COMPLETE</promise> when ALL criteria met
```

### Risky vs Safe Tasks

| Safe (autonomous OK) | Risky (human oversight) |
|---------------------|------------------------|
| Writing tests | Authentication/security |
| Documentation | Database migrations |
| Refactoring with clear rules | Architectural decisions |
| Data import/export | Payment processing |

### Context Window Management

**When to start fresh context:**
- After completing a major phase (0 → 1 → 2)
- When context exceeds ~50% capacity
- After `/compact` summary

**Session handoff protocol:**
1. Update STATUS.md with current state
2. Commit all work in progress
3. Document next steps in plan file
4. Push to GitHub

**Key files for context recovery:**
- `STATUS.md` → Current state snapshot
- Plan file → What we're building
- `config.json` → EasyVista data
- Git log → What's been done

---

## Phase 0: Pre-Flight Checklist (Before Design OS)

### 0.1 Set Up YourCo Project Structure (CRITICAL)

**Gap Identified:** YourCo has NO .claude/ folder - missing entire RW methodology.

Copy from Ralph-Wiggum to YourCo:
```
YourCo/
├── CLAUDE.md              ← Create (project instructions for YourCo)
├── WORKFLOW-CHEATSHEET.md ← Copy from Ralph-Wiggum
├── PROMPT.md              ← Copy (template for RW loops)
└── .claude/
    ├── commands/
    │   ├── safe-commit.md
    │   ├── test-and-pr.md
    │   ├── morning-standup.md
    │   ├── explain.md
    │   └── fix-issue.md
    └── settings.local.json  ← Git permissions for YourCo
```

**YourCo CLAUDE.md must include:**
- Platform overview (multi-client consulting system)
- Development workflow (PLAN → BUILD → TEST → COMMIT)
- Key directories and data model entities
- Safety rules (never commit secrets, always run tests)
- Testing requirements (run after every change)

### 0.2 Git Sync Tasks

| Task | Repo | Action |
|------|------|--------|
| 1. Set up YourCo structure | `YourCo` | Copy RW files, create CLAUDE.md |
| 2. Create main branch | `YourCo` | Merge feature branch → main, set as default |
| 3. Commit package-lock + push | `design-os` | `git add package-lock.json && git commit && git push` |
| 4. Commit + push changes | `client-timelines` | Commit `easyvista-timeline.md`, push |
| 5. Initialize git properly | `consulting-framework` | Create `.gitignore`, `git init`, add remote, push |
| 6. Copy plan to repo | `consulting-framework` | Backup this plan file |
| 7. Commit YourCo setup | `YourCo` | Commit .claude/ + CLAUDE.md, push to main |

**⚠️ Note:** `consulting-framework` currently inherits from parent git repo at `/Users/mdmac`. Must run `git init` inside the folder to create its own repository.

### 0.3 Files to Commit

**YourCo (new structure):**
- `.claude/commands/*.md` (5 files)
- `.claude/settings.local.json`
- `CLAUDE.md`
- `WORKFLOW-CHEATSHEET.md`
- `PROMPT.md`

**client-timelines:**
- `easyvista-timeline.md` (modified)

**consulting-framework (new repo):**
- `STATUS.md` - Update to reflect YourCo platform direction
- `PLANNING-STATUS.md`
- `compass_artifact_*.md`
- Copy of this plan file

### Decisions Confirmed

| Decision | Choice |
|----------|--------|
| Target repo | Use existing `/Projects/YourCo` (React 19 + Tailwind v4) |
| Design OS output | Export into YourCo repo |
| GitHub backup | Push all repos before starting |

---

## Scope

**Platform Type:** Multi-client consulting business management system
**Users:** Small team (2-5 people) with role-based access
**Test Client:** EasyVista engagement (March 31, 2026 deadline)

---

## Confirmed Features

### Core Sections (for Design OS roadmap)

| Section | Description |
|---------|-------------|
| **1. Client Management** | Clients, contracts, contacts, onboarding |
| **2. Project Tracking** | Projects, timelines, deliverables, phases |
| **3. Task & Stakeholder CRM** | Tasks, milestones, risks, stakeholder engagement |
| **4. Reporting & Dashboards** | Internal metrics, client-facing status pages |
| **5. Invoicing & Time Tracking** | Billable hours, invoices, payment status |

### Integrations (Phase 2)

- **Notion sync** - Keep Notion as secondary view/backup
- **Calendar (Google/Outlook)** - Sync deadlines and meetings

### Authentication

- Team login (2-5 users)
- Role-based access (admin, consultant, viewer)

---

## Phase 1: Design OS Product Planning

### Step 1: Start Design OS
```bash
cd /Users/mdmac/Projects/design-os
npm run dev
```
Opens at `http://localhost:5173`

### Step 2: Design OS Workflow (with Test Gates)

**Cycle for each command: RUN → REVIEW → COMMIT**

| Order | Command | Creates | Success Gate |
|-------|---------|---------|--------------|
| 1 | `/product-vision` | `product/product-overview.md` | Vision doc exists, covers all 5 sections |
| 2 | `/product-roadmap` | `product/product-roadmap.md` | Roadmap has 5 sections with deliverables |
| 3 | `/data-model` | `product/data-model/` | All 7 entities defined with relationships |
| 4 | `/design-tokens` | `product/design-system/` | Colors, typography, spacing defined |
| 5 | `/design-shell` | `product/shell/` | Navigation + layout specs complete |
| 6-10 | `/shape-section` ×5 | `product/sections/[id]/spec.md` | Each section has complete spec |
| 11-15 | `/sample-data` ×5 | `product/sections/[id]/data.json` | EasyVista data mapped to each section |
| 16-20 | `/design-screen` ×5 | `src/sections/[id]/` | UI components render without errors |
| 21 | `/export-product` | `product-plan/` | Export contains complete package |

### Commit Strategy

After each major milestone:
```bash
/safe-commit "design: [description]"
```

Commit points:
- [ ] After vision + roadmap (commands 1-2)
- [ ] After data model + design system (commands 3-5)
- [ ] After each section spec (commands 6-10)
- [ ] After sample data (commands 11-15)
- [ ] After UI designs (commands 16-20)
- [ ] After export (command 21)

---

## Phase 2: Implementation

### Target Repo
- `/Users/mdmac/Projects/YourCo` (React 19.2 + Vite 7 + Tailwind v4)
- GitHub: `pqsoccerboy17/YourCo`

### Implementation Steps (with Test Gates)

| Step | Task | Test Gate | Agent |
|------|------|-----------|-------|
| 1 | Merge Design OS export | `npm run dev` works | Claude Code |
| 2 | Add tests for data model | All entity tests pass | Ralph Wiggum (safe) |
| 3 | Add backend (TBD) | API endpoints respond | Claude Code |
| 4 | Add auth | Login/logout works | Claude Code (risky) |
| 5 | Import EasyVista data | 17 stakeholders + 33 tasks visible | Ralph Wiggum (safe) |
| 6 | Add Notion sync | Bi-directional sync works | Claude Code |
| 7 | Add Calendar integration | Events sync | Claude Code |

### Test-Commit Cycle

For each implementation step:
```
1. PLAN   → Define success criteria
2. BUILD  → Implement (small increments)
3. TEST   → npm run test
4. REVIEW → git diff
5. COMMIT → /safe-commit
6. REPEAT
```

### Ralph Wiggum Loop Template (for safe tasks)

```bash
/ralph-loop "Write tests for [component]. Success: all tests pass,
coverage > 80%. Constraints: only modify /src/tests/.
Output: <promise>COMPLETE</promise>" --max-iterations 15
```

### Backend Options (decide during design)

| Option | Best For | Trade-offs |
|--------|----------|------------|
| Supabase | Quick MVP, real-time | Vendor lock-in |
| PostgreSQL + API | Full control | More setup |
| Firebase | Mobile + web | Google ecosystem |

---

## Data Model Preview

Based on EasyVista config.json + multi-client needs:

```
User (team members)
├── id, name, email, role

Client
├── id, name, contact, deadline, budget
└── has many: Projects, Stakeholders

Project (workstreams)
├── id, name, goal, status, budget_allocation
├── belongs to: Client
└── has many: Phases, Tasks

Phase
├── id, name, start, end
├── belongs to: Project
└── has many: Tasks

Task
├── id, title, type (task/milestone/risk/question)
├── owner, advisor, due_date, status
├── milestone (bool), critical (bool)
├── likelihood, impact, mitigation (for risks)
└── belongs to: Phase

Stakeholder
├── id, name, role, group, status
├── email, phone, notes
└── belongs to: Client

Invoice
├── id, client, amount, status, due_date
└── has many: TimeEntries

TimeEntry
├── id, user, project, hours, date, description
└── belongs to: Invoice (optional)
```

---

## Key Files

| Purpose | Location | GitHub |
|---------|----------|--------|
| **YourCo platform** | `/Users/mdmac/Projects/YourCo` | `pqsoccerboy17/YourCo` |
| Design OS app | `/Users/mdmac/Projects/design-os` | `pqsoccerboy17/design-os` |
| EasyVista test data | `/Users/mdmac/Projects/client-timelines/config.json` | `pqsoccerboy17/client-timelines` |
| Planning docs | `/Users/mdmac/Projects/consulting-framework` | TBD (create in Phase 0) |
| This plan | `/Users/mdmac/.claude/plans/greedy-floating-pine.md` | Copy to consulting-framework |

---

## Verification (Success Criteria)

### Phase 0: Pre-Flight
- [ ] YourCo has `.claude/commands/` with 5 commands
- [ ] YourCo has `CLAUDE.md` with project instructions
- [ ] YourCo has `WORKFLOW-CHEATSHEET.md` and `PROMPT.md`
- [ ] YourCo has `main` branch (feature branch merged)
- [ ] YourCo setup committed + pushed to GitHub (main branch)
- [ ] `design-os` package-lock.json committed + pushed
- [ ] `client-timelines` changes committed + pushed
- [ ] `consulting-framework` has own `.git` (not parent repo)
- [ ] `consulting-framework` has `.gitignore`
- [ ] `consulting-framework` initialized + pushed to GitHub
- [ ] Plan file copied to consulting-framework

### Phase 1: Design OS Complete
- [ ] `product/product-overview.md` defines YourCo vision
- [ ] `product/data-model/` has 7 entities with relationships
- [ ] All 5 section specs exist in `product/sections/`
- [ ] All 5 section sample data includes EasyVista
- [ ] All UI components render without errors
- [ ] `product-plan/` export complete
- [ ] All commits pushed to GitHub

### Phase 2: Implementation Complete
- [ ] `npm run dev` runs without errors
- [ ] `npm run test` passes (>80% coverage)
- [ ] Auth works: login, logout, role-based access
- [ ] EasyVista data visible: 17 stakeholders, 33 tasks
- [ ] Dashboard shows project status by workstream
- [ ] Notion sync works (bi-directional)
- [ ] Calendar events sync

### Completion Promise
When ALL Phase 2 criteria pass:
```
<promise>YOURCO_MVP_COMPLETE</promise>
```

---

## Next Action

1. **Phase 0:** Git sync (push all repos, backup plan file)
2. **Phase 1:** Start Design OS → Run `/product-vision`
3. **Phase 2:** Implement in YourCo repo
