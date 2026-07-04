import { useParams } from "react-router-dom";

import AutomationRecommendationList from "@/features/automation/components/AutomationRecommendationList";
import PlanningLoading from "@/features/planning/components/PlanningLoading";
import PlanningResultView from "@/features/planning/components/PlanningResultView";
import { useSavedPlanDetail } from "@/features/save/hooks/useSavedPlanDetail";

export default function SavedPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: savedPlan, isLoading } = useSavedPlanDetail(id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
      <h1 className="text-2xl font-bold">{savedPlan?.title ?? "저장된 플랜"}</h1>
      {isLoading && <PlanningLoading />}
      {savedPlan && (
        <p className="text-sm text-muted-foreground">
          {savedPlan.completedSteps} / {savedPlan.totalSteps} 단계 완료
        </p>
      )}
      {savedPlan && <PlanningResultView steps={savedPlan.steps} />}
      {savedPlan && <AutomationRecommendationList steps={savedPlan.steps} />}
    </div>
  );
}
