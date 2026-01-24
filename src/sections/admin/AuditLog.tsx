import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Search,
  Filter,
  Download,
  Clock,
  AlertTriangle,
  Check,
  X,
  LogIn,
  Edit,
  Plus,
  Send,
  Eye,
  UserPlus,
  Activity,
} from 'lucide-react'
import data from '@product/sections/admin/data.json'

const auditLogs = data.auditLogs
const stats = data.stats

const users: Record<string, string> = {
  'user-001': 'Alex Rivera',
  'user-002': 'Jamie Chen',
  'user-003': 'Morgan Smith',
  'user-004': 'Taylor Nguyen',
}

const actionIcons: Record<string, React.ReactNode> = {
  login: <LogIn className="h-4 w-4" />,
  update: <Edit className="h-4 w-4" />,
  create: <Plus className="h-4 w-4" />,
  invite: <UserPlus className="h-4 w-4" />,
  export: <Download className="h-4 w-4" />,
  sent: <Send className="h-4 w-4" />,
  viewed: <Eye className="h-4 w-4" />,
}

const actionColors: Record<string, string> = {
  login: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  update: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  create: 'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400',
  invite: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  export: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AuditLog() {
  const [search, setSearch] = useState('')

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.resourceType.toLowerCase().includes(search.toLowerCase()) ||
    (log.resourceName && log.resourceName.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Audit Log
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Track system activity and changes
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Activity className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Events Today</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {stats.auditLogs.totalToday}
                </p>
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
                <p className="text-xs text-stone-500 dark:text-stone-400">Failed Logins (24h)</p>
                <p className="text-xl font-semibold text-red-600">
                  {stats.auditLogs.failedLogins24h}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Edit className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Changes This Week</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {stats.auditLogs.changesThisWeek}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
                <Download className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Exports (30d)</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {stats.auditLogs.exportCount30d}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search logs..."
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

      {/* Audit Log Table */}
      <Card className="border-stone-200 dark:border-stone-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map(log => (
              <TableRow key={log.id} className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900">
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTimestamp(log.timestamp)}
                  </div>
                </TableCell>
                <TableCell>
                  {log.userId ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                          {users[log.userId]?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-stone-900 dark:text-stone-100">
                        {users[log.userId]}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-stone-400 italic">Anonymous</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${actionColors[log.action] || 'bg-stone-100 text-stone-600'}`}>
                    {actionIcons[log.action]}
                    {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-stone-900 dark:text-stone-100 capitalize">
                      {log.resourceType.replace('_', ' ')}
                    </span>
                    {log.resourceName && (
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        {log.resourceName}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {log.changes ? (
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Changes
                    </Button>
                  ) : log.errorMessage ? (
                    <span className="text-xs text-red-600">{log.errorMessage}</span>
                  ) : (
                    <span className="text-xs text-stone-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {log.success ? (
                    <div className="flex items-center gap-1 text-lime-600">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="h-4 w-4" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                    {log.ipAddress}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
