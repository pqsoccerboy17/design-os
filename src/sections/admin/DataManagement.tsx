import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Database,
  Download,
  Upload,
  Trash2,
  Archive,
  AlertTriangle,
  Clock,
  HardDrive,
  RefreshCw,
  FileText,
  Building,
  Users,
  Briefcase,
  FileCheck,
} from 'lucide-react'
import data from '@product/sections/admin/data.json'

const deletionRequests = data.dataDeletionRequests
const usage = data.usage
const settings = data.settings

interface DataCategory {
  name: string
  icon: React.ReactNode
  count: number
  size: string
  lastBackup: string
}

const dataCategories: DataCategory[] = [
  { name: 'Clients', icon: <Building className="h-4 w-4" />, count: 4, size: '1.2 GB', lastBackup: '2h ago' },
  { name: 'Projects', icon: <Briefcase className="h-4 w-4" />, count: 5, size: '0.6 GB', lastBackup: '2h ago' },
  { name: 'Users', icon: <Users className="h-4 w-4" />, count: 4, size: '0.1 GB', lastBackup: '2h ago' },
  { name: 'Invoices', icon: <FileText className="h-4 w-4" />, count: 4, size: '0.2 GB', lastBackup: '2h ago' },
  { name: 'Documents', icon: <FileCheck className="h-4 w-4" />, count: 156, size: '0.5 GB', lastBackup: '2h ago' },
]

const storagePercent = Math.round((usage.storageUsedBytes / usage.storageLimitBytes) * 100)
const storageUsedGB = (usage.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1)
const storageLimitGB = (usage.storageLimitBytes / (1024 * 1024 * 1024)).toFixed(0)

export default function DataManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Data Management
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage data storage, backups, and deletion
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Storage Overview */}
      <Card className="border-stone-200 dark:border-stone-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-stone-400" />
            Storage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-stone-900 dark:text-stone-100">{storageUsedGB} GB</p>
                <p className="text-sm text-stone-500">of {storageLimitGB} GB used</p>
              </div>
              <Badge variant={storagePercent > 80 ? 'destructive' : storagePercent > 60 ? 'secondary' : 'outline'}>
                {storagePercent}% used
              </Badge>
            </div>
            <Progress value={storagePercent} className="h-3" />
            <div className="grid grid-cols-5 gap-4 pt-4">
              {dataCategories.map(category => (
                <div key={category.name} className="text-center">
                  <div className="mx-auto w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 mb-2">
                    {category.icon}
                  </div>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{category.name}</p>
                  <p className="text-xs text-stone-500">{category.size}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backups */}
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-stone-400" />
                Backups
              </CardTitle>
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Backup
              </Button>
            </div>
            <CardDescription>Automatic daily backups are enabled</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Last Backup</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataCategories.map(category => (
                  <TableRow key={category.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>{category.count}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-lime-600">
                        <Clock className="h-3.5 w-3.5" />
                        {category.lastBackup}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-stone-400" />
              Data Retention Policies
            </CardTitle>
            <CardDescription>Configure how long data is retained</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-900">
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">Active Client Data</p>
                <p className="text-sm text-stone-500">Clients with ongoing engagement</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {settings.dataRetention.activeClientData}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-900">
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">Churned Client Data</p>
                <p className="text-sm text-stone-500">Clients marked as inactive</p>
              </div>
              <Badge variant="outline">
                {settings.dataRetention.churnedClientData.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-900">
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">Audit Logs</p>
                <p className="text-sm text-stone-500">System activity logs</p>
              </div>
              <Badge variant="outline">
                {settings.dataRetention.auditLogs.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-900">
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">Session Data</p>
                <p className="text-sm text-stone-500">User login sessions</p>
              </div>
              <Badge variant="outline">
                {settings.dataRetention.sessionData.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Deletions */}
      {deletionRequests.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Trash2 className="h-5 w-5" />
              Pending Deletion Requests
            </CardTitle>
            <CardDescription>Data scheduled for permanent deletion</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Soft Deleted</TableHead>
                  <TableHead>Permanent Deletion</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletionRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-stone-400" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">{request.resourceName}</p>
                          <p className="text-xs text-stone-500 capitalize">{request.resourceType}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{request.requestedBy}</TableCell>
                    <TableCell className="text-sm text-stone-600 dark:text-stone-400 max-w-[200px] truncate">
                      {request.reason}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(request.softDeletedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-amber-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">{new Date(request.permanentDeletionAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-stone-500">
                          Restore
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          Delete Now
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Export & Import */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-stone-400" />
              Export Data
            </CardTitle>
            <CardDescription>Download your data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Archive className="h-4 w-4 mr-2" />
              Full Data Archive (ZIP)
            </Button>
          </CardContent>
        </Card>

        <Card className="border-stone-200 dark:border-stone-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-stone-400" />
              Import Data
            </CardTitle>
            <CardDescription>Import data from external sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto text-stone-400 mb-2" />
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-stone-500">Supports CSV, JSON, and ZIP archives</p>
              <Button variant="outline" className="mt-4">
                Browse Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
