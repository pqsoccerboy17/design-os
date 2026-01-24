import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { ActivityTimeline } from '@/components/shared/ActivityTimeline'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import {
  TrendingUp,
  Users,
  FolderKanban,
  Clock,
  AlertTriangle,
  Calendar,
  Plus,
  ArrowRight,
  DollarSign,
} from 'lucide-react'
import data from '@product/sections/dashboards/data.json'

const snapshot = data.dashboardSnapshot
const recentActivities = data.recentActivities
const upcomingDeadlines = data.upcomingDeadlines
const chartData = data.chartData

export default function InternalDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Dashboard
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Welcome back. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            This Week
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pipeline Value"
          value={`$${(snapshot.pipeline.totalValue / 1000).toFixed(0)}K`}
          subValue={`$${(snapshot.pipeline.weightedValue / 1000).toFixed(0)}K weighted`}
          icon={DollarSign}
          trend={{ value: snapshot.pipeline.conversionRate * 100, label: 'conversion' }}
        />
        <MetricCard
          title="Active Projects"
          value={snapshot.projects.activeCount.toString()}
          subValue={`${Math.round(snapshot.projects.avgProgress * 100)}% avg progress`}
          icon={FolderKanban}
          trend={{ value: 45, label: 'on track' }}
        />
        <MetricCard
          title="Open Tasks"
          value={(snapshot.tasks.totalCount - snapshot.tasks.byStatus.done).toString()}
          subValue={`${snapshot.tasks.completedThisWeek} completed this week`}
          icon={Clock}
          trend={{ value: snapshot.tasks.overdueCount, label: 'overdue', isNegative: true }}
        />
        <MetricCard
          title="Client Health"
          value={`${snapshot.clientHealth.avgScore}%`}
          subValue={`${snapshot.clientHealth.atRiskCount} at risk`}
          icon={Users}
          trend={{ value: snapshot.clientHealth.criticalCount, label: 'critical', isNegative: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
              Revenue Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.revenueForecast}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200 dark:stroke-stone-700" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-stone-500"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-stone-500"
                    tickFormatter={(value) => `$${value / 1000}K`}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => value !== undefined ? [`$${value.toLocaleString()}`, 'Expected'] : ['', '']}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hours by Project */}
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
              Hours by Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.hoursByProject} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200 dark:stroke-stone-700" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'currentColor' }} />
                  <YAxis
                    dataKey="project"
                    type="category"
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    width={150}
                    className="text-stone-500"
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => value !== undefined ? [`${value}h`, 'Hours'] : ['', '']}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline by Stage */}
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
              Pipeline
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.pipeline.byStage.map((stage) => (
              <div key={stage.stage} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusBadge status={stage.stage as 'lead' | 'qualified' | 'discovery' | 'proposal' | 'negotiation'} />
                  <span className="text-sm text-stone-600 dark:text-stone-400">{stage.count} deals</span>
                </div>
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  ${(stage.value / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
              Upcoming Deadlines
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.slice(0, 5).map((deadline) => (
              <div key={deadline.id} className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                    {deadline.title}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {deadline.clientName}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <PriorityBadge priority={deadline.priority as 'low' | 'medium' | 'high' | 'critical'} showIcon={false} />
                  <span className={`text-xs font-medium ${
                    deadline.daysUntil <= 0 ? 'text-red-600' :
                    deadline.daysUntil <= 3 ? 'text-amber-600' :
                    'text-stone-500'
                  }`}>
                    {deadline.daysUntil <= 0 ? 'Overdue' : `${deadline.daysUntil}d`}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <ActivityTimeline
              activities={recentActivities.slice(0, 5).map(a => ({
                id: a.id,
                type: a.type as 'call' | 'email' | 'meeting' | 'note' | 'task_completed' | 'comment' | 'time_logged' | 'status_change',
                subject: a.subject,
                description: a.description,
                occurredAt: a.occurredAt,
                user: a.user,
                client: a.client,
              }))}
              showUser={true}
              showContext={true}
              maxItems={5}
            />
          </CardContent>
        </Card>
      </div>

      {/* Client Health Overview */}
      <Card className="border-stone-200 dark:border-stone-700">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
            Client Health Overview
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            View All Clients <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            {snapshot.clientHealth.byHealth.map((item) => (
              <div key={item.level} className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  item.level === 'healthy' ? 'bg-lime-100 dark:bg-lime-900/30' :
                  item.level === 'at_risk' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <span className={`text-lg font-semibold ${
                    item.level === 'healthy' ? 'text-lime-700 dark:text-lime-400' :
                    item.level === 'at_risk' ? 'text-amber-700 dark:text-amber-400' :
                    'text-red-700 dark:text-red-400'
                  }`}>
                    {item.count}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100 capitalize">
                    {item.level.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {item.level === 'healthy' ? '70%+' : item.level === 'at_risk' ? '40-69%' : '<40%'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  subValue: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    label: string
    isNegative?: boolean
  }
}

function MetricCard({ title, value, subValue, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="border-stone-200 dark:border-stone-700">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-stone-500 dark:text-stone-400">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100">
              {value}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{subValue}</p>
          </div>
          <div className="rounded-lg bg-stone-100 p-2 dark:bg-stone-800">
            <Icon className="h-5 w-5 text-stone-600 dark:text-stone-400" />
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center gap-1">
            {trend.isNegative && trend.value > 0 ? (
              <AlertTriangle className="h-3 w-3 text-amber-500" />
            ) : (
              <TrendingUp className="h-3 w-3 text-lime-500" />
            )}
            <span className={`text-xs font-medium ${
              trend.isNegative && trend.value > 0 ? 'text-amber-600' : 'text-lime-600'
            }`}>
              {trend.value}{trend.isNegative ? '' : '%'} {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
