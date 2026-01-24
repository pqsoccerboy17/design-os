import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Search,
  MoreHorizontal,
  Users,
  Shield,
  Clock,
  UserPlus,
  Check,
  AlertTriangle,
} from 'lucide-react'
import data from '@product/sections/admin/data.json'

const users = data.users
const invitations = data.invitations
const stats = data.stats

const roleColors: Record<string, string> = {
  admin: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  consultant: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  viewer: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400',
  client: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export default function UserManagement() {
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            User Management
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage team members and access
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Total Users</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {stats.users.totalUsers}
                </p>
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
                <p className="text-xs text-stone-500 dark:text-stone-400">Active Users</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {stats.users.activeUsers}
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
                <p className="text-xs text-stone-500 dark:text-stone-400">Pending Invites</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {stats.users.pendingInvites}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
                <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">MFA Enabled</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {stats.users.mfaEnabledPercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invitations.map(invite => (
                <div key={invite.id} className="flex items-center justify-between p-3 bg-white dark:bg-stone-900 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 text-xs">
                        {invite.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{invite.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{invite.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={roleColors[invite.role]}>{invite.role}</Badge>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm">Resend</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="border-stone-200 dark:border-stone-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MFA</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Logins (30d)</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-stone-900 dark:text-stone-100">{user.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={roleColors[user.role]}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <Badge variant="outline" className="text-lime-600 border-lime-200 bg-lime-50 dark:bg-lime-900/20 dark:border-lime-800">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.mfaStatus === 'enabled' ? (
                    <div className="flex items-center gap-1 text-lime-600">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Enabled</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-stone-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Disabled</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                      : 'Never'
                    }
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {user.loginCount30Days}
                  </span>
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
