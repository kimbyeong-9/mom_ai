import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import LoginRequiredModal from "@/components/LoginRequiredModal";
import PlanningLoading from "@/features/planning/components/PlanningLoading";
import PlanningResultCard from "@/features/planning/components/PlanningResultCard";
import { usePlanningResult } from "@/features/planning/hooks/usePlanningResult";
import SavePlanConfirmModal from "@/features/save/components/SavePlanConfirmModal";
import { useSavePlan } from "@/features/save/hooks/useSavePlan";
import { usePageTitle } from "@/layouts/usePageTitle";
import { trackEvent } from "@/lib/analytics";
import { useAuthStore } from "@/store/auth.store";

export default function PlanningPage() {
  usePageTitle("플랜");
  const [searchParams] = useSearchParams();
  const planningId = searchParams.get("planningId");
  const tags = {
    country: searchParams.get("country") ?? undefined,
    role: searchParams.get("role") ?? undefined,
    workStyle: searchParams.get("workStyle") ?? undefined,
  };

  const { data: planningResult, isLoading } = usePlanningResult(planningId);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const savePlan = useSavePlan();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSaveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const handleSaveClick = () => {
    trackEvent("save_button_clicked", { planningId });
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    setSaveConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    if (!planningId) return;
    savePlan.mutate(planningId, {
      onSuccess: () => setSaveConfirmOpen(false),
    });
  };

  if (!planningId) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-6 sm:px-11 sm:py-8">
        <h1 className="text-xl font-extrabold text-[#1F3D2E] sm:text-2xl">Planning</h1>
        <p className="text-[13px] text-[#1F3D2E]/55 sm:text-[13.5px]">
          아직 만든 플랜이 없어요.{" "}
          <Link to="/start" className="font-semibold underline">
            목표 입력하러 가기 →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-6 sm:gap-[18px] sm:px-11 sm:py-8">
      {isLoading && (
        <PlanningLoading
          heading={
            [tags.country, tags.role].filter(Boolean).join(" ")
              ? `${[tags.country, tags.role].filter(Boolean).join(" ")} 준비를\n실제로 조사하고 있어요`
              : undefined
          }
        />
      )}
      {planningResult && (
        <PlanningResultCard
          title={planningResult.title}
          goalType={planningResult.goalType}
          goalText={planningResult.goalText}
          steps={planningResult.steps}
          aiGenerated={planningResult.aiGenerated}
          tags={tags}
          onSave={handleSaveClick}
          isSaving={savePlan.isPending}
        />
      )}

      <LoginRequiredModal
        open={isLoginModalOpen}
        message="플랜을 저장하려면 먼저 로그인해주세요."
        onClose={() => setLoginModalOpen(false)}
      />
      <SavePlanConfirmModal
        open={isSaveConfirmOpen}
        isSaving={savePlan.isPending}
        onCancel={() => setSaveConfirmOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
}
