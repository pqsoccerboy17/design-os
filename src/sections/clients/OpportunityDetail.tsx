import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { StakeholderChip } from '@/components/shared/StakeholderChip'
import { StageProgressBar, getDealStages } from '@/components/shared/StageProgressBar'
import { ActivityTimeline } from '@/components/shared/ActivityTimeline'
import {
  ArrowLeft,
  Edit,
  Phone,
  Calendar,
  DollarSign,
  Target,
  Users,
  Trophy,
  XCircle,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import type { Opportunity, Client, Stakeholder, Activity, Competitor, CompetitorMention, MeddpiccRole } from '@product/sections/clients/types'
import data from '@product/sections/clients/data.json'

const opportunity = data.opportunities[0] as Opportunity
const client = data.clients.find(c => c.id === opportunity.clientId) as Client
const stakeholders = data.stakeholders.filter(s => s.clientId === opportunity.clientId) as Stakeholder[]
const activities = data.activities.filter(a => a.opportunityId === opportunity.id) as Activity[]
const competitors = data.competitors as Competitor[]
const competitorMentions = data.competitorMentions.filter(m => m.opportunityId === opportunity.id) as CompetitorMention[]

const enrichedMentions = competitorMentions.map(m => ({
  ...m,
  competitor: competitors.find(c => c.id === m.competitorId)!,
}))

export default function OpportunityDetail() {
  const stages = getDealStages(opportunity.stage)
  const weightedValue = (opportunity.value * opportunity.probability) / 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" className="mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                {opportunity.name}
              </h1>
              <Badge variant="outline">{opportunity.type}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1 cursor-pointer hover:text-stone-700 dark:hover:text-stone-300">
                <Users className="h-4 w-4" />
                {client.name}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {opportunity.source}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {opportunity.daysInStage} days in stage
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <XCircle className="h-4 w-4 mr-2" />
            Mark Lost
          </Button>
          <Button size="sm" className="bg-lime-600 hover:bg-lime-700">
            <Trophy className="h-4 w-4 mr-2" />
            Mark Won
          </Button>
        </div>
      </div>

      {/* Stage Progress */}
      <Card className="border-stone-200 dark:border-stone-700">
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-stone-900 dark:text-stone-100">Deal Stage</h2>
            <Button variant="outline" size="sm">
              Change Stage <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <StageProgressBar stages={stages} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deal Info */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Deal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Value</p>
                <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
                  ${(opportunity.value / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Probability</p>
                <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
                  {opportunity.probability}%
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Weighted Value</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
                  ${(weightedValue / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-sm text-stone-500 dark:text-stone-400">Expected Close</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
                  {opportunity.expectedCloseDate
                    ? new Date(opportunity.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Not set'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Competitors */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Competition</CardTitle>
                <Button variant="ghost" size="sm">Add Competitor</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrichedMentions.map(mention => (
                <div key={mention.competitorId} className="p-3 rounded-lg bg-stone-50 dark:bg-stone-900">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {mention.competitor.name}
                      </span>
                      <StatusBadge
                        status={
                          mention.status === 'active' ? 'in_progress' :
                          mention.status === 'displaced' ? 'done' : 'closed_lost'
                        }
                      />
                    </div>
                    {mention.competitor.website && (
                      <a
                        href={mention.competitor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-600 hover:underline"
                      >
                        Website
                      </a>
                    )}
                  </div>
                  {mention.notes && (
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                      {mention.notes}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-500 dark:text-stone-500">Strengths:</span>
                      <p className="text-stone-700 dark:text-stone-300 mt-0.5">
                        {mention.competitor.strengths}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-500">Weaknesses:</span>
                      <p className="text-stone-700 dark:text-stone-300 mt-0.5">
                        {mention.competitor.weaknesses}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {enrichedMentions.length === 0 && (
                <p className="text-center text-sm text-stone-400 dark:text-stone-500 py-4">
                  No competitors tracked for this opportunity
                </p>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Activity Timeline</CardTitle>
                <Button variant="ghost" size="sm">Log Activity</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityTimeline
                activities={activities.map(a => ({
                  id: a.id,
                  type: a.type as 'call' | 'email' | 'meeting' | 'note',
                  subject: a.subject,
                  description: a.description,
                  occurredAt: a.occurredAt,
                }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Stakeholders */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Key Stakeholders</CardTitle>
                <Button variant="ghost" size="sm">Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {stakeholders.slice(0, 4).map(sh => (
                <div
                  key={sh.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer"
                >
                  <StakeholderChip
                    name={sh.name}
                    title={sh.title}
                    roleTags={sh.roleTags as MeddpiccRole[]}
                    size="sm"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Deal Signals */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Deal Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-lime-50 dark:bg-lime-900/20">
                <CheckCircle2 className="h-4 w-4 text-lime-600 dark:text-lime-400" />
                <span className="text-sm text-lime-700 dark:text-lime-400">
                  Champion identified
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-lime-50 dark:bg-lime-900/20">
                <CheckCircle2 className="h-4 w-4 text-lime-600 dark:text-lime-400" />
                <span className="text-sm text-lime-700 dark:text-lime-400">
                  Budget confirmed
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-amber-700 dark:text-amber-400">
                  Strong competitor (ServiceNow)
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-stone-900">
                <Clock className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  Security review in progress
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Update MEDDPICC
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
