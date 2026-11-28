"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  Filter,
  Search,
  Pencil,
  ScanEye,
  MoreVertical,
  Trash2,
  X,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DataTable from "@/components/shared/DataTable";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import InvoiceStaticPreview from "@/features/invoices/components/InvoiceStaticPreview";
import {
  deleteInvoice,
  updateInvoiceStatus,
  type InvoiceOut,
  type InvoiceStatus,
} from "@/lib/actions/invoice.actions";
import { type ProfileOut } from "@/lib/actions/settings.actions";
import { type InvoiceClientOption } from "@/features/invoices/components/InvoiceCreatorClient";

interface InvoicesTableProps {
  invoices: InvoiceOut[];
  clients: InvoiceClientOption[];
  profile?: ProfileOut | null;
  logoUrl?: string | null;
  themeColor?: string | null;
}

const STATUS_OPTIONS: ("All" | InvoiceStatus)[] = [
  "All",
  "Draft",
  "Pending",
  "Paid",
  "Overdue",
];

const STATUS_BADGE: Record<InvoiceStatus, string> = {
  Paid: "bg-green-500/15 text-green-500",
  Pending: "bg-[#D4AF37]/15 text-[#D4AF37]",
  Overdue: "bg-destructive/15 text-destructive",
  Draft: "bg-white/10 text-muted-foreground",
};

const QUICK_STATUSES: InvoiceStatus[] = ["Pending", "Paid", "Overdue"];

export default function InvoicesTable({
  invoices,
  clients,
  profile,
  logoUrl,
  themeColor,
}: InvoicesTableProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<"All" | InvoiceStatus>("All");

  // Side preview (row click) & Full preview (eye icon)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceOut | null>(null);
  const [fullPreviewInvoice, setFullPreviewInvoice] = useState<InvoiceOut | null>(null);

  // Delete dialog & server action transitions
  const [deleteTarget, setDeleteTarget] = useState<InvoiceOut | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const fullPreviewRef = useRef<HTMLDivElement>(null);

  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients]
  );

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return invoices.filter((inv) => {
      const matchesStatus =
        statusFilter === "All" || inv.status === statusFilter;
      const client = clientMap.get(inv.client_id);

      const matchesSearch =
        !q ||
        inv.invoice_no.toLowerCase().includes(q) ||
        (client?.company || "").toLowerCase().includes(q) ||
        (client?.contactName || "").toLowerCase().includes(q) ||
        String(inv.grand_total).toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [invoices, searchQuery, statusFilter, clientMap]);

  const handleStatusChange = (invoice: InvoiceOut, status: InvoiceStatus) => {
    setOpenMenuId(null);
    startTransition(async () => {
      const res = await updateInvoiceStatus(invoice.id, status);
      if (!res.success) {
        toast.error(res.error || "Failed to update status.");
        return;
      }
      toast.success(`Invoice '${invoice.invoice_no}' marked as ${status}.`);
      if (selectedInvoice?.id === invoice.id) {
        setSelectedInvoice({ ...invoice, status });
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteInvoice(deleteTarget.id);
      if (!res.success) {
        toast.error(res.error || "Failed to delete invoice.");
        return;
      }
      toast.success(`Invoice '${deleteTarget.invoice_no}' deleted.`);
      if (selectedInvoice?.id === deleteTarget.id) {
        setSelectedInvoice(null);
      }
      setDeleteTarget(null);
    });
  };

  const handleDownloadPdf = async (invoiceNo: string) => {
    const element = fullPreviewRef.current;
    if (!element) return;

    try {
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = "800px";
      element.style.maxWidth = "800px";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 800,
      });

      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNo || "invoice"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  const columns: ColumnDef<InvoiceOut>[] = [
    {
      accessorKey: "invoice_no",
      header: "Invoice ID",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.invoice_no}
        </span>
      ),
    },
    {
      id: "client",
      header: "Client",
      cell: ({ row }) => {
        const client = clientMap.get(row.original.client_id);
        return (
          <span className="font-medium text-foreground">
            {client?.company || "Unknown Client"}
          </span>
        );
      },
    },
    {
      accessorKey: "issue_date",
      header: "Issue Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.issue_date}</span>
      ),
    },
    {
      accessorKey: "grand_total",
      header: "Grand Total",
      cell: ({ row }) => (
        <span>
          Rs.{" "}
          {Number(row.original.grand_total).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    ...(!selectedInvoice
      ? [
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { original: InvoiceOut } }) => {
              const status = row.original.status;
              return (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    STATUS_BADGE[status] || STATUS_BADGE.Draft
                  }`}
                >
                  {status}
                </span>
              );
            },
          } as ColumnDef<InvoiceOut>,
        ]
      : []),
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inv = row.original;
        return (
          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Edit Pencil */}
            <Link
              href={`/invoices/${inv.id}/edit`}
              title="Edit Invoice"
              className="text-primary hover:text-primary-hover transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </Link>

            {/* Eye Full Preview */}
            <button
              type="button"
              title="Full Preview"
              onClick={() => setFullPreviewInvoice(inv)}
              className="text-primary hover:text-primary-hover transition-colors cursor-pointer"
            >
              <ScanEye className="w-4 h-4" />
            </button>

            {/* 3-Dots Status & Delete Menu */}
            <Popover
              open={openMenuId === inv.id}
              onOpenChange={(open) => setOpenMenuId(open ? inv.id : null)}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    title="More Actions"
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  />
                }
              >
                <MoreVertical className="w-4 h-4" />
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-52 p-0 bg-[#111110] border border-white/15 rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="flex flex-col divide-y divide-white/15">
                  {QUICK_STATUSES.map((status) => {
                    const isCurrent = inv.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        disabled={isCurrent || isPending}
                        onClick={() => handleStatusChange(inv, status)}
                        className={`w-full py-3.5 px-4 text-center text-sm transition-colors ${
                          isCurrent
                            ? "text-white/35 cursor-not-allowed"
                            : "text-white hover:bg-white/5 cursor-pointer"
                        }`}
                      >
                        Mark as &lsquo;
                        <span className="font-semibold">{status}</span>&rsquo;
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      setOpenMenuId(null);
                      setDeleteTarget(inv);
                    }}
                    className="w-full py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-medium text-[#E11D48] hover:bg-[#E11D48]/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Invoice
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
        {/* LEFT: Invoice Editor Table */}
        <div
          className={`w-full transition-all duration-300 ${
            selectedInvoice ? "xl:w-[54%]" : "w-full"
          }`}
        >
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header Row */}
            <div className="px-6 py-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-medium text-foreground">
                Recent Invoices
              </h3>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-[240px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search....."
                    className="pl-10 pr-4 h-11 bg-input border-border text-sm"
                  />
                </div>

                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className="group h-11 px-5 !bg-input border !border-border text-primary hover:!bg-secondary hover:text-white shrink-0"
                      />
                    }
                  >
                    <Filter className="w-4 h-4 mr-2 text-primary group-hover:text-white transition-colors" />
                    {statusFilter === "All" ? "Filters" : statusFilter}
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-44 p-1.5 bg-popover border-border"
                  >
                    <div className="flex flex-col gap-1">
                      {STATUS_OPTIONS.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatusFilter(status)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                            statusFilter === status
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredInvoices}
              onRowClick={(inv) => setSelectedInvoice(inv)}
              isRowSelected={(inv) => selectedInvoice?.id === inv.id}
            />
          </div>
        </div>

        {/* RIGHT: Split Side Preview (Opens on Row Click) */}
        {selectedInvoice && (
          <div className="w-full xl:w-[46%] flex flex-col gap-4 bg-card/40 border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-medium text-foreground truncate">
                Preview Invoice: {selectedInvoice.invoice_no}
              </h2>

              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/invoices/${selectedInvoice.id}/edit`}>
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-5 h-10 text-sm font-medium gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit Invoice
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[75vh] no-scrollbar rounded-lg">
              <InvoiceStaticPreview
                invoice={selectedInvoice}
                client={clientMap.get(selectedInvoice.client_id)}
                profile={profile}
                logoUrl={logoUrl}
                themeColor={themeColor}
              />
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Preview Modal (Eye Icon) */}
      <Dialog
        open={Boolean(fullPreviewInvoice)}
        onOpenChange={(open) => {
          if (!open) setFullPreviewInvoice(null);
        }}
      >
        <DialogContent className="sm:max-w-[900px] max-h-[92vh] bg-[#161615] border-border p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-border/50 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-medium text-foreground">
              Invoice Preview: {fullPreviewInvoice?.invoice_no}
            </DialogTitle>

            {fullPreviewInvoice && (
              <div className="flex items-center gap-3 mr-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDownloadPdf(fullPreviewInvoice.invoice_no)}
                  className="rounded-full h-9 px-4 border-border text-foreground hover:bg-secondary gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Link href={`/invoices/${fullPreviewInvoice.id}/edit`}>
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full h-9 px-4 gap-2">
                    <Pencil className="w-4 h-4" />
                    Edit Invoice
                  </Button>
                </Link>
              </div>
            )}
          </DialogHeader>

          <div className="p-6 overflow-y-auto flex-1 bg-black/40">
            {fullPreviewInvoice && (
              <InvoiceStaticPreview
                previewRef={fullPreviewRef}
                invoice={fullPreviewInvoice}
                client={clientMap.get(fullPreviewInvoice.client_id)}
                profile={profile}
                logoUrl={logoUrl}
                themeColor={themeColor}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        variant="delete"
        title={`Do You Want to Delete Invoice ID '${deleteTarget?.invoice_no}'?`}
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        isLoading={isPending}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}