import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import {
  Plus,
  Search,
  List,
  Kanban,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  Flag,
} from 'lucide-react'
import data from '@product/sections/tasks/data.json'

const tasks = data.tasks
const users = data.users
const projects = data.projects
const phases = data.phases
const clients = data.clients
const stats = data.stats
const boardConfig = data.boardConfig

interface EnrichedTask {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  effort: string
  dueDate: string | null
  estimatedHours: number | null
  actualHours: number
  isMilestone: boolean
  isCritical: boolean
  projectId: string
  projectName: string
  clientName: string
  phaseName: string | null
  assignee: typeof users[0] | null
  isOverdue: boolean
  daysUntilDue: number | null
}

// Enrich tasks with context
const enrichedTasks: EnrichedTask[] = tasks.map(task => {
  const project = projects.find(p => p.id === task.projectId)
  const client = clients.find(c => c.id === project?.clientId)
  const phase = phases.find(p => p.id === task.phaseId)
  const assignee = users.find(u => u.id === task.assignedTo) || null

  const today = new Date()
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const daysUntilDue = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0 && task.status !== 'done'

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    effort: task.effort,
    dueDate: task.dueDate,
    estimatedHours: task.estimatedHours,
    actualHours: task.actualHours,
    isMilestone: task.isMilestone,
    isCritical: task.isCritical,
    projectId: task.projectId,
    projectName: project?.name || 'Unknown Project',
    clientName: client?.name || 'Unknown Client',
    phaseName: phase?.name || null,
    assignee,
    isOverdue,
    daysUntilDue,
  }
})

export default function TasksBoard() {
  const [view, setView] = useState<'board' | 'list'>('board')
  const [search, setSearch] = useState('')

  const filteredTasks = enrichedTasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.projectName.toLowerCase().includes(search.toLowerCase())
  )

  const columns = boardConfig.columns.map(col => ({
    ...col,
    tasks: filteredTasks.filter(t => t.status === col.status),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Tasks
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage tasks across all projects
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-stone-500 dark:text-stone-400">Total:</span>
          <span className="font-medium text-stone-900 dark:text-stone-100">{stats.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-stone-500 dark:text-stone-400">In Progress:</span>
          <span className="font-medium text-sky-600">{stats.byStatus.in_progress}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-stone-500 dark:text-stone-400">Due Soon:</span>
          <span className="font-medium text-amber-600">{stats.dueSoon}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-stone-500 dark:text-stone-400">Critical:</span>
          <span className="font-medium text-red-600">{stats.criticalPath}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-stone-500 dark:text-stone-400">Hours:</span>
          <span className="font-medium text-stone-900 dark:text-stone-100">
            {stats.totalActualHours}/{stats.totalEstimatedHours}h
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
          <Button
            variant={view === 'board' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('board')}
          >
            <Kanban className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map(column => (
            <div key={column.status} className="flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full bg-${column.color}`} />
                  <span className="font-medium text-sm text-stone-900 dark:text-stone-100">
                    {column.label}
                  </span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {column.tasks.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1 space-y-3 min-h-[200px] p-2 bg-stone-50 dark:bg-stone-900/50 rounded-lg">
                {column.tasks.map(task => (
                  <Card
                    key={task.id}
                    className="border-stone-200 dark:border-stone-700 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm text-stone-900 dark:text-stone-100 line-clamp-2">
                          {task.title}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 -mt-1">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                        {task.projectName}
                      </p>

                      <div className="flex items-center gap-2 mb-2">
                        <PriorityBadge priority={task.priority as 'low' | 'medium' | 'high' | 'critical'} showIcon={false} />
                        {task.isMilestone && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0">
                            <Flag className="h-2.5 w-2.5 mr-0.5" />
                            Milestone
                          </Badge>
                        )}
                        {task.isCritical && (
                          <Badge variant="destructive" className="text-[10px] px-1 py-0">
                            Critical
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                        {task.assignee ? (
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-[10px]">
                              {task.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-600" />
                        )}
                        <div className="flex items-center gap-2">
                          {task.dueDate && (
                            <span className={`text-xs flex items-center gap-0.5 ${
                              task.isOverdue ? 'text-red-600' :
                              task.daysUntilDue !== null && task.daysUntilDue <= 3 ? 'text-amber-600' :
                              'text-stone-500'
                            }`}>
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                          {task.estimatedHours && (
                            <span className="text-xs text-stone-500 flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />
                              {task.actualHours}/{task.estimatedHours}h
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {column.tasks.length === 0 && (
                  <div className="flex items-center justify-center h-full text-sm text-stone-400 dark:text-stone-500">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <Card className="border-stone-200 dark:border-stone-700">
          <div className="divide-y divide-stone-200 dark:divide-stone-700">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className="p-4 hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`h-2 w-2 rounded-full ${
                      task.status === 'done' ? 'bg-lime-500' :
                      task.status === 'in_progress' ? 'bg-sky-500' :
                      task.status === 'review' ? 'bg-violet-500' :
                      'bg-stone-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-900 dark:text-stone-100">
                          {task.title}
                        </span>
                        {task.isMilestone && (
                          <Badge variant="outline" className="text-xs">Milestone</Badge>
                        )}
                        {task.isCritical && (
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
                        <span>{task.projectName}</span>
                        <span>•</span>
                        <span>{task.clientName}</span>
                        {task.phaseName && (
                          <>
                            <span>•</span>
                            <span>{task.phaseName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {task.assignee && (
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <PriorityBadge priority={task.priority as 'low' | 'medium' | 'high' | 'critical'} showIcon={false} />
                    {task.dueDate && (
                      <span className={`text-xs flex items-center gap-1 ${
                        task.isOverdue ? 'text-red-600' :
                        task.daysUntilDue !== null && task.daysUntilDue <= 3 ? 'text-amber-600' :
                        'text-stone-500'
                      }`}>
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <StatusBadge status={task.status as 'backlog' | 'in_progress' | 'review' | 'done'} />
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
