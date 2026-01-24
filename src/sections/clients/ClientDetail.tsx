import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { HealthIndicator } from '@/components/shared/HealthIndicator'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { StakeholderChip } from '@/components/shared/StakeholderChip'
import { StageProgressBar, getDealStages } from '@/components/shared/StageProgressBar'
import { ActivityTimeline } from '@/components/shared/ActivityTimeline'
import {
  ArrowLeft,
  Edit,
  Plus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Target,
  Users,
  FileText,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import type { Client, Stakeholder, Opportunity, Activity, MeddpiccRole } from '@product/sections/clients/types'
import data from '@product/sections/clients/data.json'

const client = data.clients[0] as Client
const stakeholders = data.stakeholders.filter(s => s.clientId === client.id) as Stakeholder[]
const opportunities = data.opportunities.filter(o => o.clientId === client.id) as Opportunity[]
const activities = data.activities.filter(a => a.clientId === client.id) as Activity[]

const meddpiccLabels = {
  metrics: { label: 'Metrics', description: 'Quantifiable business outcomes the customer wants to achieve', icon: BarChart3 },
  decisionCriteria: { label: 'Decision Criteria', description: 'Technical and business requirements for the solution', icon: CheckCircle2 },
  decisionProcess: { label: 'Decision Process', description: 'Steps and timeline to make a buying decision', icon: Target },
  paperProcess: { label: 'Paper Process', description: 'Legal, procurement, and contract requirements', icon: FileText },
  identifiedPain: { label: 'Identified Pain', description: 'Current challenges and their business impact', icon: AlertTriangle },
  competition: { label: 'Competition', description: 'Alternatives being evaluated and our differentiation', icon: Users },
}

export default function ClientDetail() {
  const pipelineValue = opportunities.reduce((sum, o) => sum + o.value, 0)
  const weightedValue = opportunities.reduce((sum, o) => sum + (o.value * o.probability / 100), 0)
  const completedMeddpicc = Object.values(client.meddpicc).filter(v => v !== null).length
  const totalMeddpicc = Object.keys(client.meddpicc).length

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
                {client.name}
              </h1>
              <StatusBadge status={client.status} />
              <HealthIndicator score={client.healthScore} showLabel />
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-stone-500 dark:text-stone-400">
              {client.budget && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${(client.budget / 1000).toFixed(0)}K budget
                </span>
              )}
              {client.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due {new Date(client.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {stakeholders.length} stakeholders
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">Pipeline Value</p>
            <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
              ${(pipelineValue / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              ${(weightedValue / 1000).toFixed(0)}K weighted
            </p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">Active Opportunities</p>
            <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
              {opportunities.filter(o => !o.outcome).length}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {opportunities.filter(o => o.outcome === 'won').length} won
            </p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">MEDDPICC Score</p>
            <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
              {completedMeddpicc}/{totalMeddpicc}
            </p>
            <Progress value={(completedMeddpicc / totalMeddpicc) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">Last Contact</p>
            <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">
              2d ago
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {activities.length} activities logged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="meddpicc" className="space-y-4">
        <TabsList className="bg-stone-100 dark:bg-stone-800 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meddpicc" className="relative">
            MEDDPICC
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
              {completedMeddpicc}/{totalMeddpicc}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-stone-200 dark:border-stone-700">
              <CardHeader>
                <CardTitle className="text-base">Key Stakeholders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stakeholders.slice(0, 4).map(sh => (
                  <StakeholderChip
                    key={sh.id}
                    name={sh.name}
                    title={sh.title}
                    roleTags={sh.roleTags as MeddpiccRole[]}
                  />
                ))}
              </CardContent>
            </Card>
            <Card className="border-stone-200 dark:border-stone-700">
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimeline
                  activities={activities.slice(0, 4).map(a => ({
                    id: a.id,
                    type: a.type as 'call' | 'email' | 'meeting' | 'note',
                    subject: a.subject,
                    description: a.description,
                    occurredAt: a.occurredAt,
                  }))}
                  maxItems={4}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* MEDDPICC Tab - Key Differentiator */}
        <TabsContent value="meddpicc" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">MEDDPICC Qualification</h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Track deal qualification criteria to improve win rates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500 dark:text-stone-400">
                {Math.round((completedMeddpicc / totalMeddpicc) * 100)}% complete
              </span>
              <Progress value={(completedMeddpicc / totalMeddpicc) * 100} className="w-24 h-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(meddpiccLabels) as [keyof typeof meddpiccLabels, typeof meddpiccLabels.metrics][]).map(([key, config]) => {
              const value = client.meddpicc[key as keyof typeof client.meddpicc]
              const Icon = config.icon
              const isComplete = value !== null

              return (
                <Card
                  key={key}
                  className={`border-stone-200 dark:border-stone-700 ${
                    isComplete ? 'bg-white dark:bg-stone-900' : 'bg-stone-50 dark:bg-stone-900/50'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`rounded-lg p-1.5 ${
                          isComplete
                            ? 'bg-lime-100 dark:bg-lime-900/30'
                            : 'bg-stone-200 dark:bg-stone-700'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            isComplete
                              ? 'text-lime-600 dark:text-lime-400'
                              : 'text-stone-500 dark:text-stone-400'
                          }`} />
                        </div>
                        <CardTitle className="text-sm font-medium">{config.label}</CardTitle>
                      </div>
                      {isComplete && (
                        <CheckCircle2 className="h-4 w-4 text-lime-500" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {config.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {isComplete ? (
                      <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line">
                        {value}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <Textarea
                          placeholder={`Add ${config.label.toLowerCase()}...`}
                          className="min-h-[80px] text-sm"
                        />
                        <Button size="sm" variant="outline" className="w-full">
                          <Plus className="h-3 w-3 mr-1" />
                          Add {config.label}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Stakeholders Tab */}
        <TabsContent value="stakeholders" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
              Stakeholders ({stakeholders.length})
            </h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Stakeholder
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stakeholders.map(sh => (
              <Card key={sh.id} className="border-stone-200 dark:border-stone-700">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <StakeholderChip
                      name={sh.name}
                      title={sh.title}
                      roleTags={sh.roleTags as MeddpiccRole[]}
                    />
                    <StatusBadge status={sh.engagementLevel === 'high' ? 'active' : sh.engagementLevel === 'disengaged' ? 'churned' : 'prospect'} />
                  </div>
                  {sh.notes && (
                    <p className="mt-3 text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                      {sh.notes}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    {sh.email && (
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        Email
                      </Button>
                    )}
                    {sh.phone && (
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Call
                      </Button>
                    )}
                    {sh.lastContactDate && (
                      <span className="text-xs text-stone-500 dark:text-stone-400 ml-auto">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(sh.lastContactDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
              Opportunities ({opportunities.length})
            </h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Opportunity
            </Button>
          </div>

          <div className="space-y-3">
            {opportunities.map(opp => (
              <Card key={opp.id} className="border-stone-200 dark:border-stone-700">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-stone-900 dark:text-stone-100">{opp.name}</h3>
                        <Badge variant="outline" className="text-xs">{opp.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-stone-500 dark:text-stone-400">
                        <span>${(opp.value / 1000).toFixed(0)}K</span>
                        <span>{opp.probability}% probability</span>
                        {opp.expectedCloseDate && (
                          <span>Close: {new Date(opp.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>
                    </div>
                    <StageProgressBar stages={getDealStages(opp.stage)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
              Activity Timeline
            </h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Log Activity
            </Button>
          </div>

          <Card className="border-stone-200 dark:border-stone-700">
            <CardContent className="pt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
