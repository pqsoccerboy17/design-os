import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Flag,
  AlertTriangle,
  Check,
} from 'lucide-react'
import data from '@product/sections/projects/data.json'

const projects = data.projects
const phases = data.phases
const tasks = data.tasks

interface TimelineProject {
  id: string
  name: string
  clientName: string
  startDate: Date
  endDate: Date
  progress: number
  status: string
  phases: {
    id: string
    name: string
    startDate: Date
    endDate: Date
    status: string
  }[]
}

const clientNames: Record<string, string> = {
  'client-001': 'Acme Corporation',
  'client-003': 'Initech Solutions',
  'client-004': 'Stark Manufacturing',
}

// Build timeline data
const timelineProjects: TimelineProject[] = projects.map(project => {
  const projectPhases = phases
    .filter(p => p.projectId === project.id)
    .map(p => ({
      id: p.id,
      name: p.name,
      startDate: new Date(p.startDate),
      endDate: new Date(p.endDate),
      status: p.status,
    }))

  const projectTasks = tasks.filter(t => t.projectId === project.id)
  const completedTasks = projectTasks.filter(t => t.status === 'done').length
  const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0

  return {
    id: project.id,
    name: project.name,
    clientName: clientNames[project.clientId] || 'Unknown',
    startDate: new Date(project.startDate || '2025-01-01'),
    endDate: new Date(project.endDate || '2025-06-30'),
    progress,
    status: project.status,
    phases: projectPhases,
  }
})

// Generate weeks for the timeline
function getWeeks(startDate: Date, numWeeks: number): Date[] {
  const weeks: Date[] = []
  const current = new Date(startDate)
  current.setDate(current.getDate() - current.getDay() + 1) // Start from Monday

  for (let i = 0; i < numWeeks; i++) {
    weeks.push(new Date(current))
    current.setDate(current.getDate() + 7)
  }
  return weeks
}

export default function ProjectTimeline() {
  const [viewOffset, setViewOffset] = useState(0)
  const numWeeks = 12

  const startDate = new Date()
  startDate.setDate(startDate.getDate() + (viewOffset * 7 * 4)) // Move by 4 weeks at a time
  const weeks = getWeeks(startDate, numWeeks)

  const timelineStart = weeks[0]
  const timelineEnd = weeks[weeks.length - 1]
  const totalDays = (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)

  const getBarPosition = (start: Date, end: Date) => {
    const startOffset = Math.max(0, (start.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
    const endOffset = Math.min(totalDays, (end.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24))
    const left = (startOffset / totalDays) * 100
    const width = ((endOffset - startOffset) / totalDays) * 100
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` }
  }

  const todayPosition = () => {
    const today = new Date()
    const offset = (today.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24)
    if (offset < 0 || offset > totalDays) return null
    return `${(offset / totalDays) * 100}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Project Timeline
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Gantt view of all projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewOffset(viewOffset - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setViewOffset(0)}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewOffset(viewOffset + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-8 rounded bg-sky-500" />
          <span className="text-stone-600 dark:text-stone-400">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-8 rounded bg-stone-300 dark:bg-stone-600" />
          <span className="text-stone-600 dark:text-stone-400">Planning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-8 rounded bg-lime-500" />
          <span className="text-stone-600 dark:text-stone-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <span className="text-stone-600 dark:text-stone-400">Milestone</span>
        </div>
      </div>

      {/* Timeline */}
      <Card className="border-stone-200 dark:border-stone-700 overflow-hidden">
        {/* Header */}
        <div className="flex border-b border-stone-200 dark:border-stone-700">
          <div className="w-64 flex-shrink-0 p-4 border-r border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900">
            <span className="font-medium text-stone-900 dark:text-stone-100">Project</span>
          </div>
          <div className="flex-1 relative">
            <div className="flex">
              {weeks.map((week, i) => (
                <div
                  key={i}
                  className="flex-1 p-2 text-center border-r border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900"
                >
                  <span className="text-xs text-stone-500">
                    {week.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Rows */}
        {timelineProjects.map(project => (
          <div key={project.id}>
            {/* Project Row */}
            <div className="flex border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900/50">
              <div className="w-64 flex-shrink-0 p-4 border-r border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                    {project.name}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{project.clientName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={project.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-stone-500">{project.progress}%</span>
                </div>
              </div>
              <div className="flex-1 relative h-20 p-2">
                {/* Today line */}
                {todayPosition() && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                    style={{ left: todayPosition()! }}
                  />
                )}
                {/* Project bar */}
                <div
                  className={`absolute top-4 h-6 rounded-md flex items-center px-2 ${
                    project.status === 'completed' ? 'bg-lime-500' :
                    project.status === 'active' ? 'bg-sky-500' :
                    'bg-stone-300 dark:bg-stone-600'
                  }`}
                  style={getBarPosition(project.startDate, project.endDate)}
                >
                  <span className="text-xs text-white font-medium truncate">
                    {project.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Phase Rows (nested) */}
            {project.phases.map(phase => (
              <div key={phase.id} className="flex border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                <div className="w-64 flex-shrink-0 pl-8 pr-4 py-3 border-r border-stone-200 dark:border-stone-700">
                  <span className="text-sm text-stone-600 dark:text-stone-400">{phase.name}</span>
                </div>
                <div className="flex-1 relative h-12 p-2">
                  <div
                    className={`absolute top-3 h-4 rounded ${
                      phase.status === 'completed' ? 'bg-lime-400' :
                      phase.status === 'active' ? 'bg-sky-400' :
                      'bg-stone-200 dark:bg-stone-700'
                    }`}
                    style={getBarPosition(phase.startDate, phase.endDate)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Active Projects</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {timelineProjects.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Flag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Milestones This Week</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">At Risk</p>
                <p className="text-xl font-semibold text-red-600">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-lime-100 p-2 dark:bg-lime-900/30">
                <Check className="h-5 w-5 text-lime-600 dark:text-lime-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Avg Progress</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {Math.round(timelineProjects.reduce((sum, p) => sum + p.progress, 0) / timelineProjects.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
