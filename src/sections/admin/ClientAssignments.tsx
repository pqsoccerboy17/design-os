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
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Building,
  UserPlus,
  Star,
  User,
} from 'lucide-react'
import data from '@product/sections/admin/data.json'

const users = data.users
const assignments = data.clientAssignments

const clients: Record<string, string> = {
  'client-001': 'Acme Corporation',
  'client-002': 'Globex Industries',
  'client-003': 'Initech Solutions',
  'client-004': 'Stark Manufacturing',
}

// Build user-centric view
interface UserAssignment {
  user: typeof users[0]
  clients: { clientId: string; clientName: string; role: 'lead' | 'member' }[]
}

const userAssignments: UserAssignment[] = users.map(user => {
  const userClients = assignments
    .filter(a => a.userId === user.id)
    .map(a => ({
      clientId: a.clientId,
      clientName: clients[a.clientId] || 'Unknown',
      role: a.role as 'lead' | 'member',
    }))
  return { user, clients: userClients }
})

// Build client-centric view
interface ClientAssignment {
  clientId: string
  clientName: string
  lead: typeof users[0] | null
  members: (typeof users[0])[]
}

const clientAssignments: ClientAssignment[] = Object.entries(clients).map(([clientId, clientName]) => {
  const clientUsers = assignments.filter(a => a.clientId === clientId)
  const leadAssignment = clientUsers.find(a => a.role === 'lead')
  const lead = leadAssignment ? users.find(u => u.id === leadAssignment.userId) || null : null
  const members = clientUsers
    .filter(a => a.role === 'member')
    .map(a => users.find(u => u.id === a.userId))
    .filter((u): u is typeof users[0] => u !== undefined)
  return { clientId, clientName, lead, members }
})

export default function ClientAssignments() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'by-user' | 'by-client'>('by-client')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Client Assignments
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage team member access to clients
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Building className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Total Clients</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {Object.keys(clients).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
                <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Total Assignments</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {assignments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Client Leads</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {assignments.filter(a => a.role === 'lead').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg">
          <Button
            variant={view === 'by-client' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('by-client')}
          >
            <Building className="h-4 w-4 mr-2" />
            By Client
          </Button>
          <Button
            variant={view === 'by-user' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('by-user')}
          >
            <User className="h-4 w-4 mr-2" />
            By User
          </Button>
        </div>
      </div>

      {/* By Client View */}
      {view === 'by-client' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientAssignments.map(client => (
            <Card key={client.clientId} className="border-stone-200 dark:border-stone-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="h-4 w-4 text-stone-400" />
                    {client.clientName}
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Lead */}
                {client.lead && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200 text-xs">
                          {client.lead.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{client.lead.name}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{client.lead.email}</p>
                      </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <Star className="h-3 w-3 mr-1" />
                      Lead
                    </Badge>
                  </div>
                )}

                {/* Members */}
                {client.members.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-900">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{member.name}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Member</Badge>
                  </div>
                ))}

                {!client.lead && client.members.length === 0 && (
                  <p className="text-sm text-stone-400 text-center py-4">No assignments</p>
                )}

                <Button variant="ghost" size="sm" className="w-full text-stone-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* By User View */}
      {view === 'by-user' && (
        <Card className="border-stone-200 dark:border-stone-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Client Assignments</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userAssignments.map(({ user, clients: userClients }) => (
                <TableRow key={user.id}>
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
                    <Badge className={
                      user.role === 'admin' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                      user.role === 'consultant' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' :
                      'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                    }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {userClients.map(client => (
                        <Badge
                          key={client.clientId}
                          variant="outline"
                          className={client.role === 'lead' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' : ''}
                        >
                          {client.role === 'lead' && <Star className="h-3 w-3 mr-1 text-amber-500" />}
                          {client.clientName}
                        </Badge>
                      ))}
                      {userClients.length === 0 && (
                        <span className="text-sm text-stone-400">No assignments</span>
                      )}
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
    </div>
  )
}
