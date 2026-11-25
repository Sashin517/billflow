"use client";

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
  }); // YYYY-MM-DD

  const [isSaving, setIsSaving] = useState(false);

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

  const handleSaveInvoice = (status: "Draft" | "Paid" | "Pending" | "Overdue") => {
    methods.handleSubmit(async (formData) => {
      setIsSaving(true);
      try {
        // TODO: call your createInvoice server action here with { ...formData, status }
        console.log("Saving invoice to DB:", { ...formData, status });
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
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-11 px-6"
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