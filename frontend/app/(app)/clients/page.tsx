import { apiClient } from "@/lib/api/fetcher";
import { type ClientOut } from "@/lib/actions/client.actions";
import AddClientDialog from "@/features/clients/components/AddClientDialog";
import ClientsListView from "@/features/clients/components/ClientsListView";

export default async function ClientsPage() {
  const rawClients = await apiClient
    .get<ClientOut[]>("/api/clients/")
    .catch(() => []);

  const clients = rawClients.map((client) => ({
    id: client.id,
    company: client.company_name,
    contactName:
      [client.contact_person, client.position].filter(Boolean).join(", ") ||
      "—",
    email: client.email || "—",
    phone: client.contact_number || "—",
    initial: (client.company_name?.[0] || "?").toUpperCase(),
    raw: client,
  }));

  return (
    <div className="space-y-8 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-foreground">Clients</h1>
        <AddClientDialog />
      </div>

      <ClientsListView clients={clients} />
    </div>
  );
}