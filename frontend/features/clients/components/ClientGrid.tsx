import ClientCard, { type Client } from "./ClientCard";

export default function ClientGrid({ clients }: { clients: Client[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clients.map((client, index) => (
        <ClientCard key={index} client={client} />
      ))}
    </div>
  );
}