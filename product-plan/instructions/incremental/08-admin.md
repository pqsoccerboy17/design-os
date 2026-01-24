# Milestone 8: Admin

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

Implement admin functionality with user management, role-based access control, client assignments, audit logging, and organization settings.

## Overview

The Admin section provides organization management:

- Manage team members and roles
- Invite new users
- Assign users to clients
- Track system activity via audit log
- Configure organization settings

**Key Features:**

- User list with role and status
- User invitation workflow
- Role-based permissions (admin, consultant, viewer, client)
- MFA enablement tracking
- Client-to-consultant assignments
- Comprehensive audit log
- Organization settings

## Recommended Approach: Test-Driven Development

Before implementing, read `product-plan/sections/admin/tests.md` for test-writing guidance.

**TDD Workflow:**

1. Write failing tests for API endpoints and business logic
2. Implement the minimum code to pass tests
3. Refactor while keeping tests green

## What to Implement

### 1. User Management (`UserManagement`)

Copy from `product-plan/sections/admin/components/UserManagement.tsx`

**Summary Cards:**
| Card | Metric |
|------|--------|
| Total Users | Count of all users |
| Active Users | Users with status = active |
| Pending Invites | Invitations not yet accepted |
| MFA Enabled | Percentage with MFA |

**User Table Columns:**

- Avatar + Name
- Email
- Role badge
- Status badge
- MFA indicator
- Last login
- Actions menu

**Actions:**

- Edit user
- Change role
- Deactivate/Reactivate
- Reset password
- Resend invite

**API Endpoints:**

```
GET /api/users
GET /api/users/stats
POST /api/users/invite
PATCH /api/users/:id
DELETE /api/users/:id
POST /api/users/:id/resend-invite
```

### 2. User Roles

**Role Values:**

```typescript
type UserRole = "admin" | "consultant" | "viewer" | "client";
```

**Role Permissions:**
| Permission | admin | consultant | viewer | client |
|------------|-------|------------|--------|--------|
| Manage users | Yes | No | No | No |
| Manage all clients | Yes | No | No | No |
| View assigned clients | Yes | Yes | Yes | Own only |
| Edit projects | Yes | Yes | No | No |
| Log time | Yes | Yes | No | No |
| View invoices | Yes | Yes | No | Own only |
| Access admin | Yes | No | No | No |

**Role Colors:**
| Role | Background | Text |
|------|------------|------|
| admin | violet-100 | violet-700 |
| consultant | sky-100 | sky-700 |
| viewer | stone-100 | stone-700 |
| client | amber-100 | amber-700 |

### 3. User Status

**Status Values:**

```typescript
type UserStatus = "active" | "pending" | "deactivated";
```

- `pending` — Invited but not yet registered
- `active` — Can log in and use system
- `deactivated` — Cannot log in

### 4. User Invitation

**Invitation Flow:**

1. Admin enters email and selects role
2. System creates user with status = pending
3. Email sent with magic link
4. User clicks link, sets password
5. Status changes to active

**Schema:**

```typescript
interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}
```

**API:**

```
POST /api/users/invite
Body: { email: string, role: UserRole }

POST /api/users/accept-invite
Body: { token: string, password: string, name: string }
```

### 5. Client Assignments (`ClientAssignments`)

Copy from `product-plan/sections/admin/components/ClientAssignments.tsx`

**Matrix View:**

- Rows: Consultants
- Columns: Clients
- Cells: Assignment role (Lead, Support, None)

**Assignment Roles:**

```typescript
type AssignmentRole = "lead" | "support";
```

- `lead` — Primary consultant for client
- `support` — Secondary/support role

**API:**

```
GET /api/client-assignments
GET /api/client-assignments?userId=xxx
POST /api/client-assignments
DELETE /api/client-assignments/:id
```

### 6. Audit Log (`AuditLog`)

Copy from `product-plan/sections/admin/components/AuditLog.tsx`

**Log Entry Schema:**

```typescript
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: Record<string, { old: any; new: any }>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}
```

**Actions to Log:**

- User login/logout
- User created/updated/deleted
- Client created/updated/deleted
- Project created/updated/deleted
- Invoice sent/paid
- Settings changed

**Columns:**

- Timestamp
- User
- Action
- Entity
- Changes (expandable)
- IP Address

**Filters:**

- Date range
- User
- Action type
- Entity type

**API:**

```
GET /api/audit-logs
GET /api/audit-logs?userId=xxx
GET /api/audit-logs?action=user.login
GET /api/audit-logs?startDate=2024-01-01
```

### 7. Settings (`Settings`)

Copy from `product-plan/sections/admin/components/Settings.tsx`

**Setting Sections:**

**Organization:**

- Company name
- Logo upload
- Primary color (for branding)
- Timezone

**Invoicing:**

- Default payment terms (Net 30)
- Default tax rate
- Invoice prefix (INV)
- Bank details / payment instructions

**Security:**

- Require MFA for admins
- Session timeout duration
- Password requirements

**Integrations:**

- API keys management
- Webhook URLs

**API:**

```
GET /api/settings
PATCH /api/settings
POST /api/settings/logo (multipart upload)
```

### 8. Data Management (`DataManagement`)

Copy from `product-plan/sections/admin/components/DataManagement.tsx`

**Features:**

- Export all data (JSON/CSV)
- Import data from CSV
- Backup download
- Data deletion (GDPR compliance)

**API:**

```
GET /api/export?format=json
GET /api/export?format=csv
POST /api/import (multipart CSV upload)
POST /api/backup
DELETE /api/data/:userId (for GDPR deletion)
```

### 9. MFA Implementation

**MFA Schema:**

```typescript
interface User {
  // ...
  mfaEnabled: boolean;
  mfaSecret: string | null;
  mfaBackupCodes: string[];
}
```

**MFA Flow:**

1. User enables MFA in settings
2. System generates TOTP secret
3. User scans QR code with authenticator app
4. User enters code to verify
5. MFA enabled, backup codes generated

**API:**

```
POST /api/users/me/mfa/enable
POST /api/users/me/mfa/verify
POST /api/users/me/mfa/disable
GET /api/users/me/mfa/backup-codes
```

## Expected User Flows

**Flow 1: Invite Team Member**

1. Admin opens `/admin`
2. Clicks "Invite User"
3. Enters email: "jane@company.com"
4. Selects role: "Consultant"
5. Clicks "Send Invite"
6. Jane receives email with invite link

**Flow 2: Assign Consultant to Client**

1. Admin opens `/admin/assignments`
2. Views matrix of consultants × clients
3. Clicks cell for "Jane" + "Acme Corp"
4. Selects "Lead"
5. Jane now sees Acme Corp in her client list

**Flow 3: Review Audit Log**

1. Admin opens `/admin/audit`
2. Filters by action: "invoice.sent"
3. Filters by date: last 7 days
4. Views who sent which invoices
5. Expands entry to see details

**Flow 4: Configure Settings**

1. Admin opens `/admin/settings`
2. Updates company name
3. Sets default payment terms to "Net 15"
4. Enables "Require MFA for admins"
5. Saves settings

## Files to Reference

- `product-plan/sections/admin/README.md` — Section overview
- `product-plan/sections/admin/components/` — React components
- `product-plan/sections/admin/tests.md` — Test-writing guidance
- `product-plan/data-model/types.ts` — User, AuditLog types
- `product-plan/data-model/sample-data.json` — Test data

## Done When

- [ ] User list displays with roles and status
- [ ] Summary cards show correct counts
- [ ] User invitation sends email
- [ ] Invited users can accept and register
- [ ] Role changes update permissions
- [ ] User deactivation prevents login
- [ ] Client assignments matrix works
- [ ] Assignment changes apply immediately
- [ ] Audit log captures all actions
- [ ] Audit log filters work
- [ ] Settings can be viewed and updated
- [ ] MFA can be enabled/disabled
- [ ] Data export generates files
- [ ] Empty states display when no records
- [ ] Admin routes protected by role
