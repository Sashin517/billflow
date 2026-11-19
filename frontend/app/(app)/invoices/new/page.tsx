"use client";

import { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import InvoiceForm from "@/features/invoices/components/InvoiceForm";
import InvoicePreview from "@/features/invoices/components/InvoicePreview";

export default function InvoiceCreatorPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  //reference
  const documentRef = useRef<HTMLDivElement>(null);
  const methods = useForm({
    defaultValues: {
      invoiceDate: "05 June, 2026",
      
      client: "Amaya Fernando",
      items: [
        { name: "Web Design & Development", qty: "1000", rate: "100", amount: "100,000.00" },
        { name: "Web Design & Development", qty: "1000", rate: "100", amount: "100,000.00" },
      ],
      vatEnabled: false,
      ssclEnabled: true,
    }
  });

  const printInvoice = async () => {
    const element = documentRef.current;
    if (!element) return;

    console.log("Generating PDF...");

    try {
      // Temporarily freeze the layout to a perfect A4 desktop width 
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = '800px'; 
      element.style.maxWidth = '800px';

      // Convert the DOM element to a canvas
      const canvas = await html2canvas(element, { 
        scale: 2, // High resolution for crisp text
        useCORS: true, 
        backgroundColor: '#ffffff', // FIX 1: Forces a white background instead of transparent/black
        windowWidth: 800, // FIX 2: Tells the virtual renderer the screen is 800px wide
      });

      // Instantly revert the styles back to responsive so the user doesn't notice
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;

      // Convert canvas to an image
      const imgData = canvas.toDataURL('image/png');

      // Initialize an A4 PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate aspect ratio to fit the A4 page perfectly
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to PDF and trigger download
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
      
      console.log("PDF generated successfully!");
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
          <InvoiceForm />
        </div>

        {/* SPLITTER BUTTON ANCHOR (Outside of scrollable areas) */}
        <div className="relative z-50 h-full flex items-center">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 shadow-md transition-all duration-500 ease-in-out
              ${isCollapsed ? "left-[-32px]" : "left-[-16px]"}
            `}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Side: Live Preview Panel */}
        <div className="flex-1 flex flex-col relative pl-6 transition-all duration-500 overflow-y-auto no-scrollbar">
          
          {/* Dynamic Header based on collapse state */}
          <div className="flex items-center justify-between mb-6 h-11">
            <h2 className="text-xl font-medium text-foreground">
              {isCollapsed ? "Preview Invoice: INV-2026-0001" : "Live Preview"}
            </h2>
            {isCollapsed && (
              <div className="flex items-center gap-3 text-sm text-foreground">
                <button className="hover:bg-popover p-1 border border-border rounded-full bg-card"><ChevronLeft className="w-4 h-4" /></button>
                <span>2/5</span>
                <button className="hover:bg-popover p-1 border border-border rounded-full bg-card"><ChevronRight className="w-4 h-4" /></button>
              </div>
            )}
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium h-11 px-6" onClick={printInvoice}>
              Generate Invoice
            </Button>           
          </div>

          <InvoicePreview previewRef={documentRef} />
          
          <div className="flex items-center w-full justify-center my-6 h-11">
              <div className="flex items-center gap-3 text-sm text-foreground">
                  <button className="hover:bg-popover p-1 border border-border rounded-full bg-card"><ChevronLeft className="w-4 h-4" /></button>
                  <span>2/5</span>
                  <button className="hover:bg-popover p-1 border border-border rounded-full bg-card"><ChevronRight className="w-4 h-4" /></button>
                </div>
          </div>
        </div>

      </div>
    </FormProvider>
  );
}