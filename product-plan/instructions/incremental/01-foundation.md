# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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
