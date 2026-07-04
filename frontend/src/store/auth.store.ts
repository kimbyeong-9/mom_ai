import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      login: (accessToken, user) =>
        set({ accessToken, user, isAuthenticated: true }),
      logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);
