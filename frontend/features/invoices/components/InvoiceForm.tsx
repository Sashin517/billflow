"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

import ItemRow from "./ItemRow";
import TaxSelector from "./TaxSelector";
import { type TaxOrChargeOut } from "@/lib/actions/settings.actions";
import { type InvoiceClientOption } from "./InvoiceCreatorClient";

export type SaveInvoiceStatus = "Draft" | "Paid" | "Pending" | "Overdue";

interface InvoiceFormProps {
  clients: InvoiceClientOption[];
  taxes: TaxOrChargeOut[];
  charges: TaxOrChargeOut[];
  onSave: (status: SaveInvoiceStatus) => void;
  isSaving?: boolean;
}

export default function InvoiceForm({
  clients,
  taxes,
  charges,
  onSave,
  isSaving = false,
}: InvoiceFormProps) {
  const { control, watch } = useFormContext();
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);

  const currentInvoiceId = watch("invoiceId");
  const invoiceDate = watch("invoiceDate") || "";
  const dueDate = watch("dueDate") || "";

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Status eligibility based on Sri Lanka current date (YYYY-MM-DD)
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

  const hasDueDate = Boolean(dueDate);
  const isPendingAllowed =
    Boolean(invoiceDate) &&
    hasDueDate &&
    invoiceDate <= today &&
    today <= dueDate;
  const isOverdueAllowed = hasDueDate && dueDate < today;

  const handleSelectStatus = (status: SaveInvoiceStatus) => {
    setSaveMenuOpen(false);
    onSave(status);
  };

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-2xl font-semibold text-foreground">
        Create Invoice {currentInvoiceId ? `- INV - ${currentInvoiceId}` : ""}
      </h1>

      {/* Invoice Details */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Invoice Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground font-normal">
                  Invoice Date
                </FormLabel>
                <FormControl>
                  <Input type="date" className="h-9.5 px-3 bg-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground font-normal">
                  Due Date
                </FormLabel>
                <FormControl>
                  <Input type="date" className="h-9.5 px-3 bg-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="invoiceId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground font-normal">
                  Invoice ID
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0000"
                    className="h-9.5 px-3 bg-input"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Client Section */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Client Section</h3>
        <FormField
          control={control}
          name="client"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="h-9.5 px-3 bg-input w-full">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem
                        key={client.id}
                        className="px-4 py-3"
                        value={client.company}
                      >
                        {client.company}
                        {client.contactName !== "—"
                          ? ` — ${client.contactName}`
                          : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem className="px-4 py-3" value="none" disabled>
                      No clients found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      {/* Item Management */}
      <div className="space-y-4 bg-card border border-border rounded-xl p-6">
        <h3 className="text-base font-medium text-foreground">Item Management</h3>

        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground pb-2 border-b border-border/50">
          <div className="col-span-4">Item</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-2 text-center">Amount</div>
          <div className="col-span-2"></div>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <ItemRow key={field.id} index={index} remove={remove} />
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => append({ name: "", qty: "", rate: "", amount: "" })}
            className="flex items-center text-primary hover:text-primary-hover text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Item
          </button>
        </div>
      </div>

      {/* Tax & Totals */}
      <TaxSelector taxes={taxes} charges={charges} />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={() => onSave("Draft")}
          className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white font-medium rounded-full px-6 h-11"
        >
          Save as Draft
        </Button>

        <Popover open={saveMenuOpen} onOpenChange={setSaveMenuOpen}>
          <PopoverTrigger
            render={
              <Button
                type="button"
                disabled={isSaving}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-full px-6 h-11 gap-2"
              />
            }
          >
            {isSaving ? "Saving..." : "Save as"}
            <ChevronDown className="w-4 h-4" />
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-56 p-1.5 bg-popover border-border"
          >
            <div className="flex flex-col gap-1">
              {/* Paid: Always enabled */}
              <button
                type="button"
                onClick={() => handleSelectStatus("Paid")}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <div className="font-medium text-green-500">Paid</div>
                <div className="text-xs text-muted-foreground">
                  Mark payment as received
                </div>
              </button>

              {/* Pending: Enabled only when invoiceDate <= today <= dueDate */}
              <button
                type="button"
                disabled={!isPendingAllowed}
                onClick={() => handleSelectStatus("Pending")}
                className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer"
              >
                <div className="font-medium text-[#D4AF37]">Pending</div>
                <div className="text-xs text-muted-foreground">
                  {isPendingAllowed
                    ? "Awaiting client payment"
                    : !hasDueDate
                      ? "Select a due date first"
                      : "Today is outside date range"}
                </div>
              </button>

              {/* Overdue: Enabled only when dueDate is set and has passed */}
              <button
                type="button"
                disabled={!isOverdueAllowed}
                onClick={() => handleSelectStatus("Overdue")}
                className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary cursor-pointer"
              >
                <div className="font-medium text-destructive">Overdue</div>
                <div className="text-xs text-muted-foreground">
                  {isOverdueAllowed
                    ? "Due date has passed"
                    : !hasDueDate
                      ? "Select a due date first"
                      : "Due date hasn't passed yet"}
                </div>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}