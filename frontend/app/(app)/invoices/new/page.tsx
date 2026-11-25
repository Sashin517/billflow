import { apiClient } from "@/lib/api/fetcher";
import { type ClientOut } from "@/lib/actions/client.actions";
import {
  getBusinessProfile,
  getBusinessTheme,
} from "@/lib/actions/settings.actions";
import InvoiceCreatorClient from "@/features/invoices/components/InvoiceCreatorClient";

export const dynamic = "force-dynamic";

export default async function InvoiceCreatorPage() {
  const [rawClients, profile, theme] = await Promise.all([
    apiClient.get<ClientOut[]>("/api/clients").catch(() => []),
    getBusinessProfile().catch(() => null),
    getBusinessTheme().catch(() => null),
  ]);

  const clients = rawClients.map((client) => ({
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
      clients={clients}
      taxes={taxes}
      charges={charges}
      profile={profile}
      logoUrl={theme?.logo_path || null}
      themeColor={theme?.letterhead_color || null}
  />
  );
}