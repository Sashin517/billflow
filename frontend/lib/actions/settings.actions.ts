"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api/fetcher";
import { getSessionToken } from "@/lib/session";
import { type ProfileFormValues } from "@/lib/validations/settings";

const FASTAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ==========================================
// 1. BUSINESS PROFILE + TAXES + CHARGES
// ==========================================

export async function getBusinessProfile() {
  try {
    return await apiClient.get<any>("/api/settings/profile");
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}

/**
 * Upserts settings_profile and syncs settings_taxes & settings_charges
 */
export async function saveBusinessProfile(data: ProfileFormValues) {
  try {
    const payload = {
      business_name: data.propertyName,
      street_address: data.streetAddress || null,
      city: data.city || null,
      state_province: data.stateProvince || null,
      postal_code: data.postalCode || null,
      country: data.country || null,
      contact_phones: data.phones.filter((p) => p.number.trim() !== ""),
      email: data.email || null,
      website: data.website || null,
      tax_number: data.taxNumber || null,
      taxes: data.taxes
        .filter((t) => t.name.trim() !== "")
        .map((t) => ({
          name: t.name,
          value: parseFloat(t.value) || 0,
          value_type: t.isPercentage ? "percentage" : "fixed",
          is_default: false,
        })),
      charges: data.charges
        .filter((c) => c.name.trim() !== "")
        .map((c) => ({
          name: c.name,
          value: parseFloat(c.value) || 0,
          value_type: c.isPercentage ? "percentage" : "fixed",
          is_default: false,
        })),
    };

    const updated = await apiClient.put<any>("/api/settings/profile", payload);
    revalidatePath("/settings/profile");
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save profile",
    };
  }
}

export async function deleteTaxRule(taxId: number) {
  try {
    await apiClient.delete<void>(`/api/settings/taxes/${taxId}`);
    revalidatePath("/settings/profile");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete tax rule",
    };
  }
}

export async function deleteChargeRule(chargeId: number) {
  try {
    await apiClient.delete<void>(`/api/settings/charges/${chargeId}`);
    revalidatePath("/settings/profile");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete charge rule",
    };
  }
}

// ==========================================
// 2. BUSINESS THEME & LOGO
// ==========================================

export async function getBusinessTheme() {
  try {
    return await apiClient.get<any>("/api/settings/theme");
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}

/**
 * Updates letterhead_color and/or dark_mode
 */
export async function saveBusinessTheme(payload: {
  letterhead_color?: string;
  dark_mode?: boolean;
}) {
  try {
    const updated = await apiClient.put<any>("/api/settings/theme", payload);
    revalidatePath("/settings/theme");
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save theme",
    };
  }
}

/**
 * Uploads logo file to FastAPI -> Object Storage (R2) -> saves URL in settings_theme.logo_path
 * Uses getSessionToken() directly because FormData must not be JSON-stringified.
 */
export async function uploadBusinessLogo(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { success: false, error: "No file selected" };

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File exceeds 5 MB limit" };
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      return { success: false, error: "Only PNG, JPG, or WebP images are allowed" };
    }

    const token = await getSessionToken();
    const res = await fetch(`${FASTAPI_URL}/api/settings/theme/logo`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.detail || `API Error: ${res.status}`,
      };
    }

    const data = await res.json();
    revalidatePath("/settings/theme");
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected upload error",
    };
  }
}

/**
 * Deletes logo from Object Storage and sets settings_theme.logo_path = NULL
 */
export async function deleteBusinessLogo() {
  try {
    await apiClient.delete<any>("/api/settings/theme/logo");
    revalidatePath("/settings/theme");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete logo",
    };
  }
}