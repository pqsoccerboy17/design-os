import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { HealthIndicator } from '@/components/shared/HealthIndicator'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { StakeholderChip } from '@/components/shared/StakeholderChip'
import {
  Plus,
  Search,
  List,
  Kanban,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import type { Client, Stakeholder, Opportunity, MeddpiccRole } from '@product/sections/clients/types'
import data from '@product/sections/clients/data.json'

const clients = data.clients as Client[]
const stakeholders = data.stakeholders as Stakeholder[]
const opportunities = data.opportunities as Opportunity[]

interface EnrichedClient extends Client {
  champion: Stakeholder | null
  pipelineValue: number
  openOpportunities: number
}

// Enrich clients with related data
const enrichedClients: EnrichedClient[] = clients.map(client => {
  const clientStakeholders = stakeholders.filter(s => s.clientId === client.id)
  const champion = clientStakeholders.find(s => s.roleTags.includes('champion')) || null
  const clientOpportunities = opportunities.filter(o => o.clientId === client.id)
  const pipelineValue = clientOpportunities
    .filter(o => !o.outcome)
    .reduce((sum, o) => sum + o.value, 0)
  const openOpportunities = clientOpportunities.filter(o => !o.outcome).length

  return {
    ...client,
    champion,
    pipelineValue,
    openOpportunities,
  }
})

// Calculate summary stats
const totalPipeline = enrichedClients.reduce((sum, c) => sum + c.pipelineValue, 0)
const activeClients = enrichedClients.filter(c => c.status === 'active').length
const atRiskClients = enrichedClients.filter(c => c.healthScore < 50).length
const avgHealthScore = Math.round(
  enrichedClients.reduce((sum, c) => sum + c.healthScore, 0) / enrichedClients.length
)

export default function ClientsList() {
  const [view, setView] = useState<'list' | 'pipeline'>('list')
  const [search, setSearch] = useState('')

  const filteredClients = enrichedClients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Clients
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your client relationships and opportunities
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <Users className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Active Clients</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {activeClients}
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
                <p className="text-xs text-stone-500 dark:text-stone-400">Total Pipeline</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  ${(totalPipeline / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-lime-100 p-2 dark:bg-lime-900/30">
                <TrendingUp className="h-5 w-5 text-lime-600 dark:text-lime-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Avg Health Score</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {avgHealthScore}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">At Risk</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {atRiskClients}
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
              placeholder="Search clients..."
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
            variant={view === 'pipeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('pipeline')}
          >
            <Kanban className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* List View */}
      {view === 'list' && (
        <Card className="border-stone-200 dark:border-stone-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                    Client <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </TableHead>
                <TableHead>Champion</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                    Health <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </TableHead>
                <TableHead>Pipeline</TableHead>
                <TableHead>Opportunities</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map(client => (
                <TableRow key={client.id} className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {client.name}
                      </span>
                      <StatusBadge status={client.status} />
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.champion ? (
                      <StakeholderChip
                        name={client.champion.name}
                        title={client.champion.title}
                        roleTags={client.champion.roleTags as MeddpiccRole[]}
                        size="sm"
                        showRoles={false}
                      />
                    ) : (
                      <span className="text-sm text-stone-400 dark:text-stone-500">No champion</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <HealthIndicator score={client.healthScore} showLabel />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      ${(client.pipelineValue / 1000).toFixed(0)}K
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.openOpportunities} open</Badge>
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

      {/* Pipeline/Kanban View */}
      {view === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['prospect', 'active', 'churned'] as const).map(status => {
            const statusClients = filteredClients.filter(c => c.status === status)
            const statusValue = statusClients.reduce((sum, c) => sum + c.pipelineValue, 0)

            return (
              <Card key={status} className="border-stone-200 dark:border-stone-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={status} />
                      <span className="text-sm text-stone-500 dark:text-stone-400">
                        {statusClients.length}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      ${(statusValue / 1000).toFixed(0)}K
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {statusClients.map(client => (
                    <Card
                      key={client.id}
                      className="border-stone-200 dark:border-stone-700 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-stone-900 dark:text-stone-100">
                            {client.name}
                          </span>
                          <HealthIndicator score={client.healthScore} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-stone-500 dark:text-stone-400">
                            ${(client.pipelineValue / 1000).toFixed(0)}K pipeline
                          </span>
                          <span className="text-stone-500 dark:text-stone-400">
                            {client.openOpportunities} opps
                          </span>
                        </div>
                        {client.champion && (
                          <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                            <StakeholderChip
                              name={client.champion.name}
                              roleTags={client.champion.roleTags as MeddpiccRole[]}
                              size="sm"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {statusClients.length === 0 && (
                    <p className="text-center text-sm text-stone-400 dark:text-stone-500 py-4">
                      No clients
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
