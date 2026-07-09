import AuthForm from "@/features/auth/components/AuthForm";
import { useAuthForm } from "@/features/auth/hooks/useAuthForm";
import { GoogleIcon, KakaoIcon } from "@/features/auth/components/SocialIcons";
import SocialLoginButton from "@/features/auth/components/SocialLoginButton";
import { useToastStore } from "@/store/toast.store";

const SOCIAL_LOGIN_OPTIONS = [
  { id: "kakao", label: "카카오로 시작하기", icon: <KakaoIcon /> },
  { id: "google", label: "Google로 계속하기", icon: <GoogleIcon /> },
] as const;

export default function LoginPage() {
  const showToast = useToastStore((state) => state.show);
  const { mode, toggleMode, register, onSubmit, isSubmitting } = useAuthForm();

  const handleSocialLogin = () => {
    showToast("소셜 로그인은 준비 중이에요.");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5F1E6] px-6 py-16">
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#B7CBAE] sm:size-72" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 size-48 rounded-full bg-[#F0D6C4] sm:size-72" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-[#1F3D2E] text-2xl font-bold text-white">
          L
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-neutral-900">LifeFlow</h1>
            <span className="rounded-full bg-[#CFE0C6] px-2 py-0.5 text-xs font-semibold text-[#1F3D2E]">
              AI
            </span>
          </div>
          <p className="text-sm text-neutral-500">MOM AI · 생활 준비 에이전트</p>
        </div>

        <p className="text-base text-neutral-600 sm:text-lg">
          복잡한 준비 과정을 AI와 함께,
          <br className="sm:hidden" /> 실행까지 한 번에
        </p>

        <div className="flex flex-col items-center gap-1 pt-4">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            함께 시작해볼까요?
          </h2>
          <p className="text-sm text-neutral-500">청년지원금부터 해외살이, 이직까지</p>
        </div>

        <div className="mt-4 w-full">
          <AuthForm
            mode={mode}
            register={register}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
          <button
            type="button"
            onClick={toggleMode}
            className="mt-3 text-[13px] font-medium text-[#1F3D2E]/60 hover:text-[#1F3D2E]"
          >
            {mode === "login" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
          </button>
        </div>

        <div className="flex w-full items-center gap-3 text-[12px] text-neutral-400">
          <div className="h-px flex-1 bg-neutral-200" />
          또는
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <div className="flex w-full flex-col gap-3">
          {SOCIAL_LOGIN_OPTIONS.map((option) => (
            <SocialLoginButton
              key={option.id}
              variant={option.id}
              label={option.label}
              icon={option.icon}
              onClick={handleSocialLogin}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
