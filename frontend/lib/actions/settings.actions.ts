"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { type ProfileFormValues } from "@/lib/validations/settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("billflow_token")?.value;
  if (!token) throw new Error("Unauthorized: Please log in again.");

  return {
    Authorization: `Bearer ${token}`,
  };
}

function formatFastApiError(err: any, fallback: string): string {
  if (!err?.detail) return fallback;
  if (typeof err.detail === "string") return err.detail;
  if (Array.isArray(err.detail)) {
    return err.detail
      .map((e: any) => `${e.loc?.slice(1).join(".") || "field"}: ${e.msg}`)
      .join(", ");
  }
  return fallback;
}

// ==========================================
// 1. BUSINESS PROFILE + TAXES + CHARGES
// ==========================================

export async function getBusinessProfile() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/settings/profile`, {
    headers,
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load business profile");
  return res.json();
}

/**
 * Upserts settings_profile and syncs settings_taxes & settings_charges
 */
export async function saveBusinessProfile(data: ProfileFormValues) {
  try {
    const headers = await getAuthHeaders();

    // Map frontend camelCase -> PostgreSQL/FastAPI snake_case
    const payload = {
      business_name: data.propertyName,
      street_address: data.streetAddress || null,
      city: data.city || null,
      state_province: data.stateProvince || null,
      postal_code: data.postalCode || null,
      country: data.country || null,
      // Requires FastAPI ProfileUpsert to use `contact_phones: List[PhoneItem]`
      // (If FastAPI still uses `List[str]`, add `.map((p) => p.number)` at the end)
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

    const res = await fetch(`${API_URL}/api/settings/profile`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: formatFastApiError(err, "Failed to save profile"),
      };
    }

    const updated = await res.json();
    revalidatePath("/settings/profile");
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

export async function deleteTaxRule(taxId: number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/settings/taxes/${taxId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) return { success: false, error: "Failed to delete tax rule" };
    revalidatePath("/settings/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Unexpected error deleting tax rule" };
  }
}

export async function deleteChargeRule(chargeId: number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/settings/charges/${chargeId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) return { success: false, error: "Failed to delete charge rule" };
    revalidatePath("/settings/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Unexpected error deleting charge rule" };
  }
}

// ==========================================
// 2. BUSINESS THEME & LOGO
// ==========================================

export async function getBusinessTheme() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/settings/theme`, {
    headers,
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load theme settings");
  return res.json();
}

/**
 * Updates letterhead_color and/or dark_mode
 */
export async function saveBusinessTheme(payload: {
  letterhead_color?: string;
  dark_mode?: boolean;
}) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/settings/theme`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: formatFastApiError(err, "Failed to save theme"),
      };
    }

    const updated = await res.json();
    revalidatePath("/settings/theme");
    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unexpected error",
    };
  }
}

/**
 * Uploads logo file to FastAPI -> Object Storage (R2) -> saves URL in settings_theme.logo_path
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

    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/settings/theme/logo`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: formatFastApiError(err, "Failed to upload logo"),
      };
    }

    const data = await res.json(); // { logo_path: "https://..." }
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
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/settings/theme/logo`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) return { success: false, error: "Failed to delete logo" };
    revalidatePath("/settings/theme");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Unexpected error deleting logo" };
  }
}