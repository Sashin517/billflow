"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

import ItemRow from "./ItemRow";
import TaxSelector from "./TaxSelector";

export default function InvoiceForm() {
  const { control, watch } = useFormContext();
  
  // Watch the invoiceId field in real-time to update the title
  const currentInvoiceId = watch("invoiceId");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-2xl font-semibold text-foreground">
        Create Invoice {currentInvoiceId ? `- INV - ${currentInvoiceId}` : ""}
      </h1>

      {/* Invoice Details */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Invoice Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground font-normal">Invoice Date</FormLabel>
                <FormControl>
                  {/* Changed type="date" to match your default string value for now, or ensure your default is YYYY-MM-DD */}
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
                <FormLabel className="text-muted-foreground font-normal">Invoice ID</FormLabel>
                <FormControl>
                  <Input placeholder="0000" className="h-9.5 px-3 bg-input" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-9.5 px-3 bg-input w-full">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="px-4 py-3" value="Amaya Fernando">Amaya Fernando</SelectItem>
                  <SelectItem className="px-4 py-3" value="Kandy Wholesale">Kandy Wholesale</SelectItem>
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
      <TaxSelector />

      <div className="flex justify-end pt-4">
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-8 h-11">
          Save Details
        </Button>
      </div>
    </div>
  );
}