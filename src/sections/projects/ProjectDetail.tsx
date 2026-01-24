import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import { StageProgressBar, getPhaseStages } from '@/components/shared/StageProgressBar'
import { ActivityTimeline } from '@/components/shared/ActivityTimeline'
import {
  ArrowLeft,
  Edit,
  Plus,
  Clock,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  MoreHorizontal,
} from 'lucide-react'
import data from '@product/sections/projects/data.json'

const project = data.projects[0]
const projectPhases = data.phases.filter(p => p.projectId === project.id)
const projectTasks = data.tasks.filter(t => t.projectId === project.id)
const projectTimeEntries = data.timeEntries.filter(t => t.projectId === project.id)
const users = data.users

// Calculate metrics
const completedTasks = projectTasks.filter(t => t.status === 'done').length
const totalTasks = projectTasks.length
const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
const totalHours = projectTimeEntries.reduce((sum, t) => sum + t.hours, 0)
const billableHours = projectTimeEntries.filter(t => t.billable).reduce((sum, t) => sum + t.hours, 0)
const budgetHours = project.budget ? Math.round(project.budget / 150) : null

const phases = getPhaseStages(projectPhases.map(p => ({
  id: p.id,
  name: p.name,
  status: p.status as 'pending' | 'active' | 'completed',
})))

export default function ProjectDetail() {
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
                {project.name}
              </h1>
              <StatusBadge status={project.status as 'active' | 'planning' | 'completed'} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1 cursor-pointer hover:text-stone-700">
                <Users className="h-4 w-4" />
                Acme Corporation
              </span>
              {project.budget && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${(project.budget / 1000).toFixed(0)}K budget
                </span>
              )}
              {project.endDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Log Time
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">Progress</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{progress}%</p>
              <p className="text-sm text-stone-500 mb-0.5">complete</p>
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">Tasks</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                {completedTasks}/{totalTasks}
              </p>
              <p className="text-sm text-stone-500 mb-0.5">done</p>
            </div>
            <div className="flex gap-1 mt-2">
              {projectTasks.slice(0, 10).map(task => (
                <div
                  key={task.id}
                  className={`h-2 w-2 rounded-full ${
                    task.status === 'done' ? 'bg-lime-500' :
                    task.status === 'in_progress' ? 'bg-sky-500' :
                    task.status === 'review' ? 'bg-violet-500' :
                    'bg-stone-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">Hours Logged</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{totalHours}</p>
              {budgetHours && (
                <p className="text-sm text-stone-500 mb-0.5">/ {budgetHours}h budget</p>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-2">{billableHours}h billable</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wide">Team</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex -space-x-2">
                {users.map(user => (
                  <Avatar key={user.id} className="h-8 w-8 border-2 border-white dark:border-stone-900">
                    <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-stone-500">{users.length} members</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-stone-100 dark:bg-stone-800 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Phase Progress */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Phase Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <StageProgressBar stages={phases} variant="phase" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Tasks */}
            <Card className="border-stone-200 dark:border-stone-700">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Upcoming Tasks</CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectTasks
                  .filter(t => t.status !== 'done')
                  .slice(0, 4)
                  .map(task => (
                    <div key={task.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          task.status === 'in_progress' ? 'bg-sky-500' :
                          task.status === 'review' ? 'bg-violet-500' :
                          'bg-stone-300'
                        }`} />
                        <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {task.title}
                        </span>
                      </div>
                      <PriorityBadge priority={task.priority as 'low' | 'medium' | 'high' | 'critical'} showIcon={false} />
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Recent Time Entries */}
            <Card className="border-stone-200 dark:border-stone-700">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Time</CardTitle>
                <Button variant="ghost" size="sm">Log Time</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectTimeEntries.slice(-4).reverse().map(entry => {
                  const user = users.find(u => u.id === entry.userId)
                  return (
                    <div key={entry.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                            {user?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                            {entry.description}
                          </p>
                          <p className="text-xs text-stone-500">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {entry.hours}h
                      </span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Phases Tab */}
        <TabsContent value="phases" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
              Project Phases
            </h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Phase
            </Button>
          </div>

          <div className="space-y-4">
            {projectPhases.map((phase, index) => {
              const phaseTasks = projectTasks.filter(t => t.phaseId === phase.id)
              const completedPhaseTasks = phaseTasks.filter(t => t.status === 'done').length
              const phaseProgress = phaseTasks.length > 0
                ? Math.round((completedPhaseTasks / phaseTasks.length) * 100)
                : 0

              return (
                <Card key={phase.id} className="border-stone-200 dark:border-stone-700">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          phase.status === 'completed' ? 'bg-lime-500 text-white' :
                          phase.status === 'active' ? 'bg-sky-500 text-white' :
                          'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
                        }`}>
                          {phase.status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-stone-900 dark:text-stone-100">
                            {phase.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                            <span>{phaseTasks.length} tasks</span>
                            {phase.startDate && phase.endDate && (
                              <span>
                                {new Date(phase.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {' - '}
                                {new Date(phase.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 w-32">
                          <Progress value={phaseProgress} className="h-2 flex-1" />
                          <span className="text-sm text-stone-500 w-10 text-right">{phaseProgress}%</span>
                        </div>
                        <StatusBadge status={phase.status as 'pending' | 'active' | 'completed'} />
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
              Tasks ({projectTasks.length})
            </h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <Card className="border-stone-200 dark:border-stone-700">
            <div className="divide-y divide-stone-200 dark:divide-stone-700">
              {projectTasks.map(task => {
                const assignee = users.find(u => u.id === task.assignedTo)
                return (
                  <div key={task.id} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          task.status === 'done' ? 'bg-lime-500' :
                          task.status === 'in_progress' ? 'bg-sky-500' :
                          task.status === 'review' ? 'bg-violet-500' :
                          'bg-stone-300'
                        }`} />
                        <div>
                          <span className="font-medium text-stone-900 dark:text-stone-100">
                            {task.title}
                          </span>
                          {task.isMilestone && (
                            <Badge variant="outline" className="ml-2 text-xs">Milestone</Badge>
                          )}
                          {task.isCritical && (
                            <Badge variant="destructive" className="ml-2 text-xs">Critical</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {assignee && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                              {assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <PriorityBadge priority={task.priority as 'low' | 'medium' | 'high' | 'critical'} showIcon={false} />
                        <StatusBadge status={task.status as 'backlog' | 'in_progress' | 'review' | 'done'} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Time Tab */}
        <TabsContent value="time" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
              Time Entries
            </h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Log Time
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-stone-200 dark:border-stone-700">
              <CardContent className="pt-4">
                <p className="text-xs text-stone-500 uppercase">Total Hours</p>
                <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-1">{totalHours}h</p>
              </CardContent>
            </Card>
            <Card className="border-stone-200 dark:border-stone-700">
              <CardContent className="pt-4">
                <p className="text-xs text-stone-500 uppercase">Billable Hours</p>
                <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-1">{billableHours}h</p>
              </CardContent>
            </Card>
            <Card className="border-stone-200 dark:border-stone-700">
              <CardContent className="pt-4">
                <p className="text-xs text-stone-500 uppercase">Budget Remaining</p>
                <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
                  {budgetHours ? `${budgetHours - totalHours}h` : 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-stone-200 dark:border-stone-700">
            <div className="divide-y divide-stone-200 dark:divide-stone-700">
              {projectTimeEntries.slice().reverse().map(entry => {
                const user = users.find(u => u.id === entry.userId)
                const task = projectTasks.find(t => t.id === entry.taskId)
                return (
                  <div key={entry.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                            {user?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                            {entry.description}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                            <span>{user?.name}</span>
                            {task && (
                              <>
                                <span>•</span>
                                <span>{task.title}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {entry.hours}h
                        </p>
                        <p className="text-xs text-stone-500">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline
                activities={[
                  { id: '1', type: 'task_completed' as const, subject: 'Environment Provisioning completed', occurredAt: '2024-05-09T17:00:00Z', user: { name: 'Jamie Chen' } },
                  { id: '2', type: 'time_logged' as const, subject: '8 hours logged', description: 'Provisioned dev and staging environments on Azure.', occurredAt: '2024-05-06T17:00:00Z', user: { name: 'Jamie Chen' } },
                  { id: '3', type: 'meeting' as const, subject: 'Project Kickoff Meeting', occurredAt: '2024-04-05T15:00:00Z', user: { name: 'Alex Rivera' } },
                  { id: '4', type: 'status_change' as const, subject: 'Project moved to Active', occurredAt: '2024-04-01T09:00:00Z', user: { name: 'Alex Rivera' } },
                ]}
                showUser={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
