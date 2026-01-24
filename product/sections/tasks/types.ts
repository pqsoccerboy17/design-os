// =============================================================================
// Enums & Types
// =============================================================================

// Note: Core task enums (TaskStatus, TaskPriority, TaskEffort) are defined in
// product/sections/projects/types.ts. We re-export and extend them here for
// the Tasks section which provides cross-project task views.

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export type TaskEffort = 'light' | 'medium' | 'heavy'

export type TaskActivityType =
  | 'status_change'
  | 'assignment_change'
  | 'time_logged'
  | 'comment'
  | 'stakeholder_added'
  | 'stakeholder_removed'
  | 'priority_change'
  | 'due_date_change'

export type StakeholderRole =
  | 'champion'
  | 'economic_buyer'
  | 'technical_evaluator'
  | 'coach'
  | 'blocker'
  | 'user'

export type TaskView = 'board' | 'list'

// =============================================================================
// Core Data Types
// =============================================================================

/** Base task entity (matches projects/types.ts Task) */
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

/** Comment on a task */
export interface TaskComment {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
}

/** Activity/audit entry for a task */
export interface TaskActivity {
  id: string
  taskId: string
  type: TaskActivityType
  subject: string
  description: string | null
  previousValue: string | null
  newValue: string | null
  userId: string
  createdAt: string
}

/** Time entry for a task (matches projects/types.ts TimeEntry) */
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

/** User (simplified for task views) */
export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
}

/** Stakeholder with role tags */
export interface Stakeholder {
  id: string
  clientId: string
  name: string
  email: string | null
  phone: string | null
  title: string | null
  roleTags: StakeholderRole[]
  engagementLevel: 'high' | 'medium' | 'low' | 'disengaged'
}

// =============================================================================
// Computed/Enriched Types
// =============================================================================

/** Task with full context for display */
export interface TaskWithContext extends Task {
  project: {
    id: string
    name: string
    clientId: string
    clientName: string
  }
  phase: {
    id: string
    name: string
  } | null
  assignee: {
    id: string
    name: string
    avatarUrl: string | null
  } | null
  stakeholders: {
    id: string
    name: string
    title: string | null
    roleTags: StakeholderRole[]
  }[]
  isOverdue: boolean
  daysUntilDue: number | null
}

/** Task list item for table views */
export interface TaskListItem extends TaskWithContext {
  hoursDisplay: string // "4h / 2.5h" format
  timeEntriesCount: number
  commentsCount: number
  lastActivityDate: string | null
}

/** Full task detail with all related data */
export interface TaskWithRelations extends TaskWithContext {
  comments: TaskCommentWithUser[]
  timeEntries: TimeEntryWithUser[]
  activities: TaskActivityWithUser[]
  client: {
    id: string
    name: string
  }
  availableStakeholders: {
    id: string
    name: string
    title: string | null
    roleTags: StakeholderRole[]
  }[]
}

/** Comment with user info */
export interface TaskCommentWithUser extends TaskComment {
  user: {
    id: string
    name: string
    avatarUrl: string | null
  }
  isEditable: boolean // current user can edit
}

/** Activity with user info */
export interface TaskActivityWithUser extends TaskActivity {
  user: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

/** Time entry with user and task info */
export interface TimeEntryWithUser extends TimeEntry {
  user: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

// =============================================================================
// Board/Kanban Types
// =============================================================================

/** Kanban column definition */
export interface TaskBoardColumn {
  status: TaskStatus
  label: string
  color: string
  icon: string
  tasks: TaskWithContext[]
  count: number
}

/** Board configuration */
export interface TaskBoardConfig {
  columns: TaskBoardColumn[]
  totalTasks: number
  filteredTasks: number
}

// =============================================================================
// Filter Types
// =============================================================================

/** Filter state for task views */
export interface TaskFilters {
  projectIds: string[]
  assignedToIds: string[]
  priorities: TaskPriority[]
  statuses: TaskStatus[]
  phaseIds: string[]
  stakeholderRoles: StakeholderRole[]
  efforts: TaskEffort[]
  dueDateRange: 'overdue' | 'today' | 'this_week' | 'this_month' | 'no_date' | null
  isMilestone: boolean | null
  isCritical: boolean | null
  searchQuery: string
}

/** Filter option for dropdowns */
export interface FilterOption {
  value: string
  label: string
  count?: number
  icon?: string
  color?: string
}

/** Available filters with options */
export interface TaskFilterOptions {
  projects: FilterOption[]
  assignees: FilterOption[]
  phases: {
    projectId: string
    projectName: string
    phases: FilterOption[]
  }[]
  stakeholderRoles: FilterOption[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface TasksBoardProps {
  /** Initial tasks to display */
  tasks: TaskWithContext[]
  /** Current filter state */
  filters: TaskFilters
  /** Filter options for dropdowns */
  filterOptions: TaskFilterOptions
  /** Current user ID for edit permissions */
  currentUserId: string
  /** Called when view is toggled */
  onViewChange?: (view: TaskView) => void
  /** Called when filters change */
  onFilterChange?: (filters: TaskFilters) => void
  /** Called when task status changes (drag-drop) */
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  /** Called when task is clicked */
  onTaskClick?: (taskId: string) => void
  /** Called when navigating to project */
  onNavigateToProject?: (projectId: string) => void
}

export interface TasksListProps {
  /** Tasks to display */
  tasks: TaskListItem[]
  /** Current filter state */
  filters: TaskFilters
  /** Filter options for dropdowns */
  filterOptions: TaskFilterOptions
  /** Current user ID for edit permissions */
  currentUserId: string
  /** Currently selected task IDs */
  selectedIds: string[]
  /** Sort column and direction */
  sort: {
    column: string
    direction: 'asc' | 'desc'
  }
  /** Called when view is toggled */
  onViewChange?: (view: TaskView) => void
  /** Called when filters change */
  onFilterChange?: (filters: TaskFilters) => void
  /** Called when sort changes */
  onSortChange?: (column: string, direction: 'asc' | 'desc') => void
  /** Called when selection changes */
  onSelectionChange?: (ids: string[]) => void
  /** Called when task is clicked */
  onTaskClick?: (taskId: string) => void
  /** Called for bulk status change */
  onBulkStatusChange?: (ids: string[], status: TaskStatus) => void
  /** Called for bulk priority change */
  onBulkPriorityChange?: (ids: string[], priority: TaskPriority) => void
  /** Called for bulk assignee change */
  onBulkAssigneeChange?: (ids: string[], userId: string) => void
  /** Called for bulk delete */
  onBulkDelete?: (ids: string[]) => void
  /** Called when navigating to project */
  onNavigateToProject?: (projectId: string) => void
}

export interface TaskDetailProps {
  /** The task to display */
  task: TaskWithRelations
  /** Current user ID for edit/delete permissions */
  currentUserId: string
  /** Called when task is edited */
  onEdit?: (task: Partial<Task>) => void
  /** Called when task is deleted */
  onDelete?: () => void
  /** Called when status changes */
  onStatusChange?: (status: TaskStatus) => void
  /** Called when priority changes */
  onPriorityChange?: (priority: TaskPriority) => void
  /** Called when assignee changes */
  onAssigneeChange?: (userId: string | null) => void
  /** Called when stakeholder is added */
  onAddStakeholder?: (stakeholderId: string) => void
  /** Called when stakeholder is removed */
  onRemoveStakeholder?: (stakeholderId: string) => void
  /** Called when time is logged */
  onLogTime?: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'userId'>) => void
  /** Called when comment is added */
  onAddComment?: (content: string) => void
  /** Called when comment is edited */
  onEditComment?: (commentId: string, content: string) => void
  /** Called when comment is deleted */
  onDeleteComment?: (commentId: string) => void
  /** Called when navigating to project */
  onNavigateToProject?: () => void
  /** Called when navigating to client */
  onNavigateToClient?: () => void
  /** Called when navigating back */
  onBack?: () => void
}

export interface TaskCardProps {
  /** The task to display */
  task: TaskWithContext
  /** Whether the card is being dragged */
  isDragging?: boolean
  /** Whether the card is a drop target */
  isDropTarget?: boolean
  /** Called when card is clicked */
  onClick?: () => void
  /** Called when drag starts */
  onDragStart?: () => void
  /** Called when drag ends */
  onDragEnd?: () => void
}

export interface TaskRowProps {
  /** The task to display */
  task: TaskListItem
  /** Whether the row is selected */
  isSelected: boolean
  /** Called when row is clicked */
  onClick?: () => void
  /** Called when selection changes */
  onSelect?: (selected: boolean) => void
  /** Called when quick action is triggered */
  onQuickAction?: (action: 'edit' | 'log_time' | 'delete') => void
}

export interface TimeEntryFormProps {
  /** The task to log time for */
  taskId: string
  /** The project ID */
  projectId: string
  /** Default date */
  defaultDate?: string
  /** Default billable status */
  defaultBillable?: boolean
  /** Called when entry is submitted */
  onSubmit?: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'userId'>) => void
  /** Called when form is cancelled */
  onCancel?: () => void
}

export interface CommentFormProps {
  /** Placeholder text */
  placeholder?: string
  /** Called when comment is submitted */
  onSubmit?: (content: string) => void
  /** Whether submitting is in progress */
  isSubmitting?: boolean
}

export interface StakeholderPickerProps {
  /** Available stakeholders to choose from */
  stakeholders: {
    id: string
    name: string
    title: string | null
    roleTags: StakeholderRole[]
  }[]
  /** Currently selected stakeholder IDs */
  selectedIds: string[]
  /** Called when selection changes */
  onChange?: (ids: string[]) => void
  /** Whether multiple selection is allowed */
  multiple?: boolean
  /** Called when closed */
  onClose?: () => void
}

// =============================================================================
// View-Specific Types
// =============================================================================

/** Summary statistics for task views */
export interface TaskStats {
  total: number
  byStatus: Record<TaskStatus, number>
  byPriority: Record<TaskPriority, number>
  overdue: number
  dueSoon: number // due within 7 days
  unassigned: number
  milestones: number
  criticalPath: number
  totalEstimatedHours: number
  totalActualHours: number
}

/** My tasks summary for dashboard */
export interface MyTasksSummary {
  inProgress: number
  dueToday: number
  overdue: number
  completedThisWeek: number
  upcomingMilestones: TaskWithContext[]
}

/** Task search result */
export interface TaskSearchResult {
  task: TaskWithContext
  matchedField: 'title' | 'description' | 'project' | 'assignee' | 'stakeholder'
  matchedText: string
}

/** Drag-and-drop state */
export interface DragState {
  isDragging: boolean
  draggedTaskId: string | null
  sourceStatus: TaskStatus | null
  targetStatus: TaskStatus | null
}

/** Bulk action state */
export interface BulkActionState {
  selectedIds: string[]
  isActionMenuOpen: boolean
  pendingAction: 'status' | 'priority' | 'assignee' | 'delete' | null
}
