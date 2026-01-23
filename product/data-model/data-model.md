# Data Model

## Entities

### User
A person who uses the YourCo platform. Has a role (admin, consultant, or viewer) that controls access permissions across clients and features.

### Client
A company or organization that the consulting firm works with. Stores company profile, contract details, and onboarding status.

### Project
A specific engagement within a client relationship. Tracks phases, milestones, deliverables, timeline, and status.

### Task
An individual work item within a project. Tracks effort level (light/medium/heavy) for quick logging. Can have associated risks, questions, and dependencies. Assigned to team members.

### Stakeholder
A key contact or decision-maker within a client organization. Tracks engagement level and communication history.

### Invoice
A project-based bill sent to a client. Line items are deliverables or project phases. Contains totals, due date, and payment status.

## Relationships

- User is assigned to many Tasks
- Client has many Projects
- Client has many Stakeholders
- Client has many Invoices
- Project belongs to Client
- Project has many Tasks
- Project is covered by Invoice
- Task belongs to Project
- Task is assigned to User
- Stakeholder belongs to Client
- Invoice belongs to Client
- Invoice covers one or more Projects
