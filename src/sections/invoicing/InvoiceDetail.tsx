import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Send,
  Download,
  FileText,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  Eye,
  Check,
} from "lucide-react";
import data from "@product/sections/invoicing/data.json";

const invoice = data.invoices[0];
const lineItems = data.lineItems.filter((li) => li.invoiceId === invoice.id);
const activities = data.invoiceActivities.filter(
  (a) => a.invoiceId === invoice.id,
);
const payment = data.payments.find((p) => p.invoiceId === invoice.id);

const clientNames: Record<string, string> = {
  "client-001": "Acme Corporation",
  "client-003": "Initech Solutions",
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const activityIcons: Record<string, React.ReactNode> = {
  created: <FileText className="h-4 w-4" />,
  sent: <Send className="h-4 w-4" />,
  viewed: <Eye className="h-4 w-4" />,
  paid: <DollarSign className="h-4 w-4" />,
  reminder_sent: <Mail className="h-4 w-4" />,
};

export default function InvoiceDetail() {
  const subtotal = lineItems.reduce((sum, li) => sum + li.amount, 0);
  const taxAmount = 0;
  const total = subtotal + taxAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                {invoice.invoiceNumber}
              </h1>
              <StatusBadge
                status={invoice.status as "draft" | "sent" | "paid" | "overdue"}
              />
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {clientNames[invoice.clientId]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          {invoice.status === "draft" && (
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Invoice
            </Button>
          )}
          {invoice.status === "sent" && (
            <Button>
              <DollarSign className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details Card */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader className="border-b border-stone-200 dark:border-stone-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    From
                  </p>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {data.billingSettings.organization.name}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {data.billingSettings.organization.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Bill To
                  </p>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {clientNames[invoice.clientId]}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Invoice Meta */}
              <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-stone-200 dark:border-stone-700">
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Invoice Number
                  </p>
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    {invoice.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Issue Date
                  </p>
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Due Date
                  </p>
                  <p className="font-medium text-stone-900 dark:text-stone-100">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Amount Due
                  </p>
                  <p className="font-semibold text-xl text-stone-900 dark:text-stone-100">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Subtotal</span>
                      <span className="font-medium">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Tax (0%)</span>
                      <span className="font-medium">
                        {formatCurrency(taxAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone-200 dark:border-stone-700">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700">
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-stone-700 dark:text-stone-300">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          {payment && (
            <Card className="border-lime-200 dark:border-lime-800 bg-lime-50 dark:bg-lime-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-lime-800 dark:text-lime-300 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Payment Received
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-lime-700 dark:text-lime-400">
                    Amount
                  </span>
                  <span className="font-medium text-lime-900 dark:text-lime-200">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-lime-700 dark:text-lime-400">Date</span>
                  <span className="font-medium text-lime-900 dark:text-lime-200">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-lime-700 dark:text-lime-400">
                    Method
                  </span>
                  <span className="font-medium text-lime-900 dark:text-lime-200 uppercase">
                    {payment.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-lime-700 dark:text-lime-400">
                    Reference
                  </span>
                  <span className="font-medium text-lime-900 dark:text-lime-200 font-mono text-xs">
                    {payment.reference}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Info */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-stone-100 p-2 dark:bg-stone-800">
                  <Building className="h-4 w-4 text-stone-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Client
                  </p>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {clientNames[invoice.clientId]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-stone-100 p-2 dark:bg-stone-800">
                  <Calendar className="h-4 w-4 text-stone-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Created
                  </p>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-stone-100 p-2 dark:bg-stone-800">
                  <Clock className="h-4 w-4 text-stone-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Payment Terms
                  </p>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    NET 30
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.type === "paid"
                          ? "bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400"
                          : activity.type === "sent"
                            ? "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                            : "bg-stone-100 text-stone-500 dark:bg-stone-800"
                      }`}
                    >
                      {activityIcons[activity.type]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100 capitalize">
                        {activity.type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {new Date(activity.occurredAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
