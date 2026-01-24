// Dashboards Section Types
// Internal dashboard metrics and client portal configurations

// =============================================================================
// Tier 1: Enums
// =============================================================================

export type DashboardTimeRange = 'today' | 'this_week' | 'this_month' | 'this_quarter' | 'custom'
export type PortalAuthType = 'link_only' | 'password' | 'sso'
export type PortalSection = 'projects' | 'tasks' | 'timeline' | 'status'

// =============================================================================
// Tier 2: Core Entities
// =============================================================================

export interface PortalConfiguration {
  id: string
  clientId: string
  accessToken: string
  authType: PortalAuthType
  passwordHash: string | null
  expiresAt: string | null
  sections: PortalSection[]
  logoUrl: string | null
  accentColor: string | null
  createdBy: string
  createdAt: string
  lastAccessedAt: string | null
}

// =============================================================================
// Tier 3: Computed/Aggregated Types
// =============================================================================

export interface PipelineMetrics {
  totalValue: number
  weightedValue: number
  byStage: { stage: string; count: number; value: number }[]
  avgDaysInStage: number
  conversionRate: number
}

export interface ProjectMetrics {
  activeCount: number
  completedThisMonth: number
  avgProgress: number
  totalBudget: number
  totalSpent: number
}

export interface TaskMetrics {
  totalCount: number
  overdueCount: number
  completedThisWeek: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
}

export interface ClientHealthMetrics {
  avgScore: number
  atRiskCount: number
  criticalCount: number
  byHealth: { level: string; count: number }[]
}

export interface ActivityWithContext {
  id: string
  type: string
  subject: string
  description: string | null
  occurredAt: string
  user: { id: string; name: string; avatarUrl: string | null }
  client: { id: string; name: string }
  opportunity?: { id: string; name: string }
  project?: { id: string; name: string }
}

export interface DeadlineItem {
  id: string
  type: 'task' | 'phase' | 'project' | 'opportunity'
  title: string
  dueDate: string
  daysUntil: number
  priority: string
  projectName: string
  clientName: string
}

export interface DashboardData {
  pipeline: PipelineMetrics
  projects: ProjectMetrics
  tasks: TaskMetrics
  clientHealth: ClientHealthMetrics
  recentActivities: ActivityWithContext[]
  upcomingDeadlines: DeadlineItem[]
}

// =============================================================================
// Tier 3b: Portal Data Types
// =============================================================================

export interface PortalProjectSummary {
  id: string
  name: string
  status: string
  progress: number
  phases: { name: string; status: string }[]
}

export interface PortalTaskItem {
  id: string
  title: string
  status: string
  dueDate: string | null
  projectName: string
}

export interface PortalData {
  client: { id: string; name: string; logoUrl: string | null }
  projects: PortalProjectSummary[]
  tasks: PortalTaskItem[]
  overallHealth: 'healthy' | 'at_risk' | 'critical'
  lastUpdated: string
}

// =============================================================================
// Tier 4: Component Props
// =============================================================================

export interface InternalDashboardProps {
  data: DashboardData
  timeRange: DashboardTimeRange
  currentUserId: string
  onTimeRangeChange?: (range: DashboardTimeRange) => void
  onQuickAction?: (action: 'log_activity' | 'create_opportunity' | 'add_task') => void
  onActivityClick?: (activityId: string) => void
  onDeadlineClick?: (item: DeadlineItem) => void
}

export interface ClientPortalProps {
  data: PortalData
  config: PortalConfiguration
}

export interface PortalConfigFormProps {
  clientId: string
  existingConfig?: PortalConfiguration
  onSave?: (config: Partial<PortalConfiguration>) => void
  onRevoke?: () => void
  onCancel?: () => void
}

export interface MetricCardProps {
  title: string
  value: string | number
  change?: { value: number; direction: 'up' | 'down' }
  color: 'blue' | 'emerald' | 'amber' | 'rose'
  icon: string
  onClick?: () => void
}

export interface ActivityFeedProps {
  activities: ActivityWithContext[]
  maxItems?: number
  onLoadMore?: () => void
  onActivityClick?: (activityId: string) => void
  filterOptions?: { types: string[] }
}

export interface DeadlineListProps {
  deadlines: DeadlineItem[]
  maxItems?: number
  onDeadlineClick?: (item: DeadlineItem) => void
}

// =============================================================================
// Tier 5: Chart-Specific Types
// =============================================================================

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface TimeSeriesDataPoint {
  date: string
  value: number
  series?: string
}

export interface PipelineChartProps {
  data: PipelineMetrics['byStage']
  onStageClick?: (stage: string) => void
}

export interface TaskCompletionChartProps {
  data: TaskMetrics['byStatus']
  onStatusClick?: (status: string) => void
}

export interface RevenueForecastChartProps {
  data: TimeSeriesDataPoint[]
  dateRange: DashboardTimeRange
}

export interface HoursByProjectChartProps {
  data: { project: string; hours: number; color: string }[]
  groupBy: 'day' | 'week' | 'month'
}
