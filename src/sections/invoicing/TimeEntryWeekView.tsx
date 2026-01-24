import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Target,
  DollarSign,
} from 'lucide-react'
import data from '@product/sections/invoicing/data.json'

const timeEntries = data.timeEntries
const summary = data.summarySnapshot

const users: Record<string, string> = {
  'user-001': 'Alex Rivera',
  'user-002': 'Jamie Chen',
  'user-003': 'Morgan Smith',
}

const projects: Record<string, { name: string; color: string }> = {
  'proj-001': { name: 'EasyVista ITSM', color: 'bg-sky-500' },
  'proj-002': { name: 'HR Portal', color: 'bg-violet-500' },
  'proj-003': { name: 'Q2 Optimization', color: 'bg-amber-500' },
  'proj-004': { name: 'Mfg Assessment', color: 'bg-lime-500' },
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates(offset: number = 0): Date[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + (offset * 7))

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date
  })
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

export default function TimeEntryWeekView() {
  const [weekOffset, setWeekOffset] = useState(0)
  const weekDates = getWeekDates(weekOffset)

  // Group entries by date
  const entriesByDate: Record<string, typeof timeEntries> = {}
  timeEntries.forEach(entry => {
    if (!entriesByDate[entry.date]) {
      entriesByDate[entry.date] = []
    }
    entriesByDate[entry.date].push(entry)
  })

  // Calculate daily totals
  const dailyTotals = weekDates.map(date => {
    const dateKey = formatDateKey(date)
    const entries = entriesByDate[dateKey] || []
    return entries.reduce((sum, e) => sum + e.hours, 0)
  })

  const weekTotal = dailyTotals.reduce((sum, h) => sum + h, 0)

  const formatWeekRange = () => {
    const start = weekDates[0]
    const end = weekDates[6]
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
    const year = start.getFullYear()

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Week View
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Track time across the week
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Time
        </Button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-medium text-stone-900 dark:text-stone-100 ml-2">
            {formatWeekRange()}
          </span>
          {weekOffset !== 0 && (
            <Button variant="ghost" size="sm" onClick={() => setWeekOffset(0)}>
              Today
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-stone-400" />
            <span className="text-sm text-stone-500">Week Total:</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{weekTotal}h</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-stone-400" />
            <span className="text-sm text-stone-500">Target:</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">40h</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Clock className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Hours This Week</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                    {weekTotal}
                  </p>
                  <span className="text-sm text-stone-500">/ 40h</span>
                </div>
              </div>
            </div>
            <div className="mt-3 h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: `${Math.min((weekTotal / 40) * 100, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-lime-100 p-2 dark:bg-lime-900/30">
                <DollarSign className="h-5 w-5 text-lime-600 dark:text-lime-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Billable %</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {summary.timeEntries.billablePercentage}%
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
                <p className="text-xs text-stone-500 dark:text-stone-400">Week Value</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  ${((weekTotal * 150)).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Grid */}
      <Card className="border-stone-200 dark:border-stone-700">
        <div className="grid grid-cols-7 divide-x divide-stone-200 dark:divide-stone-700">
          {weekDates.map((date, i) => {
            const dateKey = formatDateKey(date)
            const dayEntries = entriesByDate[dateKey] || []
            const isToday = formatDateKey(new Date()) === dateKey
            const isWeekend = i >= 5

            return (
              <div key={dateKey} className={`min-h-[300px] ${isWeekend ? 'bg-stone-50 dark:bg-stone-900/50' : ''}`}>
                {/* Day Header */}
                <div className={`p-3 border-b border-stone-200 dark:border-stone-700 ${isToday ? 'bg-sky-50 dark:bg-sky-900/20' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isToday ? 'text-sky-600' : 'text-stone-500'}`}>
                      {weekDays[i]}
                    </span>
                    <span className={`text-lg font-semibold ${isToday ? 'text-sky-600' : 'text-stone-900 dark:text-stone-100'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-stone-500">
                    {dailyTotals[i] > 0 ? `${dailyTotals[i]}h logged` : 'No entries'}
                  </div>
                </div>

                {/* Entries */}
                <div className="p-2 space-y-2">
                  {dayEntries.map(entry => (
                    <div
                      key={entry.id}
                      className="p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`h-2 w-2 rounded-full ${projects[entry.projectId]?.color || 'bg-stone-300'}`} />
                        <span className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
                          {projects[entry.projectId]?.name}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                        {entry.description}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-[8px]">
                            {users[entry.userId]?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {entry.hours}h
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {dayEntries.length === 0 && !isWeekend && (
                    <Button variant="ghost" size="sm" className="w-full text-xs text-stone-400 hover:text-stone-600">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Project Legend */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-stone-500">Projects:</span>
        {Object.entries(projects).map(([id, project]) => (
          <div key={id} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${project.color}`} />
            <span className="text-stone-700 dark:text-stone-300">{project.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
