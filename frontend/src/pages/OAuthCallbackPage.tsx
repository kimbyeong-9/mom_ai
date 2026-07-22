import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchCurrentUser } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { useToastStore } from "@/store/toast.store";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const showToast = useToastStore((state) => state.show);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      showToast("로그인에 실패했어요.");
      navigate("/login", { replace: true });
      return;
    }

    useAuthStore.setState({ accessToken: token });
    fetchCurrentUser()
      .then((user) => {
        login(token, user);
        navigate("/", { replace: true });
      })
      .catch(() => {
        showToast("로그인에 실패했어요.");
        navigate("/login", { replace: true });
      });
  }, [login, navigate, showToast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F1E6]">
      <p className="text-[13.5px] text-[#1F3D2E]/50">로그인 처리 중이에요...</p>
    </div>
  );
}
