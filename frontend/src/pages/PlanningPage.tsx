import { useState } from "react";

import GoalInputForm from "@/features/planning/components/GoalInputForm";
import PlanningLoading from "@/features/planning/components/PlanningLoading";
import PlanningResultView from "@/features/planning/components/PlanningResultView";
import { useGoalInputForm } from "@/features/planning/hooks/useGoalInputForm";
import { usePlanningResult } from "@/features/planning/hooks/usePlanningResult";
import LoginRequiredModal from "@/features/save/components/LoginRequiredModal";
import SavePlanButton from "@/features/save/components/SavePlanButton";
import { useSavePlan } from "@/features/save/hooks/useSavePlan";
import { useAuthStore } from "@/store/auth.store";

export default function PlanningPage() {
  const { register, onSubmit, goalType, setGoalType, isSubmitting, planningId } =
    useGoalInputForm();
  const { data: planningResult, isLoading: isResultLoading } = usePlanningResult(planningId);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const savePlan = useSavePlan();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    if (planningId) {
      savePlan.mutate(planningId);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
      <h1 className="text-2xl font-bold">플랜 만들기</h1>
      <GoalInputForm
        goalType={goalType}
        onGoalTypeChange={setGoalType}
        register={register}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
      {isResultLoading && <PlanningLoading />}
      {planningResult && (
        <>
          <PlanningResultView steps={planningResult.steps} />
          <SavePlanButton onSave={handleSaveClick} isSaving={savePlan.isPending} />
        </>
      )}
      <LoginRequiredModal open={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
}
