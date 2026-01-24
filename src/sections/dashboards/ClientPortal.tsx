import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  Calendar,
} from 'lucide-react'
import data from '@product/sections/dashboards/data.json'

const portalConfig = data.portalConfigurations[0]
const recentActivities = data.recentActivities.filter(a => a.client?.name === 'Acme Corporation')

// Sample project data for portal
const projects = [
  {
    id: 'proj-001',
    name: 'EasyVista ITSM Implementation',
    status: 'active',
    progress: 35,
    phases: [
      { name: 'Discovery', status: 'completed' },
      { name: 'Setup', status: 'active' },
      { name: 'Configuration', status: 'pending' },
      { name: 'Training', status: 'pending' },
      { name: 'Go-Live', status: 'pending' },
    ],
    nextMilestone: 'Setup Phase Complete',
    nextMilestoneDate: '2025-06-15',
  },
  {
    id: 'proj-002',
    name: 'Q2 Optimization Sprint',
    status: 'planning',
    progress: 10,
    phases: [
      { name: 'Assessment', status: 'active' },
      { name: 'Planning', status: 'pending' },
      { name: 'Execution', status: 'pending' },
      { name: 'Review', status: 'pending' },
    ],
    nextMilestone: 'Assessment Complete',
    nextMilestoneDate: '2025-05-30',
  },
]

const tasks = [
  { id: 'task-001', title: 'AD Integration Setup', status: 'in_progress', priority: 'high', dueDate: '2025-05-15', project: 'EasyVista ITSM Implementation' },
  { id: 'task-002', title: 'Performance Audit', status: 'backlog', priority: 'high', dueDate: '2025-05-18', project: 'Q2 Optimization Sprint' },
  { id: 'task-003', title: 'Security Review Documentation', status: 'review', priority: 'medium', dueDate: '2025-05-20', project: 'EasyVista ITSM Implementation' },
]

export default function ClientPortal() {
  // Get accent color from portal config
  const accentColor = portalConfig.accentColor || '#3B82F6'

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Portal Header */}
      <div
        className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900"
        style={{ borderTopColor: accentColor, borderTopWidth: '4px' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                Acme Corporation
              </h1>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Project Status Portal
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-stone-400 dark:text-stone-500">
                Powered by YourCo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <FolderKanban className="h-5 w-5" style={{ color: accentColor }} />
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Active Projects</p>
                  <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-amber-100 dark:bg-amber-900/30">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Open Tasks</p>
                  <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {tasks.filter(t => t.status !== 'done').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg p-2 bg-lime-100 dark:bg-lime-900/30">
                  <CheckCircle2 className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                </div>
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">Overall Progress</p>
                  <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project, index) => (
              <div key={project.id}>
                {index > 0 && <Separator className="mb-6" />}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-stone-900 dark:text-stone-100">
                          {project.name}
                        </h3>
                        <StatusBadge status={project.status as 'active' | 'planning'} />
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Next: {project.nextMilestone}
                        </span>
                        <span>
                          {new Date(project.nextMilestoneDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                        {project.progress}%
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">complete</p>
                    </div>
                  </div>

                  <Progress value={project.progress} className="h-2" />

                  {/* Phase Timeline */}
                  <div className="flex items-center justify-between pt-2">
                    {project.phases.map((phase, phaseIndex) => (
                      <div key={phase.name} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              phase.status === 'completed'
                                ? 'bg-lime-500 text-white'
                                : phase.status === 'active'
                                ? 'text-white'
                                : 'bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-400'
                            }`}
                            style={phase.status === 'active' ? { backgroundColor: accentColor } : undefined}
                          >
                            {phase.status === 'completed' ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              phaseIndex + 1
                            )}
                          </div>
                          <span
                            className={`mt-1 text-[10px] font-medium ${
                              phase.status === 'completed'
                                ? 'text-lime-700 dark:text-lime-400'
                                : phase.status === 'active'
                                ? 'text-stone-900 dark:text-stone-100'
                                : 'text-stone-500 dark:text-stone-400'
                            }`}
                          >
                            {phase.name}
                          </span>
                        </div>
                        {phaseIndex < project.phases.length - 1 && (
                          <div
                            className={`h-0.5 w-12 mx-2 ${
                              phase.status === 'completed'
                                ? 'bg-lime-500'
                                : 'bg-stone-200 dark:bg-stone-700'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
              Current Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-stone-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        task.status === 'in_progress' ? 'bg-sky-500' :
                        task.status === 'review' ? 'bg-violet-500' :
                        'bg-stone-300'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {task.title}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {task.project}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={task.priority as 'low' | 'medium' | 'high'} showIcon={false} />
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <StatusBadge status={task.status as 'backlog' | 'in_progress' | 'review'} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-stone-900 dark:text-stone-100">
              Recent Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity, index) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 ${
                    index < recentActivities.length - 1 ? 'pb-4 border-b border-stone-100 dark:border-stone-800' : ''
                  }`}
                >
                  <div
                    className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'meeting' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      activity.type === 'status_change' ? 'bg-violet-100 dark:bg-violet-900/30' :
                      activity.type === 'email' ? 'bg-sky-100 dark:bg-sky-900/30' :
                      'bg-stone-100 dark:bg-stone-800'
                    }`}
                  >
                    <Calendar
                      className={`h-4 w-4 ${
                        activity.type === 'meeting' ? 'text-amber-600 dark:text-amber-400' :
                        activity.type === 'status_change' ? 'text-violet-600 dark:text-violet-400' :
                        activity.type === 'email' ? 'text-sky-600 dark:text-sky-400' :
                        'text-stone-600 dark:text-stone-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {activity.subject}
                    </p>
                    {activity.description && (
                      <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                    <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                      {new Date(activity.occurredAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-stone-400 dark:text-stone-500">
            Questions? Contact your project manager or{' '}
            <a href="mailto:support@yourco.com" className="underline hover:text-stone-600">
              reach out to support
            </a>
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
