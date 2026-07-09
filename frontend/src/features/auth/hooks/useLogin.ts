import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { login } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";

export function useLogin() {
  const authLogin = useAuthStore((state) => state.login);
  const showToast = useToastStore((state) => state.show);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authLogin(data.accessToken, data.user);
    },
    onError: (error) => {
      const message =
        (axios.isAxiosError(error) && (error.response?.data as { message?: string })?.message) ||
        "로그인에 실패했어요.";
      showToast(message);
    },
  });
}
