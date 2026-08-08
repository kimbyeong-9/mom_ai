import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import QueryErrorState from "@/components/QueryErrorState";
import { GOAL_TYPES, type GoalTypeId } from "@/constants/goalTypes";
import SavedPlanCard from "@/features/save/components/SavedPlanCard";
import { useSavedPlans } from "@/features/save/hooks/useSavedPlans";

function isGoalTypeId(value: string | undefined): value is GoalTypeId {
  return GOAL_TYPES.some((type) => type.id === value);
}

export default function SavedCategoryPage() {
  const { goalType: goalTypeParam } = useParams<{ goalType: string }>();
  const { data: savedPlans, isLoading, isError, refetch } = useSavedPlans();

  const backLink = (
    <Link
      to="/saved"
      className="inline-flex w-fit items-center gap-1.5 rounded-full border-[1.5px] border-[#1F3D2E]/10 bg-white py-2 pl-2.5 pr-3.5 text-sm font-bold text-[#1F3D2E] shadow-[0_2px_10px_rgba(31,61,46,0.08)] transition-colors hover:border-[#1F3D2E]/25 hover:bg-[#1F3D2E]/5"
    >
      <ArrowLeft size={16} strokeWidth={2.25} />
      이전 화면
    </Link>
  );

  if (!isGoalTypeId(goalTypeParam)) {
    return (
      <div className="relative mx-auto flex max-w-3xl flex-col gap-4 px-5 py-6 sm:gap-[18px] sm:px-11 sm:py-8">
        {backLink}
        <p className="text-[13px] text-[#1F3D2E]/50">존재하지 않는 카테고리예요.</p>
      </div>
    );
  }

  const categoryLabel = GOAL_TYPES.find((type) => type.id === goalTypeParam)!.label;
  const categoryPlans = (savedPlans ?? []).filter((plan) => plan.goalType === goalTypeParam);

  return (
    <div className="relative mx-auto flex max-w-3xl flex-col gap-4 px-5 py-6 sm:gap-[18px] sm:px-11 sm:py-8">
      {backLink}

      <h1 className="mb-2 text-xl font-extrabold text-[#1F3D2E] sm:text-2xl">{categoryLabel}</h1>

      {isLoading && <p className="text-[13px] text-[#1F3D2E]/50">불러오는 중...</p>}
      {isError && (
        <QueryErrorState message="플랜을 불러오지 못했어요." onRetry={() => refetch()} />
      )}
      {savedPlans && categoryPlans.length === 0 && (
        <p className="text-[13px] text-[#1F3D2E]/50">아직 저장된 {categoryLabel} 플랜이 없어요.</p>
      )}
      {categoryPlans.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-[18px]">
          {categoryPlans.map((plan) => (
            <SavedPlanCard
              key={plan.id}
              id={plan.id}
              title={plan.title}
              goalType={plan.goalType}
              savedAt={plan.savedAt}
              countries={plan.countries}
              field={plan.field}
              completedSteps={plan.completedSteps}
              totalSteps={plan.totalSteps}
              automationConnected={plan.automationConnected}
              automationConnectedAt={plan.automationConnectedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
