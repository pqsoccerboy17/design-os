// YourCo Data Model Types

// === Enums ===

export type MeddpiccRole =
  | "champion"
  | "economic_buyer"
  | "technical_evaluator"
  | "coach"
  | "blocker"
  | "user";

export type DealStage =
  | "lead"
  | "qualified"
  | "discovery"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export type UserRole = "admin" | "consultant" | "viewer" | "client";

export type EngagementLevel = "high" | "medium" | "low" | "disengaged";

export type ActivityType =
  | "call"
  | "meeting"
  | "email"
  | "note"
  | "task_completed";

export type ClientStatus = "prospect" | "active" | "churned";

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type PhaseStatus = "pending" | "active" | "completed";

export type TaskStatus = "backlog" | "in_progress" | "review" | "done";

export type TaskEffort = "light" | "medium" | "heavy";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export type OpportunityType = "new" | "renewal" | "expansion";

export type OpportunitySource =
  | "referral"
  | "inbound"
  | "outbound"
  | "event"
  | "partner";

export type CompetitorStatus = "active" | "displaced" | "lost_to";

export type ClientAssignmentRole = "lead" | "member";

export type AuditAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "export";

export type Sentiment = "positive" | "neutral" | "negative";

// === Entities ===

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  deadline?: string;
  budget?: number;
  meddpiccMetrics?: string;
  meddpiccDecisionCriteria?: string;
  meddpiccDecisionProcess?: string;
  meddpiccPaperProcess?: string;
  meddpiccIdentifiedPain?: string;
  meddpiccCompetition?: string;
  healthScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Stakeholder {
  id: string;
  clientId: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  roleTags: MeddpiccRole[];
  engagementLevel: EngagementLevel;
  notes?: string;
  lastContactDate?: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  clientId: string;
  name: string;
  type: OpportunityType;
  source: OpportunitySource;
  stage: DealStage;
  value: number;
  probability: number;
  daysInStage: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  outcome?: "won" | "lost";
  lossReason?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  occurredAt: string;
  durationMinutes?: number;
  stakeholderIds: string[];
  clientId: string;
  opportunityId?: string;
  projectId?: string;
  createdBy: string;
  sentiment?: Sentiment;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  opportunityId?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  budget?: number;
  startDate?: string;
  endDate?: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Phase {
  id: string;
  projectId: string;
  name: string;
  order: number;
  startDate?: string;
  endDate?: string;
  status: PhaseStatus;
}

export interface Task {
  id: string;
  projectId: string;
  phaseId?: string;
  assignedTo?: string;
  title: string;
  description?: string;
  effort: TaskEffort;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  isMilestone: boolean;
  isCritical: boolean;
  stakeholderIds: string[];
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  projectIds: string[];
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  sentDate?: string;
  paidDate?: string;
  recipientStakeholderId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  taskId?: string;
  invoiceId?: string;
  hours: number;
  date: string;
  description?: string;
  billable: boolean;
  createdAt: string;
}

export interface Competitor {
  id: string;
  name: string;
  website?: string;
  strengths?: string;
  weaknesses?: string;
  typicalPricing?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorMention {
  competitorId: string;
  opportunityId: string;
  status: CompetitorStatus;
  notes?: string;
  createdAt: string;
}

export interface ClientAssignment {
  userId: string;
  clientId: string;
  role: ClientAssignmentRole;
  assignedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  sessionId: string;
}

export interface ClientPortalAccess {
  id: string;
  clientId: string;
  accessToken: string;
  expiresAt?: string;
  passwordProtected: boolean;
  passwordHash?: string;
  allowedSections: ("projects" | "tasks" | "timeline" | "status")[];
  createdBy: string;
  createdAt: string;
  lastAccessedAt?: string;
}

// === Computed Types ===

export interface ClientWithRelations extends Client {
  stakeholders?: Stakeholder[];
  opportunities?: Opportunity[];
  projects?: Project[];
  activities?: Activity[];
  assignedUsers?: User[];
}

export interface ProjectWithRelations extends Project {
  client?: Client;
  opportunity?: Opportunity;
  phases?: Phase[];
  tasks?: Task[];
  timeEntries?: TimeEntry[];
}

export interface TaskWithRelations extends Task {
  project?: Project;
  phase?: Phase;
  assignee?: User;
  stakeholders?: Stakeholder[];
}

// === Deal Stage Probabilities ===

export const DEAL_STAGE_PROBABILITIES: Record<DealStage, number> = {
  lead: 10,
  qualified: 25,
  discovery: 40,
  proposal: 60,
  negotiation: 80,
  closed_won: 100,
  closed_lost: 0,
};
