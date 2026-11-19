"use server";

import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api/fetcher";
import { setSessionToken, clearSessionToken } from "@/lib/session";

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    auth_provider: string;
  };
}

export async function loginWithGoogle(idToken: string) {
  try {
    const data = await apiClient.post<AuthResponse>("/api/auth/google", {
      id_token: idToken,
    });

    await setSessionToken(data.access_token);
    return { success: true, user: data.user };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Google authentication failed";
    return { success: false, error: message };
  }
}

export async function logout() {
  await clearSessionToken();
  redirect("/login");
}