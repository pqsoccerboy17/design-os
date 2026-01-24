# YourCo Data Model

## Overview

YourCo uses a relational data model optimized for consulting business management. The model centers around Clients as the primary entity, with Projects, Stakeholders, and Opportunities extending from each client.

## Entity Relationships

```
User (team members)
  ├── has many TimeEntries
  ├── has many ClientAssignments
  ├── creates Activities
  └── logs AuditEvents

Client (companies you work with)
  ├── has many Stakeholders (key contacts)
  ├── has many Opportunities (sales pipeline)
  ├── has many Projects (active work)
  ├── has many Invoices
  ├── has many Activities
  └── has one ClientPortalAccess

Stakeholder (key contacts at clients)
  ├── belongs to Client
  ├── tagged with MeddpiccRoles (champion, EB, etc.)
  └── mentioned in Tasks

Opportunity (sales pipeline)
  ├── belongs to Client
  ├── has DealStage (lead → closed)
  ├── has CompetitorMentions
  └── converts to Project (when won)

Project (active engagements)
  ├── belongs to Client
  ├── originated from Opportunity (optional)
  ├── has many Phases
  ├── has many Tasks
  ├── has many TimeEntries
  └── covered by Invoices

Task (work items)
  ├── belongs to Project
  ├── belongs to Phase (optional)
  ├── assigned to User
  └── mentions Stakeholders
```

## Key Enums

### MeddpiccRole

Stakeholder classification using MEDDPICC sales methodology:

- `champion` — Internal advocate
- `economic_buyer` — Budget authority
- `technical_evaluator` — Evaluates technical fit
- `coach` — Provides inside information
- `blocker` — Opposes the engagement
- `user` — End user of deliverables

### DealStage

Pipeline stages with probability:

- `lead` (10%) → `qualified` (25%) → `discovery` (40%) → `proposal` (60%) → `negotiation` (80%) → `closed_won` (100%) or `closed_lost` (0%)

### UserRole

Access control:

- `admin` — Full system access
- `consultant` — CRUD on assigned clients
- `viewer` — Read-only access
- `client` — External portal access

## Health Score

Client health (0-100) is calculated from:

- MEDDPICC completeness (30%)
- Champion identified (20%)
- Economic Buyer engaged (15%)
- Stakeholder engagement avg (20%)
- Activity recency (15%)

Thresholds: Healthy (70+), At Risk (40-69), Critical (0-39)

## Security Notes

- PII fields (email, phone, notes) should be encrypted at rest
- Client assignments control data access for Consultant role
- All mutations should log to AuditLog
- ClientPortalAccess uses revocable tokens
