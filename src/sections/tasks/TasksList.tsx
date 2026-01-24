import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PriorityBadge } from '@/components/shared/PriorityBadge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  Clock,
  Flag,
  AlertTriangle,
} from 'lucide-react'
import data from '@product/sections/tasks/data.json'

const tasks = data.tasks
const users = data.users
const projects = data.projects
const stats = data.stats

interface EnrichedTask {
  id: string
  title: string
  status: string
  priority: string
  dueDate: string | null
  estimatedHours: number | null
  actualHours: number
  projectName: string
  assigneeName: string | null
  assigneeInitials: string | null
  isMilestone: boolean
  isCritical: boolean
  isOverdue: boolean
}

const enrichedTasks: EnrichedTask[] = tasks.map(task => {
  const project = projects.find(p => p.id === task.projectId)
  const assignee = users.find(u => u.id === task.assignedTo)
  const today = new Date()
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate && dueDate < today && task.status !== 'done'

  return {
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    estimatedHours: task.estimatedHours,
    actualHours: task.actualHours,
    projectName: project?.name || 'Unknown',
    assigneeName: assignee?.name || null,
    assigneeInitials: assignee ? assignee.name.split(' ').map(n => n[0]).join('') : null,
    isMilestone: task.isMilestone,
    isCritical: task.isCritical,
    isOverdue: Boolean(isOverdue),
  }
})

export default function TasksList() {
  const [search, setSearch] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())

  const filteredTasks = enrichedTasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.projectName.toLowerCase().includes(search.toLowerCase())
  )

  const toggleTask = (id: string) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTasks(newSelected)
  }

  const toggleAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(filteredTasks.map(t => t.id)))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            All Tasks
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            View and manage all tasks
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">Total</p>
            <p className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">In Progress</p>
            <p className="text-2xl font-semibold text-sky-600">{stats.byStatus.in_progress}</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">In Review</p>
            <p className="text-2xl font-semibold text-violet-600">{stats.byStatus.review}</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">Due Soon</p>
            <p className="text-2xl font-semibold text-amber-600">{stats.dueSoon}</p>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <p className="text-xs text-stone-500 dark:text-stone-400">Critical</p>
            <p className="text-2xl font-semibold text-red-600">{stats.criticalPath}</p>
          </CardContent>
        </Card>
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
        {selectedTasks.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500">{selectedTasks.size} selected</span>
            <Button variant="outline" size="sm">Bulk Edit</Button>
          </div>
        )}
      </div>

      {/* Task List */}
      <Card className="border-stone-200 dark:border-stone-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                  Task <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map(task => (
              <TableRow
                key={task.id}
                className={`cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900 ${
                  selectedTasks.has(task.id) ? 'bg-sky-50 dark:bg-sky-900/20' : ''
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.has(task.id)}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {task.title}
                    </span>
                    {task.isMilestone && (
                      <Flag className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    {task.isCritical && (
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    {task.projectName}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={task.status as 'backlog' | 'in_progress' | 'review' | 'done'} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority as 'low' | 'medium' | 'high' | 'critical'} showIcon={false} />
                </TableCell>
                <TableCell>
                  {task.assigneeName ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                          {task.assigneeInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-stone-600 dark:text-stone-400">
                        {task.assigneeName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-stone-400">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <span className={`text-sm flex items-center gap-1 ${
                      task.isOverdue ? 'text-red-600' : 'text-stone-600 dark:text-stone-400'
                    }`}>
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span className="text-sm text-stone-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.estimatedHours ? (
                    <span className="text-sm text-stone-600 dark:text-stone-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {task.actualHours}/{task.estimatedHours}h
                    </span>
                  ) : (
                    <span className="text-sm text-stone-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
