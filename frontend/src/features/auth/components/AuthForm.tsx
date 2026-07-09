import type { UseFormRegister } from "react-hook-form";

import type { AuthMode } from "../hooks/useAuthForm";

type AuthFormValues = {
  email: string;
  password: string;
  name: string;
};

type AuthFormProps = {
  mode: AuthMode;
  register: UseFormRegister<AuthFormValues>;
  onSubmit: (event: React.FormEvent) => void;
  isSubmitting: boolean;
};

const INPUT_CLASSNAME =
  "w-full rounded-xl border-[1.5px] border-[#1F3D2E]/[0.12] bg-white px-4 py-3 text-[13.5px] text-[#1F3D2E] placeholder:text-[#1F3D2E]/40 focus:border-[#1F3D2E]/30 focus:outline-none";

export default function AuthForm({ mode, register, onSubmit, isSubmitting }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      {mode === "register" && (
        <input
          type="text"
          placeholder="이름"
          className={INPUT_CLASSNAME}
          {...register("name", { required: true })}
        />
      )}
      <input
        type="email"
        placeholder="이메일"
        className={INPUT_CLASSNAME}
        {...register("email", { required: true })}
      />
      <input
        type="password"
        placeholder="비밀번호 (8자 이상)"
        className={INPUT_CLASSNAME}
        {...register("password", { required: true, minLength: 8 })}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-12 rounded-xl bg-[#1F3D2E] text-[14px] font-semibold text-white transition-colors hover:bg-[#1a3325] disabled:opacity-50"
      >
        {isSubmitting ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
      </button>
    </form>
  );
}
