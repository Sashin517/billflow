import { redirect } from "next/navigation";
import { apiClient } from "@/lib/api/fetcher";
import UserMenuClient from "./UserMenuClient";

export default async function UserMenu() {
  const user = await apiClient
    .get<any>("/api/auth/me")
    .catch(() => null);

  if (!user) redirect("/login");

  return <UserMenuClient user={user} />;
}