import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, PenLine, Eye } from "lucide-react";


export type RecentInvoice = {
  id: string;
  company: string;
  clientName: string;
  date: string;
  amount: string;
  status: "Pending" | "Paid" | "Draft" | "Overdue";
};

export const recentInvoicesColumns: ColumnDef<RecentInvoice>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
  },
  {
    id: "client",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <span className="font-semibold text-foreground">{row.original.company}</span>
        <span className="text-muted-foreground">, {row.original.clientName}</span>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Issue Date/Time",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.date}</span>,
  },
  {
    accessorKey: "amount",
    header: "Grand Total",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.amount}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let config = { bg: "bg-secondary", text: "text-muted-foreground" };
      
      if (status === "Pending") config = { bg: "bg-[#D4AF37]/20", text: "text-[#D4AF37]" };
      if (status === "Paid") config = { bg: "bg-green-500/20", text: "text-green-500" };
      if (status === "Overdue") config = { bg: "bg-destructive/20", text: "text-destructive" };
      if (status === "Draft") config = { bg: "bg-secondary", text: "text-muted-foreground" };

      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex items-center gap-3 text-muted-foreground">
        <button className="hover:text-primary transition-colors"><PenLine className="w-4 h-4" /></button>
        <button className="hover:text-primary transition-colors"><Eye className="w-4 h-4" /></button>
        <button className="hover:text-primary transition-colors"><MoreVertical className="w-4 h-4" /></button>
      </div>
    ),
  },
];

export const recentInvoicesData: RecentInvoice[] = [
  { id: "5345313354", company: "Kandy Wholesale", clientName: "Amaya Fernando", date: "05 June 2026, 11.54 am", amount: "Rs. 10000.00", status: "Pending" },
  { id: "5345313355", company: "Kandy Wholesale", clientName: "Amaya Fernando", date: "05 June 2026, 11.54 am", amount: "Rs. 5000.00", status: "Paid" },
  { id: "5345313356", company: "Kandy Wholesale", clientName: "Amaya Fernando", date: "05 June 2026, 11.54 am", amount: "Rs. 0.00", status: "Draft" },
  { id: "5345313357", company: "Kandy Wholesale", clientName: "Amaya Fernando", date: "05 June 2026, 11.54 am", amount: "Rs. 0.00", status: "Paid" },
  { id: "5345313358", company: "Kandy Wholesale", clientName: "Amaya Fernando", date: "05 June 2026, 11.54 am", amount: "Rs. 0.00", status: "Paid" },
  { id: "5345313359", company: "Kandy Wholesale", clientName: "Amaya Fernando", date: "05 June 2026, 11.54 am", amount: "Rs. 0.00", status: "Pending" },
  { id: "5345313360", company: "Kandy Wholesale", clientName: "Amaya Fernando", date: "05 June 2026, 11.54 am", amount: "Rs. 0.00", status: "Overdue" },
];