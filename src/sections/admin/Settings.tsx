import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Building,
  Shield,
  Mail,
  Database,
  Globe,
  Save,
  Link,
  Check,
} from 'lucide-react'
import data from '@product/sections/admin/data.json'

const settings = data.settings
const integrations = data.integrations
const usage = data.usage

export default function Settings() {
  const storagePercent = Math.round((usage.storageUsedBytes / usage.storageLimitBytes) * 100)
  const apiPercent = Math.round((usage.apiCallsThisPeriod / usage.apiCallsLimit) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Settings
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Configure organization preferences
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Settings */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-stone-400" />
                Organization
              </CardTitle>
              <CardDescription>Basic organization information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Organization Name
                  </label>
                  <Input defaultValue={settings.organization.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Timezone
                  </label>
                  <Input defaultValue={settings.organization.timezone} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Default Currency
                  </label>
                  <Input defaultValue={settings.organization.currency} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Date Format
                  </label>
                  <Input defaultValue={settings.organization.dateFormat} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Default Hourly Rate (cents)
                  </label>
                  <Input type="number" defaultValue={settings.organization.defaultHourlyRate} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Time Entry Rounding (min)
                  </label>
                  <Input type="number" defaultValue={settings.organization.timeEntryRounding} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-stone-400" />
                Security
              </CardTitle>
              <CardDescription>Authentication and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">Require MFA for Admins</p>
                  <p className="text-sm text-stone-500">Enforce two-factor authentication for admin users</p>
                </div>
                <Switch defaultChecked={settings.security.mfaRequiredForAdmins} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">Require MFA for All Users</p>
                  <p className="text-sm text-stone-500">Enforce two-factor authentication for everyone</p>
                </div>
                <Switch defaultChecked={settings.security.mfaRequiredForAll} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Session Timeout (hours)
                  </label>
                  <Input type="number" defaultValue={settings.security.sessionTimeoutHours} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Max Sessions Per User
                  </label>
                  <Input type="number" defaultValue={settings.security.maxSessionsPerUser} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Password Min Length
                  </label>
                  <Input type="number" defaultValue={settings.security.passwordMinLength} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Audit Log Retention (days)
                  </label>
                  <Input type="number" defaultValue={settings.security.auditLogRetentionDays} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-stone-400" />
                Email
              </CardTitle>
              <CardDescription>Notification and email settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Send Invoices From
                  </label>
                  <Input defaultValue={settings.email.sendInvoicesFrom} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Reply-To Address
                  </label>
                  <Input defaultValue={settings.email.replyToAddress} />
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">CC Admin on New Invoices</p>
                  <p className="text-sm text-stone-500">Send copy to admin when invoices are created</p>
                </div>
                <Switch defaultChecked={settings.email.ccAdminOnNewInvoices} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100">CC Admin on Overdue Reminders</p>
                  <p className="text-sm text-stone-500">Notify admin when payment reminders are sent</p>
                </div>
                <Switch defaultChecked={settings.email.ccAdminOnOverdueReminders} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-500">Storage</span>
                  <span className="font-medium">{storagePercent}%</span>
                </div>
                <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {(usage.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1)} GB of {(usage.storageLimitBytes / (1024 * 1024 * 1024)).toFixed(0)} GB
                </p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-500">API Calls</span>
                  <span className="font-medium">{apiPercent}%</span>
                </div>
                <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${apiPercent}%` }}
                  />
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {usage.apiCallsThisPeriod.toLocaleString()} of {usage.apiCallsLimit.toLocaleString()} this period
                </p>
              </div>
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Portal Views</span>
                  <span className="font-medium">{usage.portalViewsThisPeriod}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Link className="h-4 w-4" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {integrations.map(integration => (
                <div key={integration.id} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      integration.status === 'connected' ? 'bg-lime-100 dark:bg-lime-900/30' : 'bg-stone-100 dark:bg-stone-800'
                    }`}>
                      <Globe className={`h-4 w-4 ${
                        integration.status === 'connected' ? 'text-lime-600' : 'text-stone-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{integration.name}</p>
                      <p className="text-xs text-stone-500">
                        {integration.status === 'connected' && integration.lastSyncAt
                          ? `Synced ${new Date(integration.lastSyncAt).toLocaleDateString()}`
                          : 'Not connected'
                        }
                      </p>
                    </div>
                  </div>
                  {integration.status === 'connected' ? (
                    <Badge variant="outline" className="text-lime-600 border-lime-200 bg-lime-50 dark:bg-lime-900/20">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">Connect</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Active Client Data</span>
                <span className="font-medium capitalize">{settings.dataRetention.activeClientData.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Churned Client Data</span>
                <span className="font-medium">{settings.dataRetention.churnedClientData.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Audit Logs</span>
                <span className="font-medium">{settings.dataRetention.auditLogs.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Session Data</span>
                <span className="font-medium">{settings.dataRetention.sessionData.replace('_', ' ')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
