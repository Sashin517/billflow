"use client";

import { Building2 } from "lucide-react";
import { type InvoiceOut } from "@/lib/actions/invoice.actions";
import { type ProfileOut } from "@/lib/actions/settings.actions";
import { type InvoiceClientOption } from "./InvoiceCreatorClient";

interface InvoiceStaticPreviewProps {
  invoice: InvoiceOut;
  client?: InvoiceClientOption | null;
  profile?: ProfileOut | null;
  logoUrl?: string | null;
  themeColor?: string | null;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

const formatRs = (amount: number | string) =>
  `Rs. ${(Number(amount) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function InvoiceStaticPreview({
  invoice,
  client,
  profile,
  logoUrl,
  themeColor,
  previewRef,
}: InvoiceStaticPreviewProps) {
  const addressLine2 = [
    profile?.city,
    profile?.state_province,
    profile?.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  const contactParts = [
    profile?.contact_phones?.[0]?.number,
    profile?.website,
    profile?.email,
  ].filter(Boolean);

  return (
    <div
      ref={previewRef}
      className="bg-white text-black w-full max-w-[820px] mx-auto aspect-[1/1.414] shadow-lg flex flex-col"
    >
      {/* Header Strip */}
      <div
        style={{ backgroundColor: themeColor || "#1A1A1A" }}
        className="text-white p-6 sm:p-8 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-transparent rounded-md flex items-center justify-center text-white overflow-hidden p-1 shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={profile?.business_name || "Business Logo"}
                crossOrigin="anonymous"
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-6 h-6" />
            )}
          </div>
          <span className="text-lg font-medium tracking-wide">
            {profile?.business_name || "Your Company Name"}
          </span>
        </div>
        <div className="text-right text-xs text-gray-300 space-y-0.5">
          <p>{profile?.street_address || "123 Enterprise Way,"}</p>
          <p>{addressLine2 || "Sri Jayawardene Pura Kotte"}</p>
          <p>VAT-ID: {profile?.tax_number || "---"}</p>
        </div>
      </div>

      {/* Contact Strip */}
      <div className="bg-[#F4F4F4] text-[11px] text-center py-2 text-gray-600 border-b border-gray-200">
        {contactParts.length > 0
          ? `Contact us • ${contactParts.join(" • ")}`
          : "Contact us • BillFlow"}
      </div>

      {/* Main Body */}
      <div className="p-8 sm:p-10 flex-1 flex flex-col">
        <h1 className="text-3xl font-normal tracking-wider mb-8 text-gray-900">
          INVOICE
        </h1>

        <div className="flex justify-between items-start gap-6 mb-10 text-xs sm:text-sm">
          <div className="space-y-1">
            <p className="font-semibold text-gray-800">Bill To:</p>
            <p>
              <span className="font-semibold text-gray-800">Client Company:</span>{" "}
              {client?.company || "Unknown Client"}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Contact Person:</span>{" "}
              {client?.contactName || "---"}
            </p>
            <p className="max-w-[240px] mt-1">
              <span className="font-semibold text-gray-800">Billing Address:</span>{" "}
              {client?.billingAddress || "---"}
            </p>
          </div>
          <div className="space-y-1 text-right shrink-0">
            <p>
              <span className="font-semibold text-gray-800">Invoice ID:</span>{" "}
              {invoice.invoice_no}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Date:</span>{" "}
              {invoice.issue_date}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Due Date:</span>{" "}
              {invoice.due_date || "---"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs sm:text-sm text-left mb-10">
          <thead className="bg-[#F4F4F4] border-b border-gray-200 font-semibold text-gray-800">
            <tr>
              <th className="py-2.5 px-3">Item</th>
              <th className="py-2.5 px-3">Quantity</th>
              <th className="py-2.5 px-3">Rate</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {(invoice.items || []).map((item, index) => (
              <tr key={item.id ?? index}>
                <td className="py-3 px-3">{item.item || "---"}</td>
                <td className="py-3 px-3">{item.quantity}</td>
                <td className="py-3 px-3">{item.rate}</td>
                <td className="py-3 px-3 text-right">{formatRs(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-auto">
          <div className="w-[260px] text-xs sm:text-sm space-y-1.5 text-gray-700">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>{formatRs(invoice.subtotal)}</p>
            </div>

            {(invoice.applied_taxes || []).map((tax, idx) => (
              <div key={`tax-${idx}`} className="flex justify-between">
                <p>
                  {tax.name} ({tax.type === "percentage" ? `${tax.value}%` : "Fixed"})
                </p>
                <p>{formatRs(tax.amount)}</p>
              </div>
            ))}

            {(invoice.applied_charges || []).map((charge, idx) => (
              <div key={`charge-${idx}`} className="flex justify-between">
                <p>
                  {charge.name} (
                  {charge.type === "percentage" ? `${charge.value}%` : "Fixed"})
                </p>
                <p>{formatRs(charge.amount)}</p>
              </div>
            ))}

            <div className="border-t border-black pt-2 mt-2 flex justify-between font-bold text-black text-sm sm:text-base">
              <p>GRAND TOTAL:</p>
              <p>{formatRs(invoice.grand_total)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}