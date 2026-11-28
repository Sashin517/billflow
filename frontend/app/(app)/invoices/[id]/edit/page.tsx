import { notFound } from "next/navigation";
import { apiClient } from "@/lib/api/fetcher";
import { getInvoiceById } from "@/lib/actions/invoice.actions";
import { type ClientOut } from "@/lib/actions/client.actions";
import {
  getBusinessProfile,
  getBusinessTheme,
} from "@/lib/actions/settings.actions";
import InvoiceCreatorClient, {
  type InvoiceClientOption,
} from "@/features/invoices/components/InvoiceCreatorClient";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoiceId = Number(id);

  if (Number.isNaN(invoiceId)) {
    notFound();
  }

  const [invoice, rawClients, profile, theme] = await Promise.all([
    getInvoiceById(invoiceId),
    apiClient.get<ClientOut[]>("/api/clients/").catch(() => []),
    getBusinessProfile().catch(() => null),
    getBusinessTheme().catch(() => null),
  ]);

  if (!invoice) {
    notFound();
  }

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

  const taxes = profile?.taxes ?? [];
  const charges = profile?.charges ?? [];

  return (
    <InvoiceCreatorClient
      initialInvoice={invoice}
      clients={clients}
      taxes={taxes}
      charges={charges}
      profile={profile}
      logoUrl={theme?.logo_path || null}
      themeColor={theme?.letterhead_color || null}
    />
  );
}