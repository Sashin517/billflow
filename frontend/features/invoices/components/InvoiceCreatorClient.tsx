"use client";

import { useRouter } from "next/navigation";
import {
  createInvoice,
  type InvoicePayload,
  type InvoiceStatus,
  type AppliedRule,
} from "@/lib/actions/invoice.actions";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import { type ProfileOut, type TaxOrChargeOut } from "@/lib/actions/settings.actions";

export interface InvoiceClientOption {
  id: number;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  billingAddress?: string;
  initial: string;
}

interface InvoiceCreatorClientProps {
  clients: InvoiceClientOption[];
  taxes: TaxOrChargeOut[];
  charges: TaxOrChargeOut[];
  profile?: ProfileOut | null;
  logoUrl?: string | null;
  themeColor?: string | null;
}

export default function InvoiceCreatorClient({
  clients,
  taxes,
  charges,
  profile,
  logoUrl,
  themeColor,
}: InvoiceCreatorClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const methods = useForm({
    defaultValues: {
        invoiceDate: today,
        dueDate: "",
        invoiceId: "",
        client: "",
        items: [{ name: "", qty: "", rate: "", amount: "" }],
        selectedTaxIds: taxes.filter((t) => t.is_default).map((t) => t.id),
        selectedChargeIds: charges.filter((c) => c.is_default).map((c) => c.id),
    },
  });

  const handleSaveInvoice = (status: InvoiceStatus) => {
    methods.handleSubmit(async (formData) => {
      setSaveError(null);

      // Basic validation before posting
      const selectedClient = clients.find((c) => c.company === formData.client);
      if (!selectedClient) {
        toast.error("Please select a client before saving.");
        return;
      }

      const invoiceNo = formData.invoiceId?.trim();
      if (!invoiceNo) {
        toast.error("Please enter an Invoice ID.");
        return;
      }

      const validItems = (formData.items || [])
        .filter((row: any) => row.name?.trim() !== "")
        .map((row: any) => {
          const qty = parseFloat(row.qty) || 0;
          const rate = parseFloat(row.rate) || 0;
          return {
            item: row.name.trim(),
            quantity: qty,
            rate,
            amount: Number((qty * rate).toFixed(2)),
          };
        });

      if (validItems.length === 0) {
        toast.error("Please add at least one item.");
        return;
      }

      // Calculate subtotal, applied taxes, applied charges, and grand total
      const subtotal = Number(
        validItems.reduce((sum: number, i: any) => sum + i.amount, 0).toFixed(2)
      );

      const selectedTaxIds: number[] = formData.selectedTaxIds || [];
      const selectedChargeIds: number[] = formData.selectedChargeIds || [];

      const toAppliedRule = (rule: TaxOrChargeOut): AppliedRule => {
        const val = Number(rule.value) || 0;
        const amount =
          rule.value_type === "percentage" ? (subtotal * val) / 100 : val;
        return {
          name: rule.name,
          value: val,
          type: rule.value_type,
          amount: Number(amount.toFixed(2)),
        };
      };

      const applied_taxes = taxes
        .filter((t) => selectedTaxIds.includes(t.id))
        .map(toAppliedRule);

      const applied_charges = charges
        .filter((c) => selectedChargeIds.includes(c.id))
        .map(toAppliedRule);

      const tax_total = Number(
        applied_taxes.reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)
      );
      const charge_total = Number(
        applied_charges.reduce((sum, c) => sum + Number(c.amount), 0).toFixed(2)
      );
      const grand_total = Number((subtotal + tax_total + charge_total).toFixed(2));

      // Build payload matching InvoicePayload
      const payload: InvoicePayload = {
        client_id: selectedClient.id,
        invoice_no: invoiceNo,
        issue_date: formData.invoiceDate,
        due_date: formData.dueDate || null,
        status,
        subtotal,
        applied_taxes,
        tax_total,
        applied_charges,
        charge_total,
        grand_total,
        items: validItems,
      };

      // Post to FastAPI via server action
      setIsSaving(true);
      try {
        const res = await createInvoice(payload);
        if (!res.success) {
          toast.error(res.error || "Failed to save invoice.");
          return;
        }
        toast.success(`Invoice saved as ${status}!`);
        router.push("/invoices");
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const printInvoice = async () => {
    const element = documentRef.current;
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
      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex h-[calc(100vh-2rem)] w-full relative">
        {/* Left Side: Form Panel */}
        <div
          className={`transition-all duration-500 ease-in-out flex-shrink-0 border-r border-border overflow-y-auto overflow-x-hidden no-scrollbar
            ${isCollapsed ? "w-0 opacity-0 border-none" : "w-[45%] opacity-100 pr-6"}
          `}
        >
        {saveError && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {saveError}
        </div>
        )}
        <InvoiceForm
            clients={clients}
            taxes={taxes}
            charges={charges}
            onSave={handleSaveInvoice}
            isSaving={isSaving}
        />
        </div>

        {/* SPLITTER BUTTON ANCHOR */}
        <div className="relative z-50 h-full flex items-center">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 shadow-md transition-all duration-500 ease-in-out
              ${isCollapsed ? "left-[-32px]" : "left-[-16px]"}
            `}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Right Side: Live Preview Panel */}
        <div className="flex-1 flex flex-col relative pl-6 transition-all duration-500 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-6 h-11">
            <h2 className="text-xl font-medium text-foreground">
              {isCollapsed ? "Preview Invoice: INV-2026-0001" : "Live Preview"}
            </h2>
            {isCollapsed && (
              <div className="flex items-center gap-3 text-sm text-foreground">
                <button className="hover:bg-popover p-1 border border-border rounded-full bg-card">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>2/5</span>
                <button className="hover:bg-popover p-1 border border-border rounded-full bg-card">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <Button
              className="bg-primary rounded-full px-6 h-11 hover:bg-primary-hover text-primary-foreground font-medium"
              onClick={printInvoice}
            >
              Generate Invoice
            </Button>
          </div>

            <InvoicePreview
                previewRef={documentRef}
                profile={profile}
                clients={clients}
                logoUrl={logoUrl}
                themeColor={themeColor}
                taxes={taxes}
                charges={charges}   
            />

          <div className="flex items-center w-full justify-center my-6 h-11">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <button className="hover:bg-popover p-1 border border-border rounded-full bg-card">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>2/5</span>
              <button className="hover:bg-popover p-1 border border-border rounded-full bg-card">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}