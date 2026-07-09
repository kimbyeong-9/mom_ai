import { api } from "./axios";
import type {
  AuthResult,
  AuthUserProfile,
  LoginInput,
  RegisterInput,
} from "@/features/auth/types/auth.types";

export async function login(input: LoginInput): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("/auth/login", input);
  return data;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("/auth/register", input);
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUserProfile> {
  const { data } = await api.get<AuthUserProfile>("/auth/me");
  return data;
}
