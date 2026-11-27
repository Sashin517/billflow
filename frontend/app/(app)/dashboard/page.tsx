import { apiClient } from "@/lib/api/fetcher";
import { type InvoiceOut } from "@/lib/actions/invoice.actions";
import { type ClientOut } from "@/lib/actions/client.actions";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import KpiCard from "@/features/dashboard/components/KpiCard";
import RecentInvoicesTable from "@/features/dashboard/components/RecentInvoicesTable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [user, rawInvoices, rawClients] = await Promise.all([
    apiClient
      .get<{ full_name?: string; email?: string }>("/api/auth/me")
      .catch(() => null),
    apiClient.get<InvoiceOut[]>("/api/invoices/").catch(() => []),
    apiClient.get<ClientOut[]>("/api/clients/").catch(() => []),
  ]);

  const firstName = user?.full_name?.trim().split(/\s+/)[0];

  const displayName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
    : user?.email || "User";

  const clientMap = new Map(
    rawClients.map((client) => [
      client.id,
      {
        company: client.company_name,
        contactPerson: client.contact_person || "—",
      },
    ])
  );

  const recentInvoices = rawInvoices.map((inv) => {
    const client = clientMap.get(inv.client_id);
    return {
      id: inv.invoice_no,
      company: client?.company || "Unknown Client",
      clientName: client?.contactPerson || "—",
      date: inv.issue_date,
      dueDate: inv.due_date || "—",
      amount: `Rs. ${Number(inv.grand_total).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      status: inv.status,
    };
  });

  const formattedDate = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Colombo",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Welcome, {displayName} !</h1>
          <p className="text-muted-foreground mt-1">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="Today">
            <SelectTrigger className="data-[size=default]:h-11 px-6 bg-transparent border-border rounded-full w-[140px] text-foreground">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="px-4 py-3" value="Today">Today</SelectItem>
              <SelectItem className="px-4 py-3" value="Week-to-date">Week-to-date</SelectItem>
              <SelectItem className="px-4 py-3" value="Month-to-date">Month-to-date</SelectItem>
              <SelectItem className="px-4 py-3" value="Year-to-date">Year-to-date</SelectItem>
              <SelectItem className="px-4 py-3" value="All">All</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/invoices/new">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-11 px-6 rounded-full">
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KpiCard 
          title="Total Revenue"
          subtitle="Total revenue collected"
          amount="Rs. 150,000.00"
          trend="15%"
          trendLabel="vs, last period"
        />
        <KpiCard 
          title="Outstanding Balance"
          subtitle="Total revenue collected"
          amount="Rs. 50,450.50"
          trend="15%"
          trendLabel="vs, last period"
        />
      </div>

      {/* Recent Invoices Table Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
      
        {/* Recent Invoices Table Section */}
        <RecentInvoicesTable invoices={recentInvoices} />
      </div>

    </div>
  );
}