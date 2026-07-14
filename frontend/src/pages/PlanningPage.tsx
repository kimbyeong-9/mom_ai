import { useState } from "react";

import GoalInputForm from "@/features/planning/components/GoalInputForm";
import PlanningEmptyState from "@/features/planning/components/PlanningEmptyState";
import PlanningLoading from "@/features/planning/components/PlanningLoading";
import PlanningResultCard from "@/features/planning/components/PlanningResultCard";
import { useGoalInputForm } from "@/features/planning/hooks/useGoalInputForm";
import { usePlanningResult } from "@/features/planning/hooks/usePlanningResult";
import LoginRequiredModal from "@/features/save/components/LoginRequiredModal";
import SavePlanConfirmModal from "@/features/save/components/SavePlanConfirmModal";
import { useSavePlan } from "@/features/save/hooks/useSavePlan";
import { usePageTitle } from "@/layouts/usePageTitle";
import { useAuthStore } from "@/store/auth.store";

export default function PlanningPage() {
  usePageTitle("새 목표 시작하기");
  const { register, onSubmit, onRegenerate, goalType, setGoalType, isSubmitting, planningId } =
    useGoalInputForm();
  const { data: planningResult, isLoading: isResultLoading } = usePlanningResult(planningId);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const savePlan = useSavePlan();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSaveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const handleSaveClick = () => {
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

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-6 sm:gap-[18px] sm:px-11 sm:py-8">
      <div>
        <h1 className="hidden text-xl font-extrabold text-[#1F3D2E] sm:block sm:text-2xl">
          새 목표 시작하기
        </h1>
        <p className="mt-1 text-[13px] text-[#1F3D2E]/55 sm:text-[13.5px]">
          무엇을 준비하고 있나요? 알려주시면 AI가 절차를 만들어드려요.
        </p>
      </div>

      <GoalInputForm
        goalType={goalType}
        onGoalTypeChange={setGoalType}
        register={register}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />

      {(isSubmitting || isResultLoading) && <PlanningLoading />}
      {!isSubmitting && !isResultLoading && !planningResult && <PlanningEmptyState />}
      {planningResult && (
        <PlanningResultCard
          title={planningResult.title}
          goalType={planningResult.goalType}
          goalText={planningResult.goalText}
          steps={planningResult.steps}
          aiGenerated={planningResult.aiGenerated}
          onSave={handleSaveClick}
          isSaving={savePlan.isPending}
          onRegenerate={onRegenerate}
        />
      )}

      <LoginRequiredModal open={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <SavePlanConfirmModal
        open={isSaveConfirmOpen}
        isSaving={savePlan.isPending}
        onCancel={() => setSaveConfirmOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
}
