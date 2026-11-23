export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Edit Invoice #{id}</h1>
    </div>
  );
}