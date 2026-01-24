// Security & Admin Section Types
// User management, RBAC, audit logging, and organization settings

// =============================================================================
// Tier 1: Enums
// =============================================================================

export type UserRole = 'admin' | 'consultant' | 'viewer' | 'client'
export type UserStatus = 'active' | 'pending' | 'suspended'
export type AssignmentRole = 'lead' | 'member'
export type AuditAction = 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'invite' | 'suspend'
export type MfaStatus = 'disabled' | 'pending_setup' | 'enabled'
export type IntegrationStatus = 'connected' | 'disconnected' | 'error'
export type RetentionPeriod = '30_days' | '60_days' | '90_days' | '180_days' | '365_days' | 'indefinite'

// =============================================================================
// Tier 2: Core Entities
// =============================================================================

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  avatarUrl: string | null
  mfaStatus: MfaStatus
  lastPasswordChange: string | null
  lastLoginAt: string | null
  loginCount30Days: number
  createdAt: string
  updatedAt: string
}

export interface ClientAssignment {
  id: string
  userId: string
  clientId: string
  role: AssignmentRole
  assignedAt: string
  assignedBy: string
}

export interface AuditLog {
  id: string
  userId: string | null
  action: AuditAction
  resourceType: string
  resourceId: string
  resourceName: string | null
  changes: AuditChanges | null
  ipAddress: string
  userAgent: string
  sessionId: string | null
  success: boolean
  errorMessage: string | null
  timestamp: string
}

export interface AuditChanges {
  before: Record<string, unknown>
  after: Record<string, unknown>
}

export interface Session {
  id: string
  userId: string
  ipAddress: string
  userAgent: string
  createdAt: string
  expiresAt: string
  lastActivityAt: string
  isCurrent: boolean
}

export interface Invitation {
  id: string
  email: string
  name: string
  role: UserRole
  clientIds: string[]
  invitedBy: string
  invitedAt: string
  expiresAt: string
  acceptedAt: string | null
}

export interface Integration {
  id: string
  type: 'notion' | 'google_calendar' | 'slack' | 'email'
  name: string
  status: IntegrationStatus
  connectedAt: string | null
  lastSyncAt: string | null
  config: Record<string, unknown>
  error: string | null
}

export interface DataDeletionRequest {
  id: string
  resourceType: 'client' | 'user' | 'stakeholder'
  resourceId: string
  resourceName: string
  requestedBy: string
  requestedAt: string
  reason: string | null
  softDeletedAt: string
  permanentDeletionAt: string
  status: 'pending' | 'completed' | 'cancelled'
}

// =============================================================================
// Tier 3: Settings Types
// =============================================================================

export interface OrganizationSettings {
  name: string
  logoUrl: string | null
  timezone: string
  dateFormat: string
  currency: string
  defaultHourlyRate: number // in cents
  invoicePaymentTerms: string
  timeEntryRounding: number // minutes
  weekStartsOn: 'sunday' | 'monday'
}

export interface SecuritySettings {
  mfaRequiredForAdmins: boolean
  mfaRequiredForAll: boolean
  sessionTimeoutHours: number
  maxSessionsPerUser: number
  rememberMeDays: number
  passwordMinLength: number
  passwordRequireUppercase: boolean
  passwordRequireNumber: boolean
  passwordRequireSpecial: boolean
  passwordHistoryCount: number
  auditLogRetentionDays: number
  logReadAccess: boolean
  logPageViews: boolean
}

export interface EmailSettings {
  sendInvoicesFrom: string
  ccAdminOnNewInvoices: boolean
  ccAdminOnOverdueReminders: boolean
  replyToAddress: string
}

export interface DataRetentionSettings {
  activeClientData: RetentionPeriod
  churnedClientData: RetentionPeriod
  auditLogs: RetentionPeriod
  sessionData: RetentionPeriod
}

export interface AllSettings {
  organization: OrganizationSettings
  security: SecuritySettings
  email: EmailSettings
  dataRetention: DataRetentionSettings
}

// =============================================================================
// Tier 4: Computed/Aggregated Types
// =============================================================================

export interface UserWithAssignments extends User {
  assignments: {
    clientId: string
    clientName: string
    role: AssignmentRole
  }[]
  activeSessions: number
}

export interface AuditLogWithUser extends AuditLog {
  user: { id: string; name: string; email: string; avatarUrl: string | null } | null
}

export interface ClientAssignmentMatrix {
  users: { id: string; name: string; avatarUrl: string | null }[]
  clients: { id: string; name: string }[]
  assignments: {
    userId: string
    clientId: string
    role: AssignmentRole
  }[]
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  pendingInvites: number
  mfaEnabledPercentage: number
  byRole: Record<UserRole, number>
}

export interface AuditLogStats {
  totalToday: number
  failedLogins24h: number
  changesThisWeek: number
  exportCount30d: number
  topUsers: { userId: string; name: string; actionCount: number }[]
}

export interface UsageStats {
  storageUsedBytes: number
  storageLimitBytes: number
  apiCallsThisPeriod: number
  apiCallsLimit: number
  portalViewsThisPeriod: number
}

// =============================================================================
// Tier 5: Form/Input Types
// =============================================================================

export interface InviteUserInput {
  email: string
  name: string
  role: UserRole
  requireMfa: boolean
  clientIds: string[]
  welcomeMessage?: string
}

export interface UpdateUserInput {
  name?: string
  role?: UserRole
  status?: UserStatus
}

export interface AssignClientInput {
  userId: string
  clientId: string
  role: AssignmentRole
}

export interface AuditLogFilters {
  action: AuditAction | 'all'
  resourceType: string | 'all'
  userIds: string[]
  dateRange: 'today' | 'last_7_days' | 'last_30_days' | 'custom'
  customDateStart?: string
  customDateEnd?: string
  success: boolean | 'all'
}

export interface DeleteDataInput {
  resourceType: 'client' | 'user' | 'stakeholder'
  resourceId: string
  reason?: string
  confirmationText: string // Must match resource name
}

// =============================================================================
// Tier 6: Component Props
// =============================================================================

export interface UserManagementProps {
  users: UserWithAssignments[]
  stats: UserStats
  onInviteUser?: (input: InviteUserInput) => void
  onUpdateUser?: (userId: string, updates: UpdateUserInput) => void
  onSuspendUser?: (userId: string) => void
  onReactivateUser?: (userId: string) => void
  onDeleteUser?: (userId: string) => void
  onResetPassword?: (userId: string) => void
  onRevokeSessions?: (userId: string) => void
}

export interface UserDetailPanelProps {
  user: UserWithAssignments
  sessions: Session[]
  recentActivity: AuditLogWithUser[]
  onClose?: () => void
  onUpdateRole?: (role: UserRole) => void
  onManageAssignments?: () => void
  onResetPassword?: () => void
  onRevokeSessions?: () => void
  onViewFullAuditLog?: () => void
}

export interface ClientAssignmentsProps {
  matrix: ClientAssignmentMatrix
  viewMode: 'matrix' | 'list'
  onViewModeChange?: (mode: 'matrix' | 'list') => void
  onAssign?: (input: AssignClientInput) => void
  onUnassign?: (userId: string, clientId: string) => void
  onTransferLead?: (clientId: string, newLeadId: string) => void
}

export interface AuditLogProps {
  logs: AuditLogWithUser[]
  stats: AuditLogStats
  filters: AuditLogFilters
  hasMore: boolean
  onFilterChange?: (filters: AuditLogFilters) => void
  onLoadMore?: () => void
  onExportCsv?: () => void
  onExportJson?: () => void
  onLogClick?: (logId: string) => void
}

export interface AuditLogDetailProps {
  log: AuditLogWithUser
  onClose?: () => void
}

export interface SettingsProps {
  settings: AllSettings
  integrations: Integration[]
  usage: UsageStats
  onSaveOrganization?: (settings: OrganizationSettings) => void
  onSaveSecurity?: (settings: SecuritySettings) => void
  onSaveEmail?: (settings: EmailSettings) => void
  onSaveDataRetention?: (settings: DataRetentionSettings) => void
  onConnectIntegration?: (type: Integration['type']) => void
  onDisconnectIntegration?: (id: string) => void
}

export interface DataManagementProps {
  retentionSettings: DataRetentionSettings
  pendingDeletions: DataDeletionRequest[]
  lastExport: { date: string; user: string } | null
  onUpdateRetention?: (settings: DataRetentionSettings) => void
  onInitiateDelete?: (input: DeleteDataInput) => void
  onRestoreData?: (requestId: string) => void
  onPermanentDelete?: (requestId: string) => void
  onExportAllData?: (format: 'json' | 'csv') => void
}

export interface InviteUserModalProps {
  clients: { id: string; name: string }[]
  onSubmit?: (input: InviteUserInput) => void
  onCancel?: () => void
}

export interface ConfirmSuspendModalProps {
  user: User
  onConfirm?: () => void
  onCancel?: () => void
}

export interface ConfirmDeleteDataModalProps {
  resourceType: 'client' | 'user' | 'stakeholder'
  resourceName: string
  cascadeItems: { type: string; count: number }[]
  onConfirm?: (confirmationText: string, reason?: string) => void
  onCancel?: () => void
}

// =============================================================================
// Tier 7: Permission Types
// =============================================================================

export type ResourceType = 'users' | 'clients' | 'opportunities' | 'projects' | 'tasks' | 'stakeholders' | 'invoices' | 'time_entries' | 'activities' | 'audit_logs' | 'settings' | 'integrations'

export type Permission = 'create' | 'read' | 'update' | 'delete'

export interface PermissionRule {
  role: UserRole
  resource: ResourceType
  permissions: Permission[]
  condition?: 'all' | 'assigned' | 'own' | 'self'
}

export interface PermissionCheck {
  allowed: boolean
  reason?: string
}
