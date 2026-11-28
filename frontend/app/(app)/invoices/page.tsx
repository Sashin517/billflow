import { Suspense } from "react";
import { apiClient } from "@/lib/api/fetcher";
import { type InvoiceOut } from "@/lib/actions/invoice.actions";
import { type ClientOut } from "@/lib/actions/client.actions";
import {
  getBusinessProfile,
  getBusinessTheme,
} from "@/lib/actions/settings.actions";
import InvoicesTable from "@/features/invoices/components/InvoicesTable";
import { type InvoiceClientOption } from "@/features/invoices/components/InvoiceCreatorClient";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const [rawInvoices, rawClients, profile, theme] = await Promise.all([
    apiClient.get<InvoiceOut[]>("/api/invoices/").catch(() => []),
    apiClient.get<ClientOut[]>("/api/clients/").catch(() => []),
    getBusinessProfile().catch(() => null),
    getBusinessTheme().catch(() => null),
  ]);

  const clients: InvoiceClientOption[] = rawClients.map((client) => ({
    id: client.id,
    company: client.company_name,
    contactName:
      [client.contact_person, client.position].filter(Boolean).join(", ") ||
      "—",
    email: client.email || "—",
    phone: client.contact_number || "—",
    billingAddress:
      [
        client.street_address,
        client.city,
        client.state_province,
        client.postal_code,
        client.country,
      ]
        .filter(Boolean)
        .join(", ") || "—",
    initial: (client.company_name?.[0] || "?").toUpperCase(),
  }));

  return (
    <div className="space-y-6 pb-12">
      <h1 className="text-3xl font-semibold text-foreground tracking-tight">
        Invoice Editor
      </h1>

      <Suspense fallback={null}>
        <InvoicesTable
          invoices={rawInvoices}
          clients={clients}
          profile={profile}
          logoUrl={theme?.logo_path || null}
          themeColor={theme?.letterhead_color || null}
        />
      </Suspense>
    </div>
  );
}