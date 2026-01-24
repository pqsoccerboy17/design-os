// =============================================================================
// Enums & Types
// =============================================================================

export type MeddpiccRole =
  | 'champion'
  | 'economic_buyer'
  | 'technical_evaluator'
  | 'coach'
  | 'blocker'
  | 'user'

export type DealStage =
  | 'lead'
  | 'qualified'
  | 'discovery'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'

export type ClientStatus = 'prospect' | 'active' | 'churned'

export type EngagementLevel = 'high' | 'medium' | 'low' | 'disengaged'

export type ActivityType = 'call' | 'meeting' | 'email' | 'note' | 'task_completed'

export type Sentiment = 'positive' | 'neutral' | 'negative'

export type OpportunityType = 'new' | 'renewal' | 'expansion'

export type OpportunitySource = 'referral' | 'inbound' | 'outbound' | 'event' | 'partner'

export type CompetitorStatus = 'active' | 'displaced' | 'lost_to'

// =============================================================================
// Data Types
// =============================================================================

export interface MeddpiccFields {
  metrics: string | null
  decisionCriteria: string | null
  decisionProcess: string | null
  paperProcess: string | null
  identifiedPain: string | null
  competition: string | null
}

export interface Client {
  id: string
  name: string
  status: ClientStatus
  deadline: string | null
  budget: number | null
  healthScore: number
  meddpicc: MeddpiccFields
  createdAt: string
  updatedAt: string
}

export interface Stakeholder {
  id: string
  clientId: string
  name: string
  email: string | null
  phone: string | null
  title: string | null
  roleTags: MeddpiccRole[]
  engagementLevel: EngagementLevel
  notes: string | null
  lastContactDate: string | null
}

export interface Opportunity {
  id: string
  clientId: string
  name: string
  type: OpportunityType
  source: OpportunitySource
  stage: DealStage
  value: number
  probability: number
  daysInStage: number
  expectedCloseDate: string | null
  actualCloseDate: string | null
  outcome: 'won' | 'lost' | null
  lossReason: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  type: ActivityType
  subject: string
  description: string | null
  occurredAt: string
  durationMinutes: number | null
  stakeholderIds: string[]
  clientId: string
  opportunityId: string | null
  projectId: string | null
  createdBy: string
  sentiment: Sentiment | null
  createdAt: string
}

export interface Competitor {
  id: string
  name: string
  website: string | null
  strengths: string | null
  weaknesses: string | null
  typicalPricing: string | null
  notes: string | null
}

export interface CompetitorMention {
  competitorId: string
  opportunityId: string
  status: CompetitorStatus
  notes: string | null
  createdAt: string
}

// =============================================================================
// Computed Types
// =============================================================================

/** Client with related data for list view */
export interface ClientListItem extends Client {
  champion: Stakeholder | null
  pipelineValue: number
  lastActivityDate: string | null
}

/** Client with all related data for detail view */
export interface ClientWithRelations extends Client {
  stakeholders: Stakeholder[]
  opportunities: Opportunity[]
  activities: Activity[]
}

/** Opportunity with related data for detail view */
export interface OpportunityWithRelations extends Opportunity {
  client: Client
  stakeholders: Stakeholder[]
  activities: Activity[]
  competitorMentions: (CompetitorMention & { competitor: Competitor })[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface ClientsListProps {
  /** The list of clients to display */
  clients: ClientListItem[]
  /** Current view mode */
  view: 'list' | 'pipeline'
  /** Called when user wants to view a client's details */
  onView?: (id: string) => void
  /** Called when user wants to edit a client */
  onEdit?: (id: string) => void
  /** Called when user wants to archive a client */
  onArchive?: (id: string) => void
  /** Called when user wants to create a new client */
  onCreate?: () => void
  /** Called when view mode changes */
  onViewChange?: (view: 'list' | 'pipeline') => void
}

export interface ClientDetailProps {
  /** The client to display */
  client: ClientWithRelations
  /** Called when user edits client info */
  onEdit?: () => void
  /** Called when user logs an activity */
  onLogActivity?: () => void
  /** Called when user creates a new opportunity */
  onNewOpportunity?: () => void
  /** Called when user adds a stakeholder */
  onAddStakeholder?: () => void
  /** Called when user edits a stakeholder */
  onEditStakeholder?: (id: string) => void
  /** Called when user views an opportunity */
  onViewOpportunity?: (id: string) => void
  /** Called when MEDDPICC field is updated */
  onUpdateMeddpicc?: (field: keyof MeddpiccFields, value: string) => void
}

export interface OpportunityDetailProps {
  /** The opportunity to display */
  opportunity: OpportunityWithRelations
  /** Called when user edits the opportunity */
  onEdit?: () => void
  /** Called when user logs an activity */
  onLogActivity?: () => void
  /** Called when user marks deal as won */
  onMarkWon?: () => void
  /** Called when user marks deal as lost */
  onMarkLost?: (reason: string, competitorId?: string) => void
  /** Called when user changes the deal stage */
  onChangeStage?: (stage: DealStage) => void
  /** Called when user adds a competitor mention */
  onAddCompetitor?: () => void
  /** Called when user navigates back to client */
  onBackToClient?: () => void
}

export interface ClientOnboardingProps {
  /** Called when wizard completes successfully */
  onComplete?: (data: {
    client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'healthScore'>
    stakeholder: Omit<Stakeholder, 'id' | 'clientId' | 'lastContactDate'>
    opportunity?: Omit<Opportunity, 'id' | 'clientId' | 'probability' | 'daysInStage' | 'createdAt' | 'updatedAt'>
  }) => void
  /** Called when user cancels the wizard */
  onCancel?: () => void
}

export interface ActivityLogModalProps {
  /** Pre-selected client (for context) */
  clientId?: string
  /** Pre-selected opportunity (optional) */
  opportunityId?: string
  /** Available stakeholders to select from */
  stakeholders: Stakeholder[]
  /** Called when activity is logged */
  onSubmit?: (activity: Omit<Activity, 'id' | 'createdAt'>) => void
  /** Called when modal is closed */
  onClose?: () => void
}

export interface StakeholderSlideoverProps {
  /** The stakeholder to display/edit */
  stakeholder: Stakeholder
  /** Activities for this stakeholder */
  activities: Activity[]
  /** Called when stakeholder is updated */
  onUpdate?: (stakeholder: Stakeholder) => void
  /** Called when stakeholder is deleted */
  onDelete?: (id: string) => void
  /** Called when slideover is closed */
  onClose?: () => void
}

// =============================================================================
// Pipeline-specific Types
// =============================================================================

export interface PipelineColumn {
  stage: DealStage
  label: string
  probability: number
  opportunities: Opportunity[]
  totalValue: number
}

export interface PipelineViewProps {
  /** Opportunities grouped by stage */
  columns: PipelineColumn[]
  /** Called when opportunity is moved to a new stage */
  onMoveOpportunity?: (opportunityId: string, newStage: DealStage) => void
  /** Called when opportunity card is clicked */
  onViewOpportunity?: (id: string) => void
}
