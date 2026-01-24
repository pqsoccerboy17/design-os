// =============================================================================
// Enums & Types
// =============================================================================

export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled'

export type PhaseStatus = 'pending' | 'active' | 'completed'

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export type TaskEffort = 'light' | 'medium' | 'heavy'

export type ProjectHealthStatus = 'on_track' | 'at_risk' | 'behind'

export type UserRole = 'admin' | 'consultant' | 'viewer'

// =============================================================================
// Data Types
// =============================================================================

export interface Project {
  id: string
  clientId: string
  opportunityId: string | null
  name: string
  description: string | null
  status: ProjectStatus
  budget: number | null
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export interface Phase {
  id: string
  projectId: string
  name: string
  order: number
  status: PhaseStatus
  startDate: string | null
  endDate: string | null
}

export interface Task {
  id: string
  projectId: string
  phaseId: string | null
  assignedTo: string | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  effort: TaskEffort
  dueDate: string | null
  estimatedHours: number | null
  actualHours: number
  isMilestone: boolean
  isCritical: boolean
  stakeholderIds: string[]
  createdAt: string
  updatedAt: string
}

export interface TimeEntry {
  id: string
  userId: string
  projectId: string
  taskId: string | null
  invoiceId: string | null
  hours: number
  date: string
  description: string | null
  billable: boolean
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl: string | null
}

// =============================================================================
// Computed Types
// =============================================================================

/** Progress metrics for a project */
export interface ProjectProgress {
  tasksTotal: number
  tasksCompleted: number
  phasesTotal: number
  phasesCompleted: number
  hoursUsed: number
  hoursBudget: number | null
  percentComplete: number
}

/** Project with computed progress metrics */
export interface ProjectWithProgress extends Project {
  progress: ProjectProgress
  healthStatus: ProjectHealthStatus
  daysRemaining: number | null
  isOverdue: boolean
}

/** Project list item for table view */
export interface ProjectListItem extends ProjectWithProgress {
  client: {
    id: string
    name: string
    status: 'prospect' | 'active' | 'churned'
  }
  teamMembers: {
    id: string
    name: string
    avatarUrl: string | null
  }[]
  lastActivityDate: string | null
}

/** Project with all related data for detail view */
export interface ProjectWithRelations extends ProjectWithProgress {
  client: {
    id: string
    name: string
    status: 'prospect' | 'active' | 'churned'
    healthScore: number
  }
  opportunity: {
    id: string
    name: string
    value: number
    stage: string
  } | null
  phases: PhaseWithTasks[]
  tasks: Task[]
  timeEntries: TimeEntryWithUser[]
  activities: ProjectActivity[]
  stakeholders: {
    id: string
    name: string
    title: string | null
    email: string | null
    roleTags: string[]
    engagementLevel: string
  }[]
}

/** Phase with nested tasks for timeline view */
export interface PhaseWithTasks extends Phase {
  tasks: Task[]
  progress: {
    tasksTotal: number
    tasksCompleted: number
    percentComplete: number
  }
}

/** Time entry with user info for display */
export interface TimeEntryWithUser extends TimeEntry {
  user: {
    id: string
    name: string
    avatarUrl: string | null
  }
  task: {
    id: string
    title: string
  } | null
}

/** Activity logged against a project */
export interface ProjectActivity {
  id: string
  type: 'task_completed' | 'phase_changed' | 'status_changed' | 'time_logged' | 'note' | 'meeting' | 'email' | 'call'
  subject: string
  description: string | null
  occurredAt: string
  createdBy: string
  userName: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface ProjectsListProps {
  /** The list of projects to display */
  projects: ProjectListItem[]
  /** Current view mode */
  view: 'list' | 'kanban' | 'timeline'
  /** Called when user wants to view a project's details */
  onView?: (id: string) => void
  /** Called when user wants to edit a project */
  onEdit?: (id: string) => void
  /** Called when user wants to archive a project */
  onArchive?: (id: string) => void
  /** Called when user wants to create a new project */
  onCreate?: () => void
  /** Called when view mode changes */
  onViewChange?: (view: 'list' | 'kanban' | 'timeline') => void
  /** Called when project status is changed (e.g., via kanban drag) */
  onStatusChange?: (id: string, status: ProjectStatus) => void
}

export interface ProjectDetailProps {
  /** The project to display */
  project: ProjectWithRelations
  /** Current user's ID */
  currentUserId: string
  /** Current user's role for RBAC */
  userRole: UserRole
  /** Called when user edits project info */
  onEdit?: () => void
  /** Called when user logs time */
  onLogTime?: () => void
  /** Called when user adds a task */
  onAddTask?: () => void
  /** Called when user adds a phase */
  onAddPhase?: () => void
  /** Called when user updates a phase */
  onUpdatePhase?: (phase: Phase) => void
  /** Called when user deletes a phase */
  onDeletePhase?: (id: string) => void
  /** Called when user updates a task */
  onUpdateTask?: (task: Task) => void
  /** Called when user deletes a task */
  onDeleteTask?: (id: string) => void
  /** Called when user adds a time entry */
  onAddTimeEntry?: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'userId'>) => void
  /** Called when user navigates to client */
  onNavigateToClient?: () => void
  /** Called when user navigates to source opportunity */
  onNavigateToOpportunity?: () => void
  /** Called when user navigates to an invoice */
  onNavigateToInvoice?: (id: string) => void
}

export interface ProjectTimelineProps {
  /** The project to display */
  project: ProjectWithRelations
  /** Current zoom level */
  zoom: 'day' | 'week' | 'month' | 'quarter'
  /** Called when zoom level changes */
  onZoomChange?: (zoom: 'day' | 'week' | 'month' | 'quarter') => void
  /** Called when phase dates are updated via drag */
  onUpdatePhaseDates?: (phaseId: string, startDate: string, endDate: string) => void
  /** Called when task dates are updated via drag */
  onUpdateTaskDates?: (taskId: string, startDate: string, endDate: string) => void
  /** Called when a phase is selected */
  onSelectPhase?: (id: string) => void
  /** Called when a task is selected */
  onSelectTask?: (id: string) => void
  /** Called when user exports the timeline */
  onExport?: (format: 'png' | 'csv') => void
}

export interface PhaseSlideoverProps {
  /** The phase to display/edit, or null for new phase */
  phase: Phase | null
  /** The project ID */
  projectId: string
  /** Whether the slideover is open */
  isOpen: boolean
  /** Called when slideover is closed */
  onClose: () => void
  /** Called when phase is saved */
  onSave?: (phase: Omit<Phase, 'id'> | Phase) => void
  /** Called when phase is deleted */
  onDelete?: (id: string) => void
}

export interface TaskSlideoverProps {
  /** The task to display/edit, or null for new task */
  task: Task | null
  /** The project ID */
  projectId: string
  /** Available phases for assignment */
  phases: Phase[]
  /** Available stakeholders from client */
  stakeholders: { id: string; name: string; title: string | null }[]
  /** Available users for assignment */
  users: { id: string; name: string; avatarUrl: string | null }[]
  /** Whether the slideover is open */
  isOpen: boolean
  /** Called when slideover is closed */
  onClose: () => void
  /** Called when task is saved */
  onSave?: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'actualHours'> | Task) => void
  /** Called when task is deleted */
  onDelete?: (id: string) => void
}

export interface TimeEntryFormProps {
  /** The project ID */
  projectId: string
  /** Available tasks for selection */
  tasks: Task[]
  /** Default date for the entry */
  defaultDate?: string
  /** Default billable status */
  defaultBillable?: boolean
  /** Called when entry is submitted */
  onSubmit?: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'userId'>) => void
  /** Called when form is cancelled */
  onCancel?: () => void
}

export interface ProjectOnboardingProps {
  /** Available clients for selection */
  clients: { id: string; name: string }[]
  /** Pre-selected opportunity (when creating from won deal) */
  opportunity?: {
    id: string
    name: string
    value: number
    clientId: string
  } | null
  /** Called when wizard completes successfully */
  onComplete?: (data: {
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
    phases?: Omit<Phase, 'id' | 'projectId'>[]
  }) => void
  /** Called when user cancels the wizard */
  onCancel?: () => void
}

// =============================================================================
// View-Specific Types
// =============================================================================

/** Kanban column for project board */
export interface ProjectKanbanColumn {
  status: ProjectStatus
  label: string
  projects: ProjectListItem[]
  count: number
}

/** Gantt timeline bar for rendering */
export interface GanttBar {
  id: string
  type: 'phase' | 'task'
  label: string
  startDate: string
  endDate: string
  progress: number
  color: string
  isMilestone: boolean
  isCritical: boolean
  parentId: string | null
  children?: GanttBar[]
}

/** Time summary for project */
export interface TimeSummary {
  totalHours: number
  billableHours: number
  nonBillableHours: number
  budgetHours: number | null
  budgetRemaining: number | null
  percentUsed: number | null
  byUser: {
    userId: string
    userName: string
    hours: number
  }[]
  byWeek: {
    weekStart: string
    hours: number
  }[]
}

/** Project quick stats for dashboard */
export interface ProjectQuickStats {
  total: number
  active: number
  completed: number
  onHold: number
  overdue: number
  totalBudget: number
  totalHoursLogged: number
}
