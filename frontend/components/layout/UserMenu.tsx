import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserMenuClient from "./UserMenuClient";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("billflow_token")?.value;
  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <UserMenuClient user={user} />;
}