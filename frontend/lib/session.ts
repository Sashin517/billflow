import { cookies } from "next/headers";

const COOKIE_NAME = "billflow_token";

export async function setSessionToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days (FastAPI JWT expiry)
  });
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearSessionToken() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}