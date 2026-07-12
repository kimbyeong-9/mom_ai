export type AuthProvider = "google" | "kakao";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthUserProfile = AuthUser & {
  provider: AuthProvider;
  createdAt: string;
};
