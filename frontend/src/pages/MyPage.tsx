import { useState } from "react";
import { useNavigate } from "react-router-dom";

import QueryErrorState from "@/components/QueryErrorState";
import DeleteAccountModal from "@/features/auth/components/DeleteAccountModal";
import LogoutConfirmModal from "@/features/auth/components/LogoutConfirmModal";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useDeleteAccount } from "@/features/auth/hooks/useDeleteAccount";
import { useAutomations } from "@/features/automation/hooks/useAutomations";
import { useSavedPlans } from "@/features/save/hooks/useSavedPlans";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

const PROVIDER_LABELS = {
  google: "Google로 로그인",
  kakao: "카카오로 로그인",
} as const;

export default function MyPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { data: profile, isLoading, isError, refetch } = useCurrentUser();
  const { data: savedPlans } = useSavedPlans();
  const { data: automations } = useAutomations();
  const deleteAccount = useDeleteAccount();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const stats = [
    { label: "가입일", value: profile ? formatDate(profile.createdAt, ".") : "-" },
    { label: "저장된 플랜", value: `${savedPlans?.length ?? 0}개` },
    { label: "연결된 자동화", value: `${automations?.length ?? 0}개` },
  ];

  const handleConfirmLogout = () => {
    logout();
    navigate("/");
  };

  const handleConfirmDelete = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        logout();
        navigate("/");
      },
    });
  };

  return (
    <div className="px-5 py-6 sm:px-11 sm:py-10">
      <div className="relative mx-auto flex max-w-2xl flex-col gap-5">
        <h1 className="text-xl font-extrabold text-[#1F3D2E] sm:text-2xl">마이페이지</h1>

        {isLoading && <p className="text-[13px] text-[#1F3D2E]/50">불러오는 중...</p>}
        {isError && (
          <QueryErrorState message="프로필을 불러오지 못했어요." onRetry={() => refetch()} />
        )}

        {profile && (
          <>
            <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:gap-5 sm:p-7">
              <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#1F3D2E] text-lg font-bold text-white sm:size-16 sm:text-2xl">
                {profile.name.slice(0, 1)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-[15px] font-bold text-[#1F3D2E] sm:text-lg">
                    {profile.name}님
                  </span>
                  <span className="truncate text-[12px] text-[#1F3D2E]/50 sm:text-[13px]">
                    {profile.email ?? "이메일 비공개"}
                  </span>
                </div>
                <span className="mt-2 w-fit rounded-full bg-[#1F3D2E]/[0.06] px-2 py-0.5 text-[11px] font-semibold text-[#1F3D2E]/60 sm:mt-0 sm:ml-auto">
                  {PROVIDER_LABELS[profile.provider]}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white px-5 shadow-[0_2px_10px_rgba(31,61,46,0.05)] sm:px-7">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={
                    index < stats.length - 1
                      ? "flex items-center justify-between border-b border-[#1F3D2E]/[0.06] py-3.5 sm:py-4"
                      : "flex items-center justify-between py-3.5 sm:py-4"
                  }
                >
                  <span className="text-[13px] text-[#1F3D2E]/55 sm:text-[14px]">
                    {stat.label}
                  </span>
                  <span className="text-[13px] font-semibold text-[#1F3D2E] sm:text-[14px]">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="h-12 w-full rounded-xl border border-[#1F3D2E]/15 bg-white text-[14px] font-semibold text-[#1F3D2E] transition-colors hover:bg-[#1F3D2E]/5 sm:w-[200px]"
            >
              로그아웃
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-fit text-[12.5px] text-[#1F3D2E]/35 underline"
            >
              계정 삭제
            </button>

            <DeleteAccountModal
              open={isDeleteModalOpen}
              isDeleting={deleteAccount.isPending}
              onCancel={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
            />

            <LogoutConfirmModal
              open={isLogoutModalOpen}
              onCancel={() => setIsLogoutModalOpen(false)}
              onConfirm={handleConfirmLogout}
            />
          </>
        )}
      </div>
    </div>
  );
}
