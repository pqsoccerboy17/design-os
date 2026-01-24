# YourCo — Product Overview

## Summary

Multi-client consulting business management platform for small teams (2-5 people). Centralizes client engagements, project tracking, stakeholder management, and invoicing with role-based access. Built for consultants who need one place to manage multiple active engagements.

## Key Problems Solved

1. **Scattered Client Information** — Client data lives across Notion, spreadsheets, email, and calendars. YourCo provides a unified client dashboard showing all active engagements, deadlines, and key contacts in one view.

2. **No Visibility Into Project Progress** — Hard to know where each workstream stands across multiple clients. YourCo offers project tracking with phases, milestones, and visual timeline with real-time status by workstream.

3. **Stakeholder Engagement Falls Through Cracks** — Important stakeholders get forgotten. YourCo includes a Stakeholder CRM tied to each client with engagement tracking, logged interactions, and risk flagging.

4. **Reporting Takes Too Long** — Creating client status reports or internal dashboards requires manual data gathering. YourCo provides auto-generated dashboards and client-facing status pages from live project data.

5. **Time Tracking Disconnected From Invoicing** — Billable hours tracked separately from invoices. YourCo integrates time tracking that flows directly into invoice generation.

## Planned Sections

1. **Clients** — Client profiles with contracts, contacts, pipeline tracking, and MEDDPICC sales methodology for qualification.

2. **Projects** — Project tracking with phases, deliverables, milestones, and visual timeline (Gantt) per client.

3. **Tasks** — Cross-project task management with kanban board, priority levels, and stakeholder mentions.

4. **Dashboards** — Internal team dashboard with metrics and charts, plus configurable client portal for external stakeholders.

5. **Invoicing** — Time entry tracking (billable/non-billable) with invoice generation and payment status monitoring.

6. **Admin** — User management, role-based access control (Admin, Consultant, Viewer, Client), audit logging, and GDPR/CCPA compliance.

## Data Model

**Core Entities:**

- User, Client, Stakeholder, Opportunity, Activity
- Project, Phase, Task, TimeEntry
- Invoice, Competitor, CompetitorMention
- ClientAssignment, AuditLog, ClientPortalAccess

**Key Enums:**

- MeddpiccRole: champion, economic_buyer, technical_evaluator, coach, blocker, user
- DealStage: lead, qualified, discovery, proposal, negotiation, closed_won, closed_lost
- UserRole: admin, consultant, viewer, client

See `data-model/types.ts` for complete TypeScript definitions.

## Design System

**Colors:**

- Primary: `stone` — Warm, professional neutral for backgrounds and text
- Secondary: `amber` — Energetic accent for CTAs, active states, and highlights
- Neutral: `zinc` — Cool neutral for dark mode backgrounds

**Typography:**

- Heading: Space Grotesk — Modern geometric sans-serif
- Body: Inter — Clean, highly readable sans-serif
- Mono: IBM Plex Mono — Technical/code contexts

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, and routing structure
2. **Shell** — Arc Browser-inspired sidebar navigation with collapsible/peek states
3. **Clients** — Client management with pipeline kanban and MEDDPICC tracking
4. **Projects** — Project lifecycle with phases, tasks, and Gantt timeline
5. **Tasks** — Cross-project task board with filtering and stakeholder mentions
6. **Dashboards** — Internal metrics dashboard and configurable client portal
7. **Invoicing** — Time tracking and invoice generation workflow
8. **Admin** — User management, permissions, and audit logging

Each milestone has a dedicated instruction document in `instructions/incremental/`.
