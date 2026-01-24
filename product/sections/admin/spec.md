# Security & Admin Section Specification

## Overview

The Security & Admin section provides system administration capabilities including user management, role-based access control, audit logging, and organizational settings. This section is typically restricted to Admin users only.

## Screens

### UserManagement

Manage team members, roles, and authentication settings.

**Layout:**
- Header with "Invite User" button
- Stats: Active Users, Pending Invites, MFA Enabled %
- User table with inline actions

**User Table Columns:**
| Column | Content | Sort |
|--------|---------|------|
| User | Avatar, name, email | Yes |
| Role | Badge (Admin, Consultant, Viewer) | Yes |
| Status | Active, Pending, Suspended | Yes |
| MFA | Enabled/Disabled indicator | Yes |
| Last Active | Relative date | Yes |
| Actions | Edit, Suspend, Delete | No |

**User Detail Panel (Slide-over):**
```
┌─────────────────────────────────────────────────────┐
│  [Avatar]  Alex Rivera                          [×] │
│            alex@yourco.com                          │
│            Admin · Active                           │
├─────────────────────────────────────────────────────┤
│  ROLE & PERMISSIONS                                 │
│  ┌───────────────────────────────────────────────┐  │
│  │ Role: [Admin ▼]                               │  │
│  │                                               │  │
│  │ Permissions:                                  │  │
│  │ ✓ Manage users and roles                     │  │
│  │ ✓ View audit logs                            │  │
│  │ ✓ Manage organization settings               │  │
│  │ ✓ All client access                          │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│  SECURITY                                           │
│  MFA: ✓ Enabled (TOTP)                             │
│  Last password change: 45 days ago                  │
│  Active sessions: 2                                 │
│  [Reset Password] [Revoke All Sessions]            │
├─────────────────────────────────────────────────────┤
│  CLIENT ASSIGNMENTS                                 │
│  • Acme Corporation (Lead)                          │
│  • Globex Industries (Member)                       │
│  • Initech Solutions (Member)                       │
│  [Manage Assignments]                               │
├─────────────────────────────────────────────────────┤
│  ACTIVITY                                           │
│  Last login: Today at 9:15 AM                       │
│  Login count (30d): 24                              │
│  [View Full Audit Log]                              │
└─────────────────────────────────────────────────────┘
```

**Invite User Modal:**
| Field | Type | Required |
|-------|------|----------|
| Email | Email input | Yes |
| Name | Text input | Yes |
| Role | Select (Admin, Consultant, Viewer) | Yes |
| Require MFA | Checkbox (forced for Admin) | No |
| Client Assignments | Multi-select | No |
| Welcome Message | Textarea | No |

---

### ClientAssignments

Manage which team members have access to which clients.

**Layout:**
- Matrix view: Users (rows) × Clients (columns)
- Toggle between matrix and list view
- Bulk assignment actions

**Matrix View:**
```
┌──────────────────────────────────────────────────────────────────┐
│                  │ Acme Corp │ Globex │ Initech │ Stark │ Assign │
├──────────────────┼───────────┼────────┼─────────┼───────┼────────┤
│ Alex Rivera      │    ⬤ L    │   ⬤    │    ⬤    │       │ [+]    │
│ Jamie Chen       │    ⬤      │        │    ⬤ L  │   ⬤   │ [+]    │
│ Morgan Smith     │           │   ⬤ L  │         │       │ [+]    │
└──────────────────────────────────────────────────────────────────┘

Legend: ⬤ = Assigned, L = Lead
```

**List View (by Client):**
```
┌─────────────────────────────────────────────────────┐
│ Acme Corporation                                    │
│ ├── Alex Rivera (Lead)                              │
│ └── Jamie Chen                                      │
│                                            [+ Add]  │
├─────────────────────────────────────────────────────┤
│ Globex Industries                                   │
│ ├── Morgan Smith (Lead)                             │
│ └── Alex Rivera                                     │
│                                            [+ Add]  │
└─────────────────────────────────────────────────────┘
```

**Assignment Actions:**
- Assign user to client (role: Lead or Member)
- Remove assignment
- Transfer Lead role
- Bulk assign user to multiple clients

---

### AuditLog

Searchable log of all system activities for compliance and security review.

**Layout:**
- Search and filter bar
- Date range selector
- Log entry table with expandable rows

**Filter Options:**
| Filter | Options |
|--------|---------|
| Action | All, Create, Read, Update, Delete, Login, Logout, Export |
| Resource | All, Client, Project, Task, Invoice, User, Settings |
| User | Multi-select of all users |
| Date Range | Today, Last 7 days, Last 30 days, Custom |
| Status | All, Success, Failed |

**Log Entry Table:**
| Column | Content |
|--------|---------|
| Timestamp | Absolute datetime |
| User | Name and avatar |
| Action | Badge (Create, Update, Delete, etc.) |
| Resource | Type and identifier |
| Details | Brief description |
| IP Address | Shown on expand |

**Expanded Log Entry:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 2025-01-22 14:30:22 UTC                                         │
│                                                                 │
│ User: Alex Rivera (alex@yourco.com)                             │
│ Action: UPDATE                                                  │
│ Resource: Client (client-001: Acme Corporation)                 │
│                                                                 │
│ Changes:                                                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Field               │ Before          │ After               │ │
│ ├─────────────────────┼─────────────────┼─────────────────────┤ │
│ │ status              │ prospect        │ active              │ │
│ │ budget              │ 100000          │ 150000              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Session: sess_abc123...                                         │
│ IP Address: 203.0.113.45                                        │
│ User Agent: Chrome 121 on macOS                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Export Options:**
- CSV export of filtered results
- JSON export for compliance
- Date range limit for large exports

---

### Settings

Organization-wide settings and integrations.

**Layout:**
- Tabbed navigation: General, Security, Integrations, Billing

**General Tab:**
```
┌─────────────────────────────────────────────────────┐
│ ORGANIZATION                                        │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Name:         [YourCo Consulting        ]       │ │
│ │ Logo:         [Upload] current: yourco-logo.png │ │
│ │ Timezone:     [America/Los_Angeles ▼]           │ │
│ │ Date Format:  [MM/DD/YYYY ▼]                    │ │
│ │ Currency:     [USD - US Dollar ▼]               │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ DEFAULTS                                            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Default hourly rate:     [$150.00]              │ │
│ │ Invoice payment terms:   [NET 30 ▼]             │ │
│ │ Time entry rounding:     [15 minutes ▼]         │ │
│ │ Week starts on:          [Monday ▼]             │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Security Tab:**
```
┌─────────────────────────────────────────────────────┐
│ AUTHENTICATION                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Require MFA for:                                │ │
│ │   ☑ Admin users (required)                      │ │
│ │   ☐ All users                                   │ │
│ │                                                 │ │
│ │ Session timeout:     [24 hours ▼]               │ │
│ │ Max sessions/user:   [3]                        │ │
│ │ Remember me duration: [30 days ▼]               │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ PASSWORD POLICY                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Minimum length:      [12]                       │ │
│ │ Require uppercase:   ☑                          │ │
│ │ Require number:      ☑                          │ │
│ │ Require special:     ☐                          │ │
│ │ Password history:    [5] passwords              │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ AUDIT LOGGING                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Retention period:    [90 days ▼]                │ │
│ │ Log read access:     ☐ (increases log volume)   │ │
│ │ Log page views:      ☐                          │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Integrations Tab:**
```
┌─────────────────────────────────────────────────────┐
│ CONNECTED SERVICES                                  │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Notion icon] Notion                    [···]   │ │
│ │ Connected · Last sync: 5 min ago                │ │
│ │ Syncing: Projects, Tasks                        │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Calendar icon] Google Calendar       [Connect] │ │
│ │ Not connected                                   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Slack icon] Slack                    [Connect] │ │
│ │ Not connected                                   │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ EMAIL SETTINGS                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Send invoices from:  [billing@yourco.com]       │ │
│ │ CC admin on:         ☐ New invoices             │ │
│ │                      ☑ Overdue reminders        │ │
│ │ Reply-to:            [support@yourco.com]       │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Billing Tab (Organization Subscription):**
```
┌─────────────────────────────────────────────────────┐
│ CURRENT PLAN                                        │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Plan: Professional                              │ │
│ │ Users: 3 of 10                                  │ │
│ │ Clients: 5 of unlimited                         │ │
│ │ Next billing: Feb 1, 2025 ($99/mo)              │ │
│ │                                                 │ │
│ │ [Change Plan] [Manage Payment Method]           │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ USAGE THIS PERIOD                                   │
│ Storage: 2.1 GB of 10 GB                           │
│ API calls: 1,234 of 10,000                         │
│ Portal views: 89                                    │
└─────────────────────────────────────────────────────┘
```

---

### DataManagement

GDPR/CCPA compliance and data lifecycle management.

**Layout:**
- Data retention settings
- Deletion requests queue
- Export data functionality

**Data Retention:**
```
┌─────────────────────────────────────────────────────┐
│ RETENTION POLICIES                                  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Active client data:    Indefinite               │ │
│ │ Churned client data:   [2 years ▼] then delete  │ │
│ │ Audit logs:            [90 days ▼] then delete  │ │
│ │ Session data:          [30 days ▼] then delete  │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ PENDING DELETIONS                                   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Umbrella Health (client-005)                    │ │
│ │ Soft deleted: Jan 10, 2025                      │ │
│ │ Permanent deletion: Feb 9, 2025 (17 days)       │ │
│ │ [Restore] [Delete Now]                          │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ DATA EXPORT                                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Export all data for compliance:                 │ │
│ │ [Export All Client Data (JSON)]                 │ │
│ │ [Export Audit Logs (CSV)]                       │ │
│ │ [Export User Data (JSON)]                       │ │
│ │                                                 │ │
│ │ Last export: Jan 15, 2025 by Alex Rivera        │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## User Flows

### Invite New User
1. Admin clicks "Invite User" on UserManagement
2. Fills in email, name, selects role
3. Optionally assigns to clients
4. Clicks "Send Invite"
5. System sends invite email with setup link
6. New user appears in table as "Pending"
7. Toast: "Invitation sent to jamie@yourco.com"

### Enable MFA for User
1. Admin opens user detail panel
2. Sees MFA status (Enabled/Disabled)
3. If disabled, clicks "Require MFA"
4. User receives notification to set up MFA
5. User completes TOTP setup on next login
6. Status updates to "Enabled"

### Review Audit Log for Incident
1. Admin navigates to Audit Log
2. Sets date range around incident time
3. Filters by affected resource or user
4. Expands relevant entries to see full details
5. Identifies sequence of events
6. Exports filtered log for incident report

### Suspend User Account
1. Admin opens user detail for departing employee
2. Clicks "Suspend Account"
3. Confirms action in modal
4. System: Revokes all active sessions
5. System: Disables login
6. System: Preserves data and audit trail
7. User status changes to "Suspended"
8. Toast: "User suspended. All sessions revoked."

### Delete Client Data (GDPR Request)
1. Admin navigates to DataManagement
2. Selects client from dropdown
3. Clicks "Initiate Deletion"
4. Reviews what will be deleted (cascade list)
5. Confirms by typing client name
6. System: Soft-deletes all data
7. 30-day grace period begins
8. Notification to admin before permanent deletion

---

## Permission Matrix

| Resource | Admin | Consultant | Viewer | Client |
|----------|-------|------------|--------|--------|
| Users | CRUD | R (self) | R (self) | — |
| Clients | CRUD | CRUD (assigned) | R | R (own) |
| Opportunities | CRUD | CRUD (assigned) | R | — |
| Projects | CRUD | CRUD (assigned) | R | R (own) |
| Tasks | CRUD | CRUD (assigned) | R | — |
| Stakeholders | CRUD | CRUD (assigned) | R | R (own) |
| Invoices | CRUD | R | R | R (own) |
| Time Entries | CRUD | CRUD (own) | R | — |
| Activities | CRUD | CRUD | R | — |
| Audit Logs | R | — | — | — |
| Settings | CRUD | — | — | — |
| Integrations | CRUD | — | — | — |

---

## Security Requirements

### Authentication
- Email/password with bcrypt hashing
- TOTP-based MFA (optional for Consultant, required for Admin)
- SSO support (future: SAML, OIDC)
- Magic link option for password recovery

### Session Management
- JWT-based session tokens
- Configurable timeout (default: 24 hours idle)
- Maximum concurrent sessions per user
- Admin can revoke all sessions for any user

### Password Policy
- Minimum 12 characters
- At least 1 uppercase, 1 lowercase, 1 number
- Cannot reuse last 5 passwords
- No expiration (MFA compensates)

### Data Protection
- PII fields encrypted at rest (AES-256)
- TLS 1.3 for all transit
- Field-level encryption for: email, phone, notes
- Separate backup encryption keys

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `u` | User management |
| `a` | Audit log |
| `s` | Settings |
| `/` | Focus search |
| `?` | Show shortcuts |
| `Escape` | Close panel/modal |

---

## Data Dependencies

### Required Entities
- **User** - Team members with roles and permissions
- **ClientAssignment** - Junction table for user-client access
- **AuditLog** - All tracked system activities
- **Settings** - Organization configuration

### Cross-References
- All sections - User actions logged to AuditLog
- `clients/data.json` - Client list for assignments
- `invoicing/data.json` - Billing settings sync

---

## Validation Rules

### User
- Email: Valid format, unique in system
- Name: 1-100 characters
- Role: Must be valid role enum
- MFA: Required if role is Admin

### Password
- Length: 12-128 characters
- Complexity: Per password policy
- History: Cannot match last 5

### Client Assignment
- User must exist and be active
- Client must exist and not be deleted
- Only one Lead per client

---

## Error States

### Authentication
- "Invalid email or password"
- "Account suspended. Contact administrator."
- "MFA required. Please complete setup."
- "Session expired. Please sign in again."
- "Maximum sessions reached. Sign out from another device."

### Authorization
- "You don't have permission to view this resource"
- "Only administrators can access this section"
- "You are not assigned to this client"

### User Management
- "Email already in use"
- "Cannot delete yourself"
- "Cannot demote last admin"
- "User has pending work. Reassign before deletion."

---

## Accessibility

- All forms have visible labels and error states
- Role/status badges include text, not just color
- Audit log table rows keyboard navigable
- Modal focus trapping on confirmations
- Screen reader announcements for state changes
- High contrast mode support for security indicators
