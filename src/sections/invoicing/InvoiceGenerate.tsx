import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, FileText, Plus, Trash2, Building } from "lucide-react";
import data from "@product/sections/invoicing/data.json";

const timeEntries = data.timeEntries.filter(
  (te) => te.invoiceId === null && te.billable,
);
const billingStatus = data.projectBillingStatus;

const projects: Record<string, string> = {
  "proj-001": "EasyVista ITSM Implementation",
  "proj-002": "HR Self-Service Portal",
  "proj-003": "Q2 Optimization Sprint",
  "proj-004": "Manufacturing Floor Assessment",
};

const clients: Record<string, string> = {
  "client-001": "Acme Corporation",
  "client-003": "Initech Solutions",
  "client-004": "Stark Manufacturing",
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function InvoiceGenerate() {
  const [selectedClient] = useState("client-001");
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(
    new Set(),
  );
  const [lineItems] = useState<LineItem[]>([]);

  const clientTimeEntries = timeEntries.filter((te) => {
    const projectStatus = billingStatus.find(
      (bs) => bs.projectId === te.projectId,
    );
    return projectStatus !== undefined;
  });

  const toggleEntry = (id: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEntries(newSelected);
  };

  const selectAll = () => {
    if (selectedEntries.size === clientTimeEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(clientTimeEntries.map((te) => te.id)));
    }
  };

  const selectedTotal = clientTimeEntries
    .filter((te) => selectedEntries.has(te.id))
    .reduce((sum, te) => sum + te.hours * (te.hourlyRate || 15000), 0);

  const selectedHours = clientTimeEntries
    .filter((te) => selectedEntries.has(te.id))
    .reduce((sum, te) => sum + te.hours, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Generate Invoice
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Create a new invoice from time entries
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>Create & Send</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Dates */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Client
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                    <Building className="h-4 w-4 text-stone-400" />
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {clients[selectedClient]}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Invoice Number
                  </label>
                  <Input defaultValue="INV-2025-004" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Issue Date
                  </label>
                  <Input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    defaultValue={
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unbilled Time Entries */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Unbilled Time Entries
                </CardTitle>
                <Button variant="outline" size="sm" onClick={selectAll}>
                  {selectedEntries.size === clientTimeEntries.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientTimeEntries.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className={`cursor-pointer ${selectedEntries.has(entry.id) ? "bg-sky-50 dark:bg-sky-900/20" : ""}`}
                      onClick={() => toggleEntry(entry.id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedEntries.has(entry.id)}
                          onCheckedChange={() => toggleEntry(entry.id)}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-stone-600 dark:text-stone-400">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {projects[entry.projectId]}
                      </TableCell>
                      <TableCell className="text-sm text-stone-900 dark:text-stone-100">
                        {entry.description}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {entry.hours}h
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(
                          entry.hours * (entry.hourlyRate || 15000),
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Additional Line Items */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Additional Line Items
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lineItems.length === 0 ? (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-8">
                  No additional line items. Click "Add Item" to add one.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.rate)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-stone-200 dark:border-stone-700">
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any notes or payment instructions..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card className="border-stone-200 dark:border-stone-700 sticky top-6">
            <CardHeader>
              <CardTitle className="text-base">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Selected Time Entries</span>
                  <span className="font-medium">{selectedEntries.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Total Hours</span>
                  <span className="font-medium">{selectedHours}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Time Entry Total</span>
                  <span className="font-medium">
                    {formatCurrency(selectedTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Additional Items</span>
                  <span className="font-medium">$0</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(selectedTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-stone-500">Tax (0%)</span>
                  <span className="font-medium">$0</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <div className="flex justify-between">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    Total
                  </span>
                  <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    {formatCurrency(selectedTotal)}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  className="w-full"
                  disabled={selectedEntries.size === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
                <Button variant="outline" className="w-full">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
