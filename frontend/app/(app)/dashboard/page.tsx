import { apiClient } from "@/lib/api/fetcher";
import { type InvoiceOut } from "@/lib/actions/invoice.actions";
import { type ClientOut } from "@/lib/actions/client.actions";
import DashboardHeaderAndKpis from "@/features/dashboard/components/DashboardHeaderAndKpis";
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

  const metricInvoices = rawInvoices.map((inv) => ({
    issue_date: inv.issue_date,
    grand_total: inv.grand_total,
    status: inv.status,
  }));

  const formattedDate = new Date().toLocaleDateString("en-US", {
    timeZone: "Asia/Colombo",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeaderAndKpis
        displayName={displayName}
        formattedDate={formattedDate}
        invoices={metricInvoices}
      />

      {/* Recent Invoices Table Section */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <RecentInvoicesTable invoices={recentInvoices} />
      </div>
    </div>
  );
}