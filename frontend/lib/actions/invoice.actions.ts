"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api/fetcher";

export type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue";
export type RuleType = "percentage" | "fixed";

export interface AppliedRule {
  name: string;
  value: number | string;
  type: RuleType;
  amount: number | string;
}

export interface InvoiceItemInput {
  item: string;
  quantity?: number | string;
  rate: number | string;
  amount: number | string;
}

export interface InvoiceItemOut extends InvoiceItemInput {
  id: number;
  quantity: number | string;
}

export interface InvoicePayload {
  client_id: number;
  invoice_no: string;
  issue_date: string; // YYYY-MM-DD
  due_date?: string | null; // YYYY-MM-DD
  status?: InvoiceStatus;
  subtotal: number | string;
  applied_taxes?: AppliedRule[];
  tax_total?: number | string;
  applied_charges?: AppliedRule[];
  charge_total?: number | string;
  grand_total: number | string;
  notes?: string | null;
  items: InvoiceItemInput[];
}

export interface InvoiceOut extends InvoicePayload {
  id: number;
  user_id: number;
  status: InvoiceStatus;
  applied_taxes: AppliedRule[];
  tax_total: number | string;
  applied_charges: AppliedRule[];
  charge_total: number | string;
  items: InvoiceItemOut[];
}

export async function getInvoices(
  status?: InvoiceStatus
): Promise<InvoiceOut[]> {
  try {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return await apiClient.get<InvoiceOut[]>(`/api/invoices/${query}`);
  } catch {
    return [];
  }
}

export async function getInvoiceById(
  invoiceId: number
): Promise<InvoiceOut | null> {
  try {
    return await apiClient.get<InvoiceOut>(`/api/invoices/${invoiceId}`);
  } catch {
    return null;
  }
}

export async function createInvoice(payload: InvoicePayload): Promise<{
  success: boolean;
  data?: InvoiceOut;
  error?: string;
}> {
  try {
    const data = await apiClient.post<InvoiceOut>("/api/invoices/", payload);
    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create invoice.",
    };
  }
}

export async function updateInvoice(
  invoiceId: number,
  payload: InvoicePayload
): Promise<{
  success: boolean;
  data?: InvoiceOut;
  error?: string;
}> {
  try {
    const data = await apiClient.put<InvoiceOut>(
      `/api/invoices/${invoiceId}`,
      payload
    );
    revalidatePath("/invoices");
    revalidatePath(`/invoices/${invoiceId}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update invoice.",
    };
  }
}

export async function updateInvoiceStatus(
  invoiceId: number,
  status: InvoiceStatus
): Promise<{
  success: boolean;
  data?: InvoiceOut;
  error?: string;
}> {
  try {
    const data = await apiClient.patch<InvoiceOut>(
      `/api/invoices/${invoiceId}/status?new_status=${encodeURIComponent(status)}`
    );
    revalidatePath("/invoices");
    revalidatePath(`/invoices/${invoiceId}`);
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to update invoice status.",
    };
  }
}

export async function deleteInvoice(invoiceId: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await apiClient.delete<void>(`/api/invoices/${invoiceId}`);
    revalidatePath("/invoices");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete invoice.",
    };
  }
}