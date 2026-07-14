export type AuthProvider = "google" | "kakao";

export type AuthUser = {
  id: string;
  email: string | null;
  name: string;
};

export type AuthUserProfile = AuthUser & {
  provider: AuthProvider;
  createdAt: string;
};
