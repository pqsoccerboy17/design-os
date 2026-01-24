import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  DollarSign,
  Clock,
  AlertTriangle,
  FileText,
  Send,
  Download,
} from 'lucide-react'
import data from '@product/sections/invoicing/data.json'

const invoices = data.invoices
const summary = data.summarySnapshot

const clientNames: Record<string, string> = {
  'client-001': 'Acme Corporation',
  'client-003': 'Initech Solutions',
  'client-004': 'Stark Manufacturing',
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export default function InvoicesList() {
  const [search, setSearch] = useState('')

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    clientNames[invoice.clientId]?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Invoices
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage client invoices and payments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
                <DollarSign className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">Outstanding</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {formatCurrency(summary.invoices.totalOutstanding)}
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
                <p className="text-xs text-stone-500 dark:text-stone-400">Overdue</p>
                <p className="text-xl font-semibold text-red-600">
                  {formatCurrency(summary.invoices.totalOverdue)}
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
                <p className="text-xs text-stone-500 dark:text-stone-400">Paid This Month</p>
                <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                  {formatCurrency(summary.invoices.paidThisMonth)}
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
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Invoice List */}
      <Card className="border-stone-200 dark:border-stone-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8 font-medium">
                  Invoice <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map(invoice => (
              <TableRow key={invoice.id} className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-stone-400" />
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {invoice.invoiceNumber}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    {clientNames[invoice.clientId] || 'Unknown Client'}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status as 'draft' | 'sent' | 'paid' | 'overdue'} />
                </TableCell>
                <TableCell>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    {formatCurrency(invoice.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    {new Date(invoice.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-sm ${
                    invoice.status === 'overdue' ? 'text-red-600' : 'text-stone-600 dark:text-stone-400'
                  }`}>
                    {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {invoice.status === 'draft' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
