import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import {
  ArrowLeft,
  Calendar,
  Flag,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Circle,
  Play,
} from 'lucide-react'
import data from '@product/sections/tasks/data.json'

const task = data.tasks[1] // AD Integration Setup task
const users = data.users
const projects = data.projects
const phases = data.phases

const project = projects.find(p => p.id === task.projectId)
const phase = phases.find(p => p.id === task.phaseId)
const assignee = users.find(u => u.id === task.assignedTo)

const clientNames: Record<string, string> = {
  'client-001': 'Acme Corporation',
  'client-003': 'Initech Solutions',
}

const subtasks = [
  { id: 1, title: 'Install AD connector module', completed: true },
  { id: 2, title: 'Configure LDAP sync settings', completed: true },
  { id: 3, title: 'Map organizational units', completed: false },
  { id: 4, title: 'Test user synchronization', completed: false },
  { id: 5, title: 'Document configuration', completed: false },
]

const activityItems = [
  { id: 1, user: 'Jamie Chen', action: 'logged 6 hours', time: '2h ago' },
  { id: 2, user: 'Jamie Chen', action: 'moved to In Progress', time: '1d ago' },
  { id: 3, user: 'Alex Rivera', action: 'assigned to Jamie Chen', time: '3d ago' },
  { id: 4, user: 'Alex Rivera', action: 'created this task', time: '5d ago' },
]

export default function TaskDetail() {
  const completedSubtasks = subtasks.filter(s => s.completed).length
  const subtaskProgress = (completedSubtasks / subtasks.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                {task.title}
              </h1>
              {task.isMilestone && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  <Flag className="h-3 w-3 mr-1" />
                  Milestone
                </Badge>
              )}
              {task.isCritical && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Critical Path
                </Badge>
              )}
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {project?.name} • {phase?.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {task.description || 'Set up Active Directory integration for user authentication and role synchronization. This includes installing the AD connector, configuring LDAP settings, and mapping organizational units to EasyVista departments.'}
              </p>
            </CardContent>
          </Card>

          {/* Subtasks */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Subtasks</CardTitle>
                <span className="text-sm text-stone-500">{completedSubtasks}/{subtasks.length} completed</span>
              </div>
              <Progress value={subtaskProgress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              {subtasks.map(subtask => (
                <div
                  key={subtask.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    subtask.completed
                      ? 'border-lime-200 bg-lime-50 dark:border-lime-800 dark:bg-lime-900/20'
                      : 'border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {subtask.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-lime-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-stone-300" />
                  )}
                  <span className={`text-sm ${
                    subtask.completed ? 'text-stone-500 line-through' : 'text-stone-900 dark:text-stone-100'
                  }`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-stone-500 mt-2">
                + Add Subtask
              </Button>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Time Tracking</CardTitle>
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start Timer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Logged</p>
                  <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {task.actualHours}h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Estimated</p>
                  <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {task.estimatedHours}h
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Progress</p>
                  <Progress
                    value={task.estimatedHours ? (task.actualHours / task.estimatedHours) * 100 : 0}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                    AR
                  </AvatarFallback>
                </Avatar>
                <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
              </div>
              <div className="flex justify-end">
                <Button size="sm">Post Comment</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Status</span>
                <StatusBadge status={task.status as 'backlog' | 'in_progress' | 'review' | 'done'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Priority</span>
                <PriorityBadge priority={task.priority as 'low' | 'medium' | 'high' | 'critical'} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Effort</span>
                <Badge variant="outline">{task.effort}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Assignee</p>
                {assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                        {assignee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {assignee.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-stone-400">Unassigned</span>
                )}
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Due Date</p>
                <div className="flex items-center gap-2 text-sm text-stone-900 dark:text-stone-100">
                  <Calendar className="h-4 w-4 text-stone-400" />
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'No due date'
                  }
                </div>
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Project</p>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{project?.name}</p>
                <p className="text-xs text-stone-500">{clientNames[project?.clientId || '']}</p>
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Phase</p>
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{phase?.name}</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityItems.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-[10px]">
                        {item.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-stone-700 dark:text-stone-300">
                        <span className="font-medium">{item.user}</span> {item.action}
                      </p>
                      <p className="text-xs text-stone-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Paperclip className="h-8 w-8 mx-auto text-stone-300 mb-2" />
                <p className="text-sm text-stone-500">No attachments</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Add Attachment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
