import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SocialLoginButtonProps = {
  variant: "kakao" | "google";
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

export default function SocialLoginButton({
  variant,
  label,
  icon,
  onClick,
}: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold transition-colors",
        variant === "kakao"
          ? "bg-[#FEE500] text-[#191919] hover:bg-[#f5dc00]"
          : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
