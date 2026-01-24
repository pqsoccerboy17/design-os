import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Clock,
  Calendar,
  DollarSign,
  List,
  LayoutGrid,
} from 'lucide-react'
import data from '@product/sections/invoicing/data.json'

const timeEntries = data.timeEntries
const summary = data.summarySnapshot

const users: Record<string, string> = {
  'user-001': 'Alex Rivera',
  'user-002': 'Jamie Chen',
  'user-003': 'Morgan Smith',
}

const projects: Record<string, string> = {
  'proj-001': 'EasyVista ITSM Implementation',
  'proj-002': 'HR Self-Service Portal',
  'proj-003': 'Q2 Optimization Sprint',
  'proj-004': 'Manufacturing Floor Assessment',
}

export default function TimeEntryList() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'grouped'>('list')

  const filteredEntries = timeEntries.filter(entry =>
    entry.description.toLowerCase().includes(search.toLowerCase()) ||
    projects[entry.projectId]?.toLowerCase().includes(search.toLowerCase())
  )

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const date = entry.date
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {} as Record<string, typeof timeEntries>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Time Entries
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Track and manage billable hours
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Time
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Clock className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Hours This Week</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {summary.timeEntries.hoursThisWeek}/{summary.timeEntries.hoursTarget}h
                </p>
              </div>
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
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Uninvoiced Hours</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {summary.timeEntries.uninvoicedHours}h
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
                <p className="text-xs text-stone-500 dark:text-stone-400">Uninvoiced Value</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  ${(summary.timeEntries.uninvoicedValue / 100).toLocaleString()}
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
              placeholder="Search entries..."
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
            variant={view === 'grouped' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('grouped')}
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
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map(entry => (
                <TableRow key={entry.id} className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900">
                  <TableCell>
                    <span className="text-sm text-stone-600 dark:text-stone-400">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                          {users[entry.userId]?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-stone-900 dark:text-stone-100">
                        {users[entry.userId]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-stone-600 dark:text-stone-400">
                      {projects[entry.projectId]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                      {entry.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {entry.hours}h
                    </span>
                  </TableCell>
                  <TableCell>
                    {entry.billable ? (
                      <Badge variant="outline" className="text-lime-600 border-lime-200 bg-lime-50 dark:bg-lime-900/20 dark:border-lime-800">
                        Billable
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-stone-500 border-stone-200 bg-stone-50 dark:bg-stone-800 dark:border-stone-700">
                        Non-billable
                      </Badge>
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
      )}

      {/* Grouped View */}
      {view === 'grouped' && (
        <div className="space-y-4">
          {Object.entries(groupedEntries)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, entries]) => {
              const dayTotal = entries.reduce((sum, e) => sum + e.hours, 0)
              return (
                <Card key={date} className="border-stone-200 dark:border-stone-700">
                  <div className="p-4 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-stone-400" />
                        <span className="font-medium text-stone-900 dark:text-stone-100">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <Badge variant="secondary">{dayTotal}h</Badge>
                    </div>
                  </div>
                  <div className="divide-y divide-stone-200 dark:divide-stone-700">
                    {entries.map(entry => (
                      <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-900">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                              {users[entry.userId]?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                              {entry.description}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {projects[entry.projectId]} • {users[entry.userId]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-stone-900 dark:text-stone-100">{entry.hours}h</span>
                          {entry.billable && (
                            <Badge variant="outline" className="text-lime-600 border-lime-200 bg-lime-50 dark:bg-lime-900/20">
                              Billable
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
        </div>
      )}
    </div>
  )
}
