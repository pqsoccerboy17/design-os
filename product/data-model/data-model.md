# Data Model

## Types

### MeddpiccRole
Stakeholder roles from the MEDDPICC sales methodology. Multi-select per stakeholder.

| Value | Description | Icon |
|-------|-------------|------|
| `champion` | Internal advocate who sells on your behalf | ⭐ |
| `economic_buyer` | Budget authority and final sign-off | 💰 |
| `technical_evaluator` | Evaluates technical fit | 🔧 |
| `coach` | Provides inside information | 🎯 |
| `blocker` | Opposes the engagement | 🚫 |
| `user` | End user of deliverables | 👤 |

### DealStage
Pipeline stages for opportunity tracking with auto-calculated probability.

| Value | Probability | Exit Criteria |
|-------|-------------|---------------|
| `lead` | 10% | Initial contact made |
| `qualified` | 25% | MEDDPICC fields populated, Champion identified |
| `discovery` | 40% | Pain identified, metrics defined |
| `proposal` | 60% | Proposal delivered, Economic Buyer engaged |
| `negotiation` | 80% | Terms being finalized |
| `closed_won` | 100% | Contract signed → Creates Project |
| `closed_lost` | 0% | Deal lost, reason captured |

### UserRole
Access control roles with permission levels.

| Value | Description |
|-------|-------------|
| `admin` | Full system access, user management, settings |
| `consultant` | CRUD on assigned clients, projects, tasks |
| `viewer` | Read-only access to all data |
| `client` | External portal access to own client data only |

### EngagementLevel
Stakeholder engagement tracking.

| Value | Description |
|-------|-------------|
| `high` | Actively engaged, regular communication |
| `medium` | Responsive but not proactive |
| `low` | Minimal engagement, slow responses |
| `disengaged` | No recent communication |

### ActivityType
Types of logged activities.

| Value | Description |
|-------|-------------|
| `call` | Phone or video call |
| `meeting` | In-person or scheduled meeting |
| `email` | Email correspondence |
| `note` | Internal note or observation |
| `task_completed` | Task completion record |

---

## Entities

### User
A person who uses the YourCo platform. Has a role that controls access permissions across clients and features.

**Fields:**
- `id`: uuid (primary key)
- `email`: string (unique, required)
- `name`: string (required)
- `role`: UserRole (required)
- `avatar_url`: string | null
- `created_at`: timestamp

### Client
A company or organization that the consulting firm works with. Stores company profile, contract details, onboarding status, and MEDDPICC qualification data.

**Fields:**
- `id`: uuid (primary key)
- `name`: string (required)
- `status`: enum (prospect, active, churned)
- `deadline`: date | null
- `budget`: number | null
- `meddpicc_metrics`: text | null (quantifiable success measures)
- `meddpicc_decision_criteria`: text | null (how they evaluate success)
- `meddpicc_decision_process`: text | null (steps and timeline to decision)
- `meddpicc_paper_process`: text | null (procurement, legal, contracts)
- `meddpicc_identified_pain`: text | null (core business problem)
- `meddpicc_competition`: text | null (alternatives being considered)
- `created_at`: timestamp
- `updated_at`: timestamp

### Stakeholder
A key contact or decision-maker within a client organization. Tracks MEDDPICC roles, engagement level, and communication history.

**Fields:**
- `id`: uuid (primary key)
- `client_id`: uuid (FK → Client, required)
- `name`: string (required)
- `email`: string | null (PII, encrypted)
- `phone`: string | null (PII, encrypted)
- `title`: string | null
- `role_tags`: MeddpiccRole[] (multi-select)
- `engagement_level`: EngagementLevel (required)
- `notes`: text | null (PII, encrypted)
- `last_contact_date`: date | null (auto-calculated from Activity)
- `created_at`: timestamp

### Opportunity
A sales opportunity or deal within a client relationship. Tracks pipeline stage, value, and conversion to Project.

**Fields:**
- `id`: uuid (primary key)
- `client_id`: uuid (FK → Client, required)
- `name`: string (required, e.g., "EasyVista ITSM Implementation")
- `type`: enum (new, renewal, expansion)
- `source`: enum (referral, inbound, outbound, event, partner)
- `stage`: DealStage (required)
- `value`: number (deal value in USD)
- `probability`: number (0-100, auto-calculated from stage)
- `days_in_stage`: number (auto-calculated)
- `expected_close_date`: date | null
- `actual_close_date`: date | null
- `outcome`: enum (won, lost) | null
- `loss_reason`: string | null (required if outcome = lost)
- `created_by`: uuid (FK → User, required)
- `created_at`: timestamp
- `updated_at`: timestamp

### Activity
A logged interaction or event. Provides timeline view and tracks stakeholder engagement.

**Fields:**
- `id`: uuid (primary key)
- `type`: ActivityType (required)
- `subject`: string (required)
- `description`: text | null
- `occurred_at`: datetime (required)
- `duration_minutes`: number | null
- `stakeholder_ids`: uuid[] (FK → Stakeholder)
- `client_id`: uuid (FK → Client, required)
- `opportunity_id`: uuid | null (FK → Opportunity)
- `project_id`: uuid | null (FK → Project)
- `created_by`: uuid (FK → User, required)
- `sentiment`: enum (positive, neutral, negative) | null
- `created_at`: timestamp

### Project
A specific engagement within a client relationship. Tracks phases, milestones, deliverables, timeline, and status. Can be created from a won Opportunity.

**Fields:**
- `id`: uuid (primary key)
- `client_id`: uuid (FK → Client, required)
- `opportunity_id`: uuid | null (FK → Opportunity, if created from won deal)
- `name`: string (required)
- `description`: text | null
- `status`: enum (planning, active, on_hold, completed, cancelled)
- `budget`: number | null (inherited from Opportunity if applicable)
- `start_date`: date | null
- `end_date`: date | null
- `created_at`: timestamp
- `updated_at`: timestamp

### Phase
A phase or milestone grouping within a project.

**Fields:**
- `id`: uuid (primary key)
- `project_id`: uuid (FK → Project, required)
- `name`: string (required)
- `order`: number (required, for sequencing)
- `start_date`: date | null
- `end_date`: date | null
- `status`: enum (pending, active, completed)

### Task
An individual work item within a project. Tracks effort level for quick logging. Can reference stakeholders and belong to a phase.

**Fields:**
- `id`: uuid (primary key)
- `project_id`: uuid (FK → Project, required)
- `phase_id`: uuid | null (FK → Phase)
- `assigned_to`: uuid | null (FK → User)
- `title`: string (required)
- `description`: text | null
- `effort`: enum (light, medium, heavy)
- `status`: enum (backlog, in_progress, review, done)
- `due_date`: date | null
- `is_milestone`: boolean (default: false)
- `is_critical`: boolean (default: false)
- `stakeholder_ids`: uuid[] (FK → Stakeholder, for mentions)
- `created_at`: timestamp
- `updated_at`: timestamp

### Invoice
A project-based bill sent to a client. Line items are deliverables or project phases. Targets Economic Buyer stakeholder.

**Fields:**
- `id`: uuid (primary key)
- `client_id`: uuid (FK → Client, required)
- `project_ids`: uuid[] (FK → Project, covers one or more)
- `invoice_number`: string (unique, required)
- `amount`: number (required)
- `currency`: string (default: "USD")
- `status`: enum (draft, sent, paid, overdue, cancelled)
- `due_date`: date (required)
- `sent_date`: date | null
- `paid_date`: date | null
- `recipient_stakeholder_id`: uuid | null (FK → Stakeholder, typically Economic Buyer)
- `notes`: text | null
- `created_at`: timestamp
- `updated_at`: timestamp

### TimeEntry
Logged time against a project or task for billing and tracking.

**Fields:**
- `id`: uuid (primary key)
- `user_id`: uuid (FK → User, required)
- `project_id`: uuid (FK → Project, required)
- `task_id`: uuid | null (FK → Task)
- `invoice_id`: uuid | null (FK → Invoice, when billed)
- `hours`: number (required)
- `date`: date (required)
- `description`: text | null
- `billable`: boolean (default: true)
- `created_at`: timestamp

### Competitor
A competing company or alternative solution tracked for competitive intelligence.

**Fields:**
- `id`: uuid (primary key)
- `name`: string (required)
- `website`: string | null
- `strengths`: text | null
- `weaknesses`: text | null
- `typical_pricing`: string | null
- `notes`: text | null
- `created_at`: timestamp
- `updated_at`: timestamp

### CompetitorMention
Junction table linking competitors to opportunities where they appear.

**Fields:**
- `competitor_id`: uuid (FK → Competitor, required)
- `opportunity_id`: uuid (FK → Opportunity, required)
- `status`: enum (active, displaced, lost_to)
- `notes`: text | null
- `created_at`: timestamp

### ClientAssignment
Junction table for RBAC - which users have access to which clients.

**Fields:**
- `user_id`: uuid (FK → User, required)
- `client_id`: uuid (FK → Client, required)
- `role`: enum (lead, member)
- `assigned_at`: timestamp

### AuditLog
Compliance and security logging for all significant actions.

**Fields:**
- `id`: uuid (primary key)
- `user_id`: uuid (FK → User, required)
- `action`: enum (create, read, update, delete, login, logout, export)
- `resource_type`: string (e.g., "Client", "Invoice")
- `resource_id`: uuid
- `changes`: jsonb | null (before/after for updates)
- `ip_address`: string
- `user_agent`: string
- `timestamp`: datetime (required)
- `session_id`: string

### ClientPortalAccess
Configuration for external client portal access with security controls.

**Fields:**
- `id`: uuid (primary key)
- `client_id`: uuid (FK → Client, required, unique)
- `access_token`: string (unique, rotatable)
- `expires_at`: datetime | null
- `password_protected`: boolean (default: false)
- `password_hash`: string | null
- `allowed_sections`: enum[] (projects, tasks, timeline, status)
- `created_by`: uuid (FK → User, required)
- `created_at`: timestamp
- `last_accessed_at`: timestamp | null

---

## Relationships

### Core Relationships
- User is assigned to many Tasks
- User has many TimeEntries
- User has many AuditLogs
- User creates many Activities
- Client has many Projects
- Client has many Stakeholders
- Client has many Opportunities
- Client has many Invoices
- Client has many Activities
- Client has one ClientPortalAccess
- Project belongs to Client
- Project belongs to Opportunity (optional, if created from won deal)
- Project has many Phases
- Project has many Tasks
- Project has many TimeEntries
- Project is covered by Invoice (many-to-many)
- Phase belongs to Project
- Phase has many Tasks
- Task belongs to Project
- Task belongs to Phase (optional)
- Task is assigned to User (optional)
- Task mentions many Stakeholders
- Stakeholder belongs to Client
- Invoice belongs to Client
- Invoice covers one or more Projects
- Invoice targets Stakeholder (Economic Buyer)
- TimeEntry belongs to User
- TimeEntry belongs to Project
- TimeEntry belongs to Task (optional)
- TimeEntry is billed on Invoice (optional)

### GTM Relationships
- Opportunity belongs to Client
- Opportunity has many Activities
- Opportunity converts to Project (1:1, when won)
- Opportunity has many CompetitorMentions
- Competitor has many CompetitorMentions
- Activity belongs to Client
- Activity belongs to Opportunity (optional)
- Activity belongs to Project (optional)
- Activity involves many Stakeholders

### Security Relationships
- User has many ClientAssignments
- Client has many ClientAssignments
- ClientAssignment links User to Client (N:M with role)
- AuditLog belongs to User
- ClientPortalAccess belongs to Client
- ClientPortalAccess created by User

---

## Health Score Calculation

Client health score (0-100) auto-calculated from:

| Factor | Weight | Calculation |
|--------|--------|-------------|
| MEDDPICC Completeness | 30% | % of MEDDPICC fields populated |
| Champion Identified | 20% | +20 if Champion tagged, 0 if not |
| Economic Buyer Engaged | 15% | +15 if EB has recent activity |
| Stakeholder Engagement | 20% | Avg engagement level across stakeholders |
| Activity Recency | 15% | Days since last activity (inverse) |

**Thresholds:**
- 🟢 Healthy: 70-100
- 🟡 At Risk: 40-69
- 🔴 Critical: 0-39
