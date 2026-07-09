import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useLogin } from "./useLogin";
import { useRegister } from "./useRegister";

export type AuthMode = "login" | "register";

type AuthFormValues = {
  email: string;
  password: string;
  name: string;
};

export function useAuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const { register, handleSubmit, reset } = useForm<AuthFormValues>({
    defaultValues: { email: "", password: "", name: "" },
  });
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const activeMutation = mode === "login" ? loginMutation : registerMutation;

  const onSubmit = handleSubmit((values) => {
    const onSuccess = { onSuccess: () => navigate("/planning") };
    if (mode === "login") {
      loginMutation.mutate({ email: values.email, password: values.password }, onSuccess);
    } else {
      registerMutation.mutate(values, onSuccess);
    }
  });

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    reset();
  };

  return {
    mode,
    toggleMode,
    register,
    onSubmit,
    isSubmitting: activeMutation.isPending,
  };
}
