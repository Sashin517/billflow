"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api/fetcher";

export interface ClientFormInput {
  companyName: string;
  contactPerson?: string;
  position?: string;
  email?: string;
  contactNumber?: string;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

export interface ClientOut {
  id: number;
  user_id: number;
  company_name: string;
  contact_person?: string | null;
  position?: string | null;
  email?: string | null;
  contact_number?: string | null;
  street_address?: string | null;
  city?: string | null;
  state_province?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

function mapFormToPayload(input: ClientFormInput) {
  return {
    company_name: input.companyName.trim(),
    contact_person: input.contactPerson?.trim() || null,
    position: input.position?.trim() || null,
    email: input.email?.trim() || null,
    contact_number: input.contactNumber?.trim() || null,
    street_address: input.streetAddress?.trim() || null,
    city: input.city?.trim() || null,
    state_province: input.stateProvince?.trim() || null,
    postal_code: input.postalCode?.trim() || null,
    country: input.country?.trim() || null,
  };
}

export async function getClients(): Promise<ClientOut[]> {
  try {
    return await apiClient.get<ClientOut[]>("/api/clients");
  } catch {
    return [];
  }
}

export async function createClient(input: ClientFormInput): Promise<{
  success: boolean;
  data?: ClientOut;
  error?: string;
}> {
  try {
    const data = await apiClient.post<ClientOut>(
      "/api/clients",
      mapFormToPayload(input)
    );
    revalidatePath("/clients");
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create client.",
    };
  }
}

export async function updateClient(
  clientId: number,
  input: ClientFormInput
): Promise<{
  success: boolean;
  data?: ClientOut;
  error?: string;
}> {
  try {
    const data = await apiClient.put<ClientOut>(
      `/api/clients/${clientId}`,
      mapFormToPayload(input)
    );
    revalidatePath("/clients");
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update client.",
    };
  }
}

export async function deleteClient(clientId: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await apiClient.delete<void>(`/api/clients/${clientId}`);
    revalidatePath("/clients");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete client.",
    };
  }
}