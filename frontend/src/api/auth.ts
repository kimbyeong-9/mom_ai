import { api } from "./axios";
import type { AuthUserProfile } from "@/features/auth/types/auth.types";

export async function fetchCurrentUser(): Promise<AuthUserProfile> {
  const { data } = await api.get<AuthUserProfile>("/auth/me");
  return data;
}

export async function deleteAccount(): Promise<void> {
  await api.delete("/auth/me");
}
