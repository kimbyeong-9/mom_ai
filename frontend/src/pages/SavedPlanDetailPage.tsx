import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getGoalTypeLabel } from "@/constants/goalTypes";
import { useAutomations } from "@/features/automation/hooks/useAutomations";
import { useConnectAutomation } from "@/features/automation/hooks/useConnectAutomation";
import PlanningLoading from "@/features/planning/components/PlanningLoading";
import SavedStepRow from "@/features/save/components/SavedStepRow";
import { useSavedPlanDetail } from "@/features/save/hooks/useSavedPlanDetail";
import { useToggleStepCompletion } from "@/features/save/hooks/useToggleStepCompletion";

export default function SavedPlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: savedPlan, isLoading } = useSavedPlanDetail(id);
  const { data: automations } = useAutomations();
  const connectAutomation = useConnectAutomation();
  const [connectingStepId, setConnectingStepId] = useState<string | null>(null);
  const toggleStepCompletion = useToggleStepCompletion(id ?? "");
  const [togglingStepId, setTogglingStepId] = useState<string | null>(null);

  const backLink = (
    <Link
      to="/saved"
      className="inline-flex w-fit items-center gap-1.5 rounded-full border-[1.5px] border-[#1F3D2E]/10 bg-white py-2 pl-2.5 pr-3.5 text-sm font-bold text-[#1F3D2E] shadow-[0_2px_10px_rgba(31,61,46,0.08)] transition-colors hover:border-[#1F3D2E]/25 hover:bg-[#1F3D2E]/5"
    >
      <ArrowLeft size={16} strokeWidth={2.25} />
      이전 화면
    </Link>
  );

  if (isLoading || !savedPlan) {
    return (
      <div className="relative mx-auto flex max-w-2xl flex-col gap-4 px-5 py-6 sm:gap-5 sm:px-11 sm:py-8">
        {backLink}
        <PlanningLoading />
      </div>
    );
  }

  const sortedSteps = [...savedPlan.steps].sort((a, b) => a.order - b.order);
  const connectedStepIds = new Set((automations ?? []).map((a) => a.planStepId));
  const completedStepIds = new Set(savedPlan.completedStepIds);
  const currentStepId = sortedSteps.find((step) => !completedStepIds.has(step.id))?.id;

  const handleConnect = (planStepId: string) => {
    setConnectingStepId(planStepId);
    connectAutomation.mutate(
      { planStepId, type: "notification" },
      { onSettled: () => setConnectingStepId(null) },
    );
  };

  const handleToggleComplete = (planStepId: string) => {
    setTogglingStepId(planStepId);
    toggleStepCompletion.mutate(planStepId, {
      onSettled: () => setTogglingStepId(null),
    });
  };

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col gap-4 px-5 py-6 sm:gap-5 sm:px-11 sm:py-8">
      {backLink}

      <div>
        <p className="text-xs font-bold text-[#1F3D2E]/45">{getGoalTypeLabel(savedPlan.goalType)}</p>
        <h1 className="mt-1 text-xl font-extrabold text-[#1F3D2E] sm:text-2xl">{savedPlan.title}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {sortedSteps.map((step) => (
          <SavedStepRow
            key={step.id}
            order={step.order}
            title={step.title}
            status={
              completedStepIds.has(step.id)
                ? "done"
                : step.id === currentStepId
                  ? "current"
                  : "upcoming"
            }
            automationConnected={connectedStepIds.has(step.id)}
            isConnecting={connectingStepId === step.id}
            isToggling={togglingStepId === step.id}
            onConnect={() => handleConnect(step.id)}
            onToggleComplete={() => handleToggleComplete(step.id)}
          />
        ))}
      </div>
    </div>
  );
}
