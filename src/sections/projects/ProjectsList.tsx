import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  Plus,
  Search,
  List,
  Kanban,
  LayoutGrid,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import data from '@product/sections/projects/data.json'

const projects = data.projects
const tasks = data.tasks
const users = data.users

interface EnrichedProject {
  id: string
  name: string
  description: string | null
  status: string
  budget: number | null
  startDate: string | null
  endDate: string | null
  clientId: string
  clientName: string
  progress: number
  tasksCompleted: number
  tasksTotal: number
  hoursLogged: number
  hoursBudget: number | null
  healthStatus: 'on_track' | 'at_risk' | 'behind'
  daysRemaining: number | null
  teamMembers: typeof users
}

// Enrich projects with computed data
const enrichedProjects: EnrichedProject[] = projects.map(project => {
  const projectTasks = tasks.filter(t => t.projectId === project.id)
  const completedTasks = projectTasks.filter(t => t.status === 'done').length
  const totalTasks = projectTasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const hoursLogged = projectTasks.reduce((sum, t) => sum + t.actualHours, 0)

  const today = new Date()
  const endDate = project.endDate ? new Date(project.endDate) : null
  const daysRemaining = endDate ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null

  // Determine health status
  let healthStatus: 'on_track' | 'at_risk' | 'behind' = 'on_track'
  if (daysRemaining !== null && daysRemaining < 0) {
    healthStatus = 'behind'
  } else if (daysRemaining !== null && daysRemaining < 14 && progress < 80) {
    healthStatus = 'at_risk'
  }

  // Get client name (mock for now)
  const clientNames: Record<string, string> = {
    'client-001': 'Acme Corporation',
    'client-003': 'Initech Solutions',
    'client-004': 'Stark Manufacturing',
  }

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    budget: project.budget,
    startDate: project.startDate,
    endDate: project.endDate,
    clientId: project.clientId,
    clientName: clientNames[project.clientId] || 'Unknown Client',
    progress,
    tasksCompleted: completedTasks,
    tasksTotal: totalTasks,
    hoursLogged,
    hoursBudget: project.budget ? Math.round(project.budget / 150) : null, // Assume $150/hr
    healthStatus,
    daysRemaining,
    teamMembers: users,
  }
})

// Calculate summary stats
const activeProjects = enrichedProjects.filter(p => p.status === 'active').length
const totalBudget = enrichedProjects.reduce((sum, p) => sum + (p.budget || 0), 0)
const avgProgress = Math.round(enrichedProjects.reduce((sum, p) => sum + p.progress, 0) / enrichedProjects.length)
const atRiskProjects = enrichedProjects.filter(p => p.healthStatus !== 'on_track').length

export default function ProjectsList() {
  const [view, setView] = useState<'list' | 'kanban' | 'timeline'>('list')
  const [search, setSearch] = useState('')

  const filteredProjects = enrichedProjects.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.clientName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Projects
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Track active engagements and deliverables
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <LayoutGrid className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Active Projects</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {activeProjects}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
                <DollarSign className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Total Budget</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  ${(totalBudget / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-lime-100 p-2 dark:bg-lime-900/30">
                <CheckCircle2 className="h-5 w-5 text-lime-600 dark:text-lime-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Avg Progress</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {avgProgress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">At Risk</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {atRiskProjects}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Search projects..."
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
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('kanban')}
          >
            <Kanban className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('timeline')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <Card className="border-stone-200 dark:border-stone-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                    Project <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map(project => (
                <TableRow key={project.id} className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-stone-900 dark:text-stone-100">
                          {project.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StatusBadge status={project.status as 'active' | 'planning' | 'completed'} />
                          {project.healthStatus !== 'on_track' && (
                            <span className={`text-xs ${
                              project.healthStatus === 'behind' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {project.healthStatus === 'behind' ? 'Behind' : 'At Risk'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-stone-600 dark:text-stone-400">
                      {project.clientName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 w-32">
                      <Progress value={project.progress} className="h-2 flex-1" />
                      <span className="text-sm text-stone-600 dark:text-stone-400 w-10 text-right">
                        {project.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.budget && (
                      <div className="text-sm">
                        <span className="font-medium text-stone-900 dark:text-stone-100">
                          ${(project.budget / 1000).toFixed(0)}K
                        </span>
                        <span className="text-stone-500 dark:text-stone-400 ml-1">
                          ({project.hoursLogged}h logged)
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {project.teamMembers.slice(0, 3).map(user => (
                        <Avatar key={user.id} className="h-7 w-7 border-2 border-white dark:border-stone-900">
                          <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
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
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['planning', 'active', 'on_hold', 'completed'] as const).map(status => {
            const statusProjects = filteredProjects.filter(p => p.status === status)

            return (
              <Card key={status} className="border-stone-200 dark:border-stone-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={status} />
                    <span className="text-sm text-stone-500 dark:text-stone-400">
                      {statusProjects.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {statusProjects.map(project => (
                    <Card
                      key={project.id}
                      className="border-stone-200 dark:border-stone-700 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                            {project.name}
                          </span>
                          {project.healthStatus !== 'on_track' && (
                            <AlertTriangle className={`h-4 w-4 ${
                              project.healthStatus === 'behind' ? 'text-red-500' : 'text-amber-500'
                            }`} />
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                          {project.clientName}
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-stone-500">{project.progress}%</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                          <div className="flex -space-x-1">
                            {project.teamMembers.slice(0, 2).map(user => (
                              <Avatar key={user.id} className="h-5 w-5 border border-white dark:border-stone-900">
                                <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-[10px]">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-xs text-stone-500">
                            {project.tasksCompleted}/{project.tasksTotal} tasks
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {statusProjects.length === 0 && (
                    <p className="text-center text-sm text-stone-400 dark:text-stone-500 py-4">
                      No projects
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Timeline View Placeholder */}
      {view === 'timeline' && (
        <Card className="border-stone-200 dark:border-stone-700 p-8">
          <div className="text-center text-stone-500 dark:text-stone-400">
            <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Gantt Timeline View</p>
            <p className="text-sm mt-1">Coming soon - visualize project timelines and dependencies</p>
          </div>
        </Card>
      )}
    </div>
  )
}
