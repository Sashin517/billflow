"use client";

import { useFormContext } from "react-hook-form";
import { Building2 } from "lucide-react";
import { type ProfileOut } from "@/lib/actions/settings.actions";
import { type InvoiceClientOption } from "./InvoiceCreatorClient";

interface InvoicePreviewProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  profile?: ProfileOut | null;
  clients?: InvoiceClientOption[];
  logoUrl?: string | null;
  themeColor?: string | null;
}

export default function InvoicePreview({
  previewRef,
  profile,
  clients = [],
  logoUrl,
  themeColor,
}: InvoicePreviewProps) {
  const { watch } = useFormContext();

  const invoiceId = watch("invoiceId");
  const invoiceDate = watch("invoiceDate");
  const dueDate = watch("dueDate");
  const clientName = watch("client");
  const items = watch("items") || [];

  const selectedClient = clients.find((c) => c.company === clientName);
  const contactPerson =
    selectedClient && selectedClient.contactName !== "—"
      ? selectedClient.contactName
      : "";

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
      className="bg-white text-black w-full max-w-[1000px] mx-auto aspect-[1/1.414] shadow-lg flex flex-col mt-2 transition-all duration-500"
    >
      {/* Dark Header Strip */}
      <div style={{ backgroundColor: themeColor || "#1A1A1A" }} className="text-white p-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-transparent rounded-md flex items-center justify-center text-black overflow-hidden p-1 shrink-0">
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
          <span className="text-xl font-medium tracking-wide">
            {profile?.business_name || "Your Company Name"}
          </span>
        </div>
        <div className="text-right text-sm text-gray-300">
          <p>{profile?.street_address || "123 Enterprise Way,"}</p>
          <p>{addressLine2 || "Sri Jayawardene Pura Kotte"}</p>
          {profile?.tax_number ? (
            <p>VAT-ID: {profile.tax_number}</p>
          ) : (
            <p>VAT-ID: ---</p>
          )}
        </div>
      </div>

      {/* Contact Strip */}
      <div className="bg-[#F4F4F4] text-xs text-center py-2 text-gray-600 border-b border-gray-200">
        {contactParts.length > 0
          ? `Contact us • ${contactParts.join(" • ")}`
          : "Contact us • +94 11 255 6815 • www.hotelname.lk • hotelname@acme.lk"}
      </div>

      {/* Main Body */}
      <div className="p-12 flex-1">
        <h1 className="text-4xl font-normal tracking-wider mb-10 text-gray-900">
          INVOICE
        </h1>

        <div className="flex justify-between items-end mb-12">
          <div className="text-sm space-y-1">
            <p className="font-semibold text-gray-800">Bill To:</p>
            <p>
              <span className="font-semibold text-gray-800">Client Company:</span>{" "}
              {clientName || "---"}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Contact Person:</span>{" "}
              {contactPerson || "---"}
            </p>
            <p className="max-w-[250px] mt-2">
              <span className="font-semibold text-gray-800">Billing Address:</span>{" "}
              62/A Gamameda road, Mathammana, Minuwangoda, Western, 11550
            </p>
          </div>
          <div className="text-sm space-y-1 text-right">
            <p>
              <span className="font-semibold text-gray-800">Invoice ID:</span>{" "}
              {invoiceId || "---"}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Date:</span>{" "}
              {invoiceDate || "---"}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Due Date:</span>{" "}
              {dueDate || "---"}
            </p>
          </div>
        </div>

        {/* Dynamic Invoice Table */}
        <table className="w-full text-sm text-left mb-12">
          <thead className="bg-[#F4F4F4] border-b border-gray-200 font-semibold text-gray-800">
            <tr>
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Rate</th>
              <th className="py-3 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {items.map((item: any, index: number) => {
              const qty = parseFloat(item.qty) || 0;
              const rate = parseFloat(item.rate) || 0;
              const amount = qty * rate;

              return (
                <tr key={index}>
                  <td className="py-4 px-4">{item.name || "---"}</td>
                  <td className="py-4 px-4">{item.qty || "0"}</td>
                  <td className="py-4 px-4">{item.rate || "0"}</td>
                  <td className="py-4 px-4 text-right">
                    Rs.{" "}
                    {amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end">
          <div className="w-[300px] text-sm space-y-2 text-gray-700">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>Rs. 24, 081.63</p>
            </div>
            <div className="flex justify-between">
              <p>SSCL (2%)</p>
              <p>Rs. 602.04</p>
            </div>
            <div className="flex justify-between">
              <p>VAT (18%)</p>
              <p>Rs. 4,816.33</p>
            </div>
            <div className="flex justify-between">
              <p>Service Charge (10%)</p>
              <p>Rs. 4,816.33</p>
            </div>
            {/* <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
              <p>Total Charges</p>
              <p>Rs. 29,500.00</p>
            </div>
            <div className="flex justify-between">
              <p>Total Payment</p>
              <p>-Rs. 29,500.00</p>
            </div> */}
            <div className="border-t border-black pt-2 mt-2 flex justify-between font-bold text-black text-base">
              <p>GRAND TOTAL:</p>
              <p>Rs 0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}